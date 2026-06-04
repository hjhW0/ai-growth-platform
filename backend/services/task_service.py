from datetime import datetime, timedelta
from extensions import db
from models.task import DailyTask


def create_tasks_from_ai(user_id, goal_id, ai_tasks):
    """将AI生成的任务写入数据库"""
    tasks = []
    today = datetime.utcnow().date()

    for t in ai_tasks:
        day_offset = t.get('day', 1) - 1  # day=1对应今天
        due_date = today + timedelta(days=day_offset)

        task = DailyTask(
            user_id=user_id,
            goal_id=goal_id,
            title=t['title'],
            task_date=due_date,
            duration=t.get('duration'),
            priority=t.get('priority', 'medium'),
            status='pending'
        )
        db.session.add(task)
        tasks.append(task)

    db.session.commit()
    return tasks
