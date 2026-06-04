from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.task import DailyTask
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)


@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    """创建每日任务"""
    user_id = get_jwt_identity()
    data = request.json

    title = data.get('title')
    if not title:
        return jsonify({'error': '任务标题不能为空'}), 400

    task = DailyTask(
        user_id=user_id,
        goal_id=data.get('goal_id'),
        title=title,
        description=data.get('description', ''),
        task_date=datetime.strptime(data.get('task_date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        priority=data.get('priority', 'medium'),
        order=data.get('order', 0),
        duration=data.get('duration')
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({'message': '任务创建成功', 'task': task.to_dict()}), 201


@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    """获取任务列表"""
    user_id = get_jwt_identity()
    task_date = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    goal_id = request.args.get('goal_id')
    status = request.args.get('status')

    query = DailyTask.query.filter_by(user_id=user_id, is_deleted=False)

    if task_date:
        query = query.filter_by(task_date=datetime.strptime(task_date, '%Y-%m-%d').date())
    if goal_id:
        query = query.filter_by(goal_id=goal_id)
    if status:
        query = query.filter_by(status=status)

    tasks = query.order_by(DailyTask.order, DailyTask.created_at).all()

    return jsonify({'tasks': [t.to_dict() for t in tasks]})


@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """获取单个任务"""
    user_id = get_jwt_identity()
    task = DailyTask.query.filter_by(id=task_id, user_id=user_id, is_deleted=False).first()

    if not task:
        return jsonify({'error': '任务不存在'}), 404

    return jsonify({'task': task.to_dict()})


@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """更新任务"""
    user_id = get_jwt_identity()
    task = DailyTask.query.filter_by(id=task_id, user_id=user_id, is_deleted=False).first()

    if not task:
        return jsonify({'error': '任务不存在'}), 404

    data = request.json

    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
        if data['status'] == 'completed':
            task.completed_at = datetime.utcnow()
    if 'priority' in data:
        task.priority = data['priority']
    if 'order' in data:
        task.order = data['order']
    if 'duration' in data:
        task.duration = data['duration']
    if 'task_date' in data:
        task.task_date = datetime.strptime(data['task_date'], '%Y-%m-%d').date()

    db.session.commit()

    return jsonify({'message': '任务更新成功', 'task': task.to_dict()})


@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """删除任务（软删除）"""
    user_id = get_jwt_identity()
    task = DailyTask.query.filter_by(id=task_id, user_id=user_id, is_deleted=False).first()

    if not task:
        return jsonify({'error': '任务不存在'}), 404

    task.soft_delete()
    db.session.commit()

    return jsonify({'message': '任务删除成功'})


@tasks_bp.route('/<int:task_id>/complete', methods=['POST'])
@jwt_required()
def complete_task(task_id):
    """完成任务"""
    user_id = get_jwt_identity()
    task = DailyTask.query.filter_by(id=task_id, user_id=user_id, is_deleted=False).first()

    if not task:
        return jsonify({'error': '任务不存在'}), 404

    task.complete()
    db.session.commit()

    return jsonify({'message': '任务已完成', 'task': task.to_dict()})
