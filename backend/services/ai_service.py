import json
from utils.ai_client import chat


def clean_json_response(response):
    """清理AI输出中的markdown格式、think标签和多余文字"""
    response = response.strip()

    # 去掉 deepseek-r1 的 think 标签
    import re
    response = re.sub(r'<think>.*?</think>', '', response, flags=re.DOTALL).strip()

    # 去掉代码块标记
    if response.startswith('```json'):
        response = response[7:]
    elif response.startswith('```'):
        response = response[3:]
    if response.endswith('```'):
        response = response[:-3]

    # 去掉前后多余的空行和空格
    return response.strip()


def parse_ai_json(response, goal_title):
    """解析AI返回的JSON，处理多种格式异常"""
    import re

    # 1. 先尝试直接解析
    try:
        data = json.loads(response)
        if isinstance(data, dict) and 'tasks' in data:
            return data
    except json.JSONDecodeError:
        pass

    # 2. 尝试提取第一个完整的JSON对象
    try:
        # 找到第一个 { 和对应的 }
        start = response.find('{')
        if start != -1:
            depth = 0
            for i in range(start, len(response)):
                if response[i] == '{':
                    depth += 1
                elif response[i] == '}':
                    depth -= 1
                    if depth == 0:
                        first_json = response[start:i+1]
                        data = json.loads(first_json)
                        if isinstance(data, dict) and 'tasks' in data:
                            return data
                        break
    except json.JSONDecodeError:
        pass

    # 3. 尝试合并多个JSON对象（AI有时每天返回一个JSON）
    try:
        all_tasks = []
        # 匹配所有 {...} 模式
        json_pattern = re.compile(r'\{[^{}]*\{[^{}]*\}[^{}]*\}|\{[^{}]*\}')
        matches = json_pattern.finditer(response)
        for match in matches:
            try:
                obj = json.loads(match.group())
                if 'tasks' in obj and isinstance(obj['tasks'], list):
                    all_tasks.extend(obj['tasks'])
            except json.JSONDecodeError:
                continue
        if all_tasks:
            return {'goal': goal_title, 'tasks': all_tasks}
    except Exception:
        pass

    # 4. 所有方法都失败，返回空任务
    return {'goal': goal_title, 'tasks': []}


def generate_plan(goal_title, goal_description=None):
    """调用AI生成结构化任务计划"""
    # 预处理：拒绝过短或模糊的目标
    if len(goal_title.strip()) < 4:
        return {
            'goal': goal_title,
            'tasks': [],
            'hint': '请提供更具体的目标，例如：三个月减脂5公斤、一个月学会Python基础'
        }

    prompt = f'''你是一个专业学习规划助手。

请将用户目标拆解为可执行的每日任务计划。

严格遵守以下规则：
1. 输出必须是纯JSON，不要任何markdown格式，不要代码块
2. 不要在JSON前后加任何解释性文字
3. 每个任务时长控制在30-120分钟，不要超过120分钟
4. 每天任务数量不超过5个
5. 任务必须具体可执行，不要出现"学习XX"这样模糊的描述
6. 优先级只能是high/medium/low三个值
7. 至少生成10个任务，不得少于10个
8. 必须输出完整的JSON，包含所有任务，不要中途截断

用户目标：
{goal_title}

补充说明：
{goal_description or "无"}

输出格式：
{{
  "goal": "...",
  "tasks": [
    {{
      "title": "...",
      "duration": 90,
      "priority": "high",
      "day": 1
    }}
  ]
}}'''

    messages = [{'role': 'user', 'content': prompt}]
    response = chat(messages, temperature=0.7)

    # 清理AI输出
    response = clean_json_response(response)

    # 解析JSON（处理多种格式异常）
    return parse_ai_json(response, goal_title)
