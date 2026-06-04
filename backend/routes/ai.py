import uuid
import json
import logging
from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.ai_chat import AIChat
from models.growth_log import GrowthLog
from utils.ai_client import generate_learning_plan, generate_daily_review, generate_growth_advice, generate_weekly_report
from services.ai_service import generate_plan
from services.review_service import generate_review
from services.report_service import generate_weekly_report as generate_weekly_report_auto

ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/generate-plan', methods=['POST'])
@jwt_required()
def generate_plan_api():
    """AI生成结构化任务计划"""
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('title'):
        return jsonify({'code': 1, 'message': '请提供目标标题'}), 400

    try:
        result = generate_plan(data['title'], data.get('description'))
        return jsonify({'code': 0, 'data': result})
    except RuntimeError as e:
        return jsonify({'code': 1, 'message': str(e)}), 500


@ai_bp.route('/daily-review', methods=['POST'])
@jwt_required()
def daily_review_api():
    """AI自动复盘：读取今日数据，生成复盘，保存成长日志"""
    user_id = get_jwt_identity()
    try:
        result = generate_review(user_id)
        return jsonify({'code': 0, 'data': result})
    except RuntimeError as e:
        return jsonify({'code': 1, 'message': str(e)}), 500
    except Exception as e:
        return jsonify({'code': 1, 'message': f'复盘生成失败: {str(e)}'}), 500


@ai_bp.route('/growth-logs', methods=['GET'])
@jwt_required()
def get_growth_logs():
    """获取成长日志列表"""
    user_id = get_jwt_identity()
    limit = request.args.get('limit', 10, type=int)

    logs = GrowthLog.query.filter_by(
        user_id=user_id, is_deleted=False
    ).order_by(GrowthLog.log_date.desc()).limit(limit).all()

    return jsonify({
        'code': 0,
        'data': [log.to_dict() for log in logs]
    })


@ai_bp.route('/auto-weekly-report', methods=['POST'])
@jwt_required()
def auto_weekly_report_api():
    """AI自动周报：读取本周数据，生成周报告，保存成长日志"""
    user_id = get_jwt_identity()
    try:
        result = generate_weekly_report_auto(user_id)
        return jsonify({'code': 0, 'data': result})
    except RuntimeError as e:
        return jsonify({'code': 1, 'message': str(e)}), 500
    except Exception as e:
        return jsonify({'code': 1, 'message': f'周报生成失败: {str(e)}'}), 500


def save_chat(user_id, role, content, chat_type='general', conversation_id=None, model=None):
    """保存对话记录"""
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
    chat = AIChat(
        user_id=user_id,
        conversation_id=conversation_id,
        role=role,
        content=content,
        chat_type=chat_type,
        model=model
    )
    db.session.add(chat)
    db.session.commit()
    return chat


@ai_bp.route('/plan', methods=['POST'])
@jwt_required()
def ai_plan():
    """AI生成学习计划"""
    user_id = get_jwt_identity()
    data = request.json
    goal = data.get('goal')

    if not goal:
        return jsonify({'error': '目标不能为空'}), 400

    conversation_id = str(uuid.uuid4())

    # 保存用户消息
    save_chat(user_id, 'user', f'生成学习计划：{goal}', 'plan', conversation_id)

    # 生成计划
    plan = generate_learning_plan(goal)

    # 保存AI回复
    save_chat(user_id, 'assistant', plan, 'plan', conversation_id, 'deepseek-chat')

    return jsonify({'plan': plan, 'conversation_id': conversation_id})


@ai_bp.route('/review', methods=['POST'])
@jwt_required()
def ai_review():
    """AI每日复盘"""
    user_id = get_jwt_identity()
    data = request.json
    tasks_completed = data.get('tasks_completed', '')
    mood = data.get('mood', '一般')

    conversation_id = str(uuid.uuid4())

    # 保存用户消息
    save_chat(user_id, 'user', f'每日复盘 - 心情：{mood}\n完成任务：{tasks_completed}', 'review', conversation_id)

    # 生成复盘
    review = generate_daily_review(tasks_completed, mood)

    # 保存AI回复
    save_chat(user_id, 'assistant', review, 'review', conversation_id, 'deepseek-chat')

    return jsonify({'review': review, 'conversation_id': conversation_id})


@ai_bp.route('/advice', methods=['POST'])
@jwt_required()
def ai_advice():
    """AI成长建议"""
    user_id = get_jwt_identity()
    data = request.json
    growth_history = data.get('growth_history', '')

    conversation_id = str(uuid.uuid4())

    # 保存用户消息
    save_chat(user_id, 'user', '获取成长建议', 'advice', conversation_id)

    # 生成建议
    advice = generate_growth_advice(growth_history)

    # 保存AI回复
    save_chat(user_id, 'assistant', advice, 'advice', conversation_id, 'deepseek-chat')

    return jsonify({'advice': advice, 'conversation_id': conversation_id})


@ai_bp.route('/weekly-report', methods=['POST'])
@jwt_required()
def ai_weekly_report():
    """AI周报告"""
    user_id = get_jwt_identity()
    data = request.json
    weekly_data = data.get('weekly_data', '')

    conversation_id = str(uuid.uuid4())

    # 保存用户消息
    save_chat(user_id, 'user', '生成周报告', 'weekly_report', conversation_id)

    # 生成报告
    report = generate_weekly_report(weekly_data)

    # 保存AI回复
    save_chat(user_id, 'assistant', report, 'weekly_report', conversation_id, 'deepseek-chat')

    return jsonify({'report': report, 'conversation_id': conversation_id})


SYSTEM_PROMPT = """你是AI成长助手。

规则：
- 直接回答用户最后一句话
- 不要介绍自己
- 不要复述规则
- 不要解释你的工作方式
- 不要说"请告诉我你的问题"
- 使用自然中文
- 回答简洁

特殊情况：
- 用户开心时，正常共鸣
- 用户难过时，正常安慰
- 普通问题直接回答

示例：
用户：1+1等于几
助手：2

用户：你好
助手：你好呀！

用户：我今天很开心
助手：太好了！发生什么开心的事情了吗？
"""

BAD_PATTERNS = [
    "我是AI成长助手",
    "请告诉我你的问题",
    "我会按照这些规则",
    "我将根据你的输入",
    "我是你的成长教练",
    "有什么可以帮助你"
]


@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def ai_chat():
    """通用AI对话"""
    user_id = get_jwt_identity()
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({'error': '消息不能为空'}), 400

    conversation_id = data.get('conversation_id') or str(uuid.uuid4())

    logging.info(f'chat: user={user_id}, conversation={conversation_id}')

    # 保存用户消息
    save_chat(user_id, 'user', message, 'general', conversation_id)

    # 获取历史消息（最多4条，2轮对话）
    history = AIChat.query.filter_by(
        user_id=user_id,
        conversation_id=conversation_id,
        is_deleted=False
    ).order_by(AIChat.created_at.desc()).limit(4).all()
    history.reverse()  # 按时间正序

    # 构造消息列表
    messages = [{'role': 'system', 'content': SYSTEM_PROMPT}]

    for h in history:
        messages.append({'role': h.role, 'content': h.content})

    from utils.ai_client import chat, MODEL_CHAT

    response = chat(messages, temperature=0.3, model=MODEL_CHAT)

    # 兜底：过滤废话回复
    if any(p in response for p in BAD_PATTERNS):
        response = "收到，你可以继续说。"

    # 保存AI回复
    save_chat(user_id, 'assistant', response, 'general', conversation_id, 'deepseek-chat')

    return jsonify({'response': response, 'conversation_id': conversation_id})


@ai_bp.route('/chat/stream', methods=['POST'])
@jwt_required()
def ai_chat_stream():
    """SSE 流式 AI 对话"""
    user_id = get_jwt_identity()
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({'error': '消息不能为空'}), 400

    conversation_id = data.get('conversation_id') or str(uuid.uuid4())

    logging.info(f'chat_stream: user={user_id}, conversation={conversation_id}')

    # 保存用户消息
    save_chat(user_id, 'user', message, 'general', conversation_id)

    # 获取历史消息
    history = AIChat.query.filter_by(
        user_id=user_id, conversation_id=conversation_id, is_deleted=False
    ).order_by(AIChat.created_at.desc()).limit(4).all()
    history.reverse()

    messages = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    for h in history:
        messages.append({'role': h.role, 'content': h.content})

    from utils.ai_client import chat_stream, MODEL_CHAT
    from flask import current_app

    app = current_app._get_current_object()

    def generate():
        full_response = []
        for token in chat_stream(messages, temperature=0.3, model=MODEL_CHAT):
            full_response.append(token)
            yield f"data: {json.dumps({'content': token}, ensure_ascii=False)}\n\n"

        # 过滤废话
        complete = ''.join(full_response)
        if any(p in complete for p in BAD_PATTERNS):
            complete = '收到，你可以继续说。'
            yield f"data: {json.dumps({'content': '[REPLACE]', 'replace': complete}, ensure_ascii=False)}\n\n"

        # 保存AI回复（需要应用上下文）
        with app.app_context():
            save_chat(user_id, 'assistant', complete, 'general', conversation_id, 'deepseek-chat')
        yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id}, ensure_ascii=False)}\n\n"

    return Response(generate(), mimetype='text/event-stream',
                    headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'})


@ai_bp.route('/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """获取对话历史"""
    user_id = get_jwt_identity()
    chat_type = request.args.get('type')
    conversation_id = request.args.get('conversation_id')

    query = AIChat.query.filter_by(user_id=user_id, is_deleted=False)

    if chat_type:
        query = query.filter_by(chat_type=chat_type)
    if conversation_id:
        query = query.filter_by(conversation_id=conversation_id)

    chats = query.order_by(AIChat.created_at.desc()).limit(50).all()

    return jsonify({'history': [c.to_dict() for c in chats]})
