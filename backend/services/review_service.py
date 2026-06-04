from datetime import datetime
from extensions import db
from models.task import DailyTask
from models.checkin import CheckIn
from models.growth_log import GrowthLog
from utils.ai_client import chat


def get_today_data(user_id):
    """读取用户今日的任务和打卡数据"""
    today = datetime.now().date()

    # 今日任务
    tasks = DailyTask.query.filter_by(
        user_id=user_id, task_date=today, is_deleted=False
    ).all()

    total = len(tasks)
    completed = [t for t in tasks if t.status == 'completed']
    pending = [t for t in tasks if t.status != 'completed']

    # 打卡状态
    checkin = CheckIn.query.filter_by(
        user_id=user_id, check_date=today, is_deleted=False
    ).first()

    return {
        'date': today.isoformat(),
        'total': total,
        'completed_count': len(completed),
        'pending_count': len(pending),
        'rate': round(len(completed) / total * 100, 1) if total > 0 else 0,
        'completed_tasks': [t.title for t in completed],
        'pending_tasks': [t.title for t in pending],
        'checked_in': checkin is not None,
        'mood': checkin.mood if checkin else None,
        'checkin_note': checkin.note if checkin else None
    }


def build_review_prompt(data):
    """根据今日数据构建复盘 prompt"""
    completed_str = '、'.join(data['completed_tasks']) if data['completed_tasks'] else '无'
    pending_str = '、'.join(data['pending_tasks']) if data['pending_tasks'] else '无'
    checkin_str = '已完成' if data['checked_in'] else '未打卡'
    mood_str = data['mood'] if data['mood'] else '未记录'

    return f'''你是一个专业的成长教练。请根据用户今日的数据生成复盘。

用户今日数据：
- 日期：{data['date']}
- 完成任务：{data['completed_count']} 个（{completed_str}）
- 未完成任务：{data['pending_count']} 个（{pending_str}）
- 任务完成率：{data['rate']}%
- 打卡状态：{checkin_str}
- 今日心情：{mood_str}

请输出以下内容（限制300字以内）：
1. 今日表现总结
2. 做得好的地方
3. 存在的问题
4. 明日建议

使用中文，语气温暖鼓励，但要诚实指出问题。'''


def generate_review(user_id):
    """生成今日复盘并保存到 GrowthLog"""
    # 1. 读取今日数据
    data = get_today_data(user_id)

    if data['total'] == 0:
        return {
            'data': data,
            'review': '今日暂无任务记录，无法生成复盘。建议先创建一些任务并开始执行。',
            'saved': False
        }

    # 2. 构建 prompt
    prompt = build_review_prompt(data)

    # 3. 调用 AI
    messages = [{'role': 'user', 'content': prompt}]
    review_text = chat(messages, temperature=0.7)

    # 4. 保存到 GrowthLog
    log = GrowthLog(
        user_id=user_id,
        log_date=datetime.now().date(),
        content=review_text,
        mood=data['mood'],
        ai_summary=review_text,
        tags='daily_review'
    )
    db.session.add(log)
    db.session.commit()

    return {
        'data': data,
        'review': review_text,
        'saved': True,
        'log_id': log.id
    }
