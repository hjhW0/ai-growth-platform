from datetime import datetime
from extensions import db
from models.goal import Goal


def create_goal(user_id, data):
    """创建目标"""
    title = data.get('title')
    if not title:
        return None, '目标标题不能为空'

    goal = Goal(
        user_id=user_id,
        parent_id=data.get('parent_id'),
        title=title,
        description=data.get('description', ''),
        goal_type=data.get('goal_type', 'learning'),
        priority=data.get('priority', 'medium'),
        deadline=datetime.strptime(data['deadline'], '%Y-%m-%d').date() if data.get('deadline') else None
    )

    db.session.add(goal)
    db.session.commit()

    # 更新 path
    goal.update_path()
    db.session.commit()

    return goal, None


def get_goals(user_id, status=None, parent_id=None, include_children=False):
    """获取用户目标列表"""
    query = Goal.query.filter_by(user_id=user_id, is_deleted=False)

    if status:
        query = query.filter_by(status=status)

    if include_children:
        # 返回所有目标（含子目标）
        pass
    elif parent_id is not None:
        query = query.filter_by(parent_id=parent_id)
    else:
        # 默认只返回顶层目标
        query = query.filter_by(parent_id=None)

    return query.order_by(Goal.created_at.desc()).all()


def get_goal_by_id(user_id, goal_id):
    """获取单个目标"""
    return Goal.query.filter_by(
        id=goal_id, user_id=user_id, is_deleted=False
    ).first()


def update_goal(user_id, goal_id, data):
    """更新目标"""
    goal = Goal.query.filter_by(
        id=goal_id, user_id=user_id, is_deleted=False
    ).first()

    if not goal:
        return None, '目标不存在'

    if 'title' in data:
        goal.title = data['title']
    if 'description' in data:
        goal.description = data['description']
    if 'status' in data:
        goal.status = data['status']
        if data['status'] == 'completed':
            goal.completed_at = datetime.utcnow()
    if 'priority' in data:
        goal.priority = data['priority']
    if 'goal_type' in data:
        goal.goal_type = data['goal_type']
    if 'deadline' in data:
        goal.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d').date() if data['deadline'] else None

    db.session.commit()
    return goal, None


def delete_goal(user_id, goal_id):
    """删除目标（软删除）"""
    goal = Goal.query.filter_by(
        id=goal_id, user_id=user_id, is_deleted=False
    ).first()

    if not goal:
        return False, '目标不存在'

    goal.soft_delete()
    db.session.commit()
    return True, None
