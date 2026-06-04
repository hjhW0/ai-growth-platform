import re
import json
import requests
from config import Config

# 从 Config 统一读取
USE_LOCAL = Config.USE_LOCAL_AI
DEEPSEEK_API_KEY = Config.DEEPSEEK_API_KEY
DEEPSEEK_BASE_URL = Config.DEEPSEEK_BASE_URL
OLLAMA_URL = f'{Config.OLLAMA_BASE}/api/chat'
MODEL_CHAT = Config.MODEL_CHAT
MODEL_REASONING = Config.MODEL_REASONING


def chat_with_deepseek(messages, temperature=0.7):
    """调用 DeepSeek API（使用 requests）"""
    response = requests.post(
        f'{DEEPSEEK_BASE_URL}/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'deepseek-chat',
            'messages': messages,
            'temperature': temperature
        },
        timeout=60
    )

    if response.status_code != 200:
        raise RuntimeError(f'DeepSeek API error: {response.status_code} {response.text}')

    return response.json()['choices'][0]['message']['content']


def chat_with_ollama(messages, temperature=0.7, model=None):
    """调用本地 Ollama（使用 /api/chat 接口）"""
    model = model or MODEL_REASONING
    # qwen3 系列用 think=False 关闭思考模式，提速
    use_think = 'qwen3' not in model
    response = requests.post(
        OLLAMA_URL,
        json={
            'model': model,
            'messages': messages,
            'stream': False,
            'think': use_think,
            'options': {'temperature': temperature}
        },
        timeout=300
    )

    result = response.json()['message']['content']

    # 清理 think 标签（兜底）
    result = re.sub(r'<think>.*?</think>', '', result, flags=re.DOTALL).strip()

    return result


def chat(messages, temperature=0.7, model=None):
    """统一调用接口"""
    try:
        if USE_LOCAL:
            return chat_with_ollama(messages, temperature, model)
        else:
            return chat_with_deepseek(messages, temperature)
    except Exception as e:
        raise RuntimeError(f'AI调用失败: {str(e)}')


def chat_with_ollama_stream(messages, temperature=0.7, model=None):
    """Ollama 流式调用，逐 token 返回"""
    model = model or MODEL_REASONING
    use_think = 'qwen3' not in model
    response = requests.post(
        OLLAMA_URL,
        json={
            'model': model,
            'messages': messages,
            'stream': True,
            'think': use_think,
            'options': {'temperature': temperature}
        },
        stream=True,
        timeout=300
    )
    in_think = False
    for line in response.iter_lines():
        if not line:
            continue
        chunk = json.loads(line)
        if 'message' not in chunk:
            continue
        token = chunk['message'].get('content', '')
        # 过滤 think 标签内容
        if '<think>' in token:
            in_think = True
            continue
        if '</think>' in token:
            in_think = False
            continue
        if in_think:
            continue
        yield token
        if chunk.get('done'):
            break


def chat_with_deepseek_stream(messages, temperature=0.7):
    """DeepSeek 流式调用，逐 token 返回"""
    response = requests.post(
        f'{DEEPSEEK_BASE_URL}/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'deepseek-chat',
            'messages': messages,
            'temperature': temperature,
            'stream': True
        },
        stream=True,
        timeout=60
    )
    for line in response.iter_lines():
        if not line:
            continue
        line = line.decode('utf-8')
        if line.startswith('data: '):
            data = line[6:]
            if data == '[DONE]':
                break
            chunk = json.loads(data)
            delta = chunk['choices'][0].get('delta', {})
            token = delta.get('content', '')
            if token:
                yield token


def chat_stream(messages, temperature=0.7, model=None):
    """统一流式调用接口"""
    try:
        if USE_LOCAL:
            yield from chat_with_ollama_stream(messages, temperature, model)
        else:
            yield from chat_with_deepseek_stream(messages, temperature)
    except Exception as e:
        yield f'[错误: {str(e)}]'


def generate_learning_plan(goal):
    """生成学习计划"""
    messages = [
        {
            'role': 'system',
            'content': '''你是一个专业的成长规划教练。
请根据用户的目标，生成详细的学习计划。
输出格式要求：
- 年目标
- 月目标
- 周目标
- 今日任务（3-5项）

使用中文回答，语言要亲切有鼓励性。'''
        },
        {
            'role': 'user',
            'content': f'我的目标是：{goal}'
        }
    ]
    return chat(messages)


def generate_daily_review(tasks_completed, mood):
    """生成每日复盘总结"""
    messages = [
        {
            'role': 'system',
            'content': '''你是一个成长教练，帮用户做每日复盘。
根据用户完成的任务和心情，给出：
1. 今日总结
2. 亮点
3. 改进建议
4. 明日建议

使用中文，语气温暖鼓励。'''
        },
        {
            'role': 'user',
            'content': f'今日完成任务：{tasks_completed}\n今日心情：{mood}'
        }
    ]
    return chat(messages)


def generate_growth_advice(growth_history):
    """生成成长建议"""
    messages = [
        {
            'role': 'system',
            'content': '''你是一个成长教练，根据用户近期的成长记录，
给出个性化的成长建议和鼓励。
分析用户的优势和待改进的地方。

使用中文，语气专业但亲切。'''
        },
        {
            'role': 'user',
            'content': f'我的成长记录：{growth_history}'
        }
    ]
    return chat(messages)


def generate_weekly_report(weekly_data):
    """生成每周成长报告"""
    messages = [
        {
            'role': 'system',
            'content': '''你是一个成长教练，根据用户本周的数据，
生成一份详细的周报告。

报告包括：
1. 本周概览（完成率、学习时长）
2. 优势分析
3. 待改进地方
4. 下周建议

使用中文，语气专业但亲切，有鼓励性。'''
        },
        {
            'role': 'user',
            'content': f'本周数据：{weekly_data}'
        }
    ]
    return chat(messages)
