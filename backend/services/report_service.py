from datetime import datetime, timedelta
from extensions import db
from models.task import DailyTask
from models.checkin import CheckIn
from models.growth_log import GrowthLog
from models.goal import Goal
from utils.ai_client import chat


def get_week_data(user_id):
    """读取用户最近7天的任务、打卡、目标数据"""
    today = datetime.now().date()
    week_start = today - timedelta(days=6)  # 最近7天（含今天）

    # 7天任务统计
    tasks = DailyTask.query.filter(
        DailyTask.user_id == user_id,
        DailyTask.task_date >= week_start,
        DailyTask.task_date <= today,
        DailyTask.is_deleted == False
    ).all()

    total_tasks = len(tasks)
    completed_tasks = [t for t in tasks if t.status == 'completed']
    pending_tasks = [t for t in tasks if t.status != 'completed']

    # 每天的任务分布
    daily_data = {}
    for i in range(7):
        date = week_start + timedelta(days=i)
        date_str = date.isoformat()
        day_tasks = [t for t in tasks if t.task_date == date]
        day_completed = [t for t in day_tasks if t.status == 'completed']
        daily_data[date_str] = {
            'total': len(day_tasks),
            'completed': len(day_completed),
            'rate': round(len(day_completed) / len(day_tasks) * 100, 1) if day_tasks else 0
        }

    # 打卡统计
    checkins = CheckIn.query.filter(
        CheckIn.user_id == user_id,
        CheckIn.check_date >= week_start,
        CheckIn.check_date <= today,
        CheckIn.is_deleted == False
    ).all()

    checkin_dates = [c.check_date.isoformat() for c in checkins]
    checkin_count = len(checkins)

    # 心情统计
    moods = {}
    for c in checkins:
        if c.mood:
            moods[c.mood] = moods.get(c.mood, 0) + 1

    # 活跃目标
    active_goals = Goal.query.filter_by(
        user_id=user_id, status='active', is_deleted=False
    ).all()

    # 最近的成长日志
    growth_logs = GrowthLog.query.filter(
        GrowthLog.user_id == user_id,
        GrowthLog.log_date >= week_start,
        GrowthLog.log_date <= today,
        GrowthLog.is_deleted == False
    ).order_by(GrowthLog.log_date.desc()).all()

    # 计算总学习时长
    total_duration = sum(t.duration or 0 for t in completed_tasks)

    return {
        'week_start': week_start.isoformat(),
        'week_end': today.isoformat(),
        'total_tasks': total_tasks,
        'completed_count': len(completed_tasks),
        'pending_count': len(pending_tasks),
        'rate': round(len(completed_tasks) / total_tasks * 100, 1) if total_tasks > 0 else 0,
        'daily_data': daily_data,
        'checkin_count': checkin_count,
        'checkin_dates': checkin_dates,
        'moods': moods,
        'total_duration_minutes': total_duration,
        'active_goals': [{'title': g.title, 'priority': g.priority, 'type': g.goal_type} for g in active_goals],
        'growth_logs_count': len(growth_logs),
        'completed_task_titles': [t.title for t in completed_tasks[:10]],  # 最多10个
        'pending_task_titles': [t.title for t in pending_tasks[:10]]
    }


def build_report_prompt(data):
    """构建周报 prompt"""
    # 每天完成率
    daily_summary = []
    for date, d in data['daily_data'].items():
        weekday = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][datetime.strptime(date, '%Y-%m-%d').weekday()]
        daily_summary.append(f"  {weekday}({date}): {d['completed']}/{d['total']} 完成率{d['rate']}%")
    daily_str = '\n'.join(daily_summary)

    completed_str = '、'.join(data['completed_task_titles']) if data['completed_task_titles'] else '无'
    pending_str = '、'.join(data['pending_task_titles']) if data['pending_task_titles'] else '无'

    # 目标
    goals_str = '、'.join([g['title'] for g in data['active_goals']]) if data['active_goals'] else '无'

    # 心情
    mood_str = '、'.join([f"{k}({v}次)" for k, v in data['moods'].items()]) if data['moods'] else '未记录'

    return f'''你是一个专业的成长教练。请根据用户本周的数据生成周报告。

用户本周数据（{data['week_start']} 至 {data['week_end']}）：

任务统计：
- 总任务数：{data['total_tasks']}
- 已完成：{data['completed_count']}
- 未完成：{data['pending_count']}
- 总完成率：{data['rate']}%
- 总学习时长：{data['total_duration_minutes']} 分钟

每日完成情况：
{daily_str}

打卡统计：
- 打卡天数：{data['checkin_count']}/7
- 心情分布：{mood_str}

当前活跃目标：{goals_str}

已完成任务：{completed_str}
未完成任务：{pending_str}

请输出以下内容（限制500字以内）：

【本周表现】
用1-2句话总结本周整体表现。

【数据亮点】
列出2-3个做得好的具体数据点。

【存在问题】
列出1-2个需要改进的问题。

【改进建议】
给出2-3条具体可执行的改进建议。

【下周行动】
给出3条下周的具体行动建议，要可执行。

使用中文，语气专业但有鼓励性。不要使用markdown格式。'''


def generate_weekly_report(user_id):
    """生成周报告"""
    # 1. 读取本周数据
    data = get_week_data(user_id)

    if data['total_tasks'] == 0:
        return {
            'data': data,
            'report': '本周暂无任务记录，无法生成周报告。建议开始创建任务并坚持执行。',
            'saved': False
        }

    # 2. 构建 prompt
    prompt = build_report_prompt(data)

    # 3. 调用 AI
    messages = [{'role': 'user', 'content': prompt}]
    report_text = chat(messages, temperature=0.7)

    # 4. 保存到 GrowthLog
    log = GrowthLog(
        user_id=user_id,
        log_date=datetime.now().date(),
        content=report_text,
        mood=None,
        ai_summary=report_text,
        tags='weekly_report'
    )
    db.session.add(log)
    db.session.commit()

    return {
        'data': data,
        'report': report_text,
        'saved': True,
        'log_id': log.id
    }
