from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.goal_service import (
    create_goal, get_goals, get_goal_by_id, update_goal, delete_goal
)

goals_bp = Blueprint('goals', __name__)


@goals_bp.route('/', methods=['POST'])
@jwt_required()
def add_goal():
    """创建目标"""
    user_id = get_jwt_identity()
    data = request.json

    goal, error = create_goal(user_id, data)
    if error:
        return jsonify({'code': 1, 'message': error}), 400

    return jsonify({
        'code': 0,
        'message': '目标创建成功',
        'data': goal.to_dict()
    }), 201


@goals_bp.route('/', methods=['GET'])
@jwt_required()
def list_goals():
    """获取用户的所有目标"""
    user_id = get_jwt_identity()
    status = request.args.get('status')
    parent_id = request.args.get('parent_id')
    include_children = request.args.get('include_children', 'false').lower() == 'true'

    goals = get_goals(user_id, status, parent_id, include_children)

    return jsonify({
        'code': 0,
        'message': 'success',
        'data': [g.to_dict() for g in goals]
    })


@goals_bp.route('/<int:goal_id>', methods=['GET'])
@jwt_required()
def get_goal(goal_id):
    """获取单个目标"""
    user_id = get_jwt_identity()
    goal = get_goal_by_id(user_id, goal_id)

    if not goal:
        return jsonify({'code': 1, 'message': '目标不存在'}), 404

    return jsonify({
        'code': 0,
        'message': 'success',
        'data': goal.to_dict()
    })


@goals_bp.route('/<int:goal_id>', methods=['PUT'])
@jwt_required()
def edit_goal(goal_id):
    """更新目标"""
    user_id = get_jwt_identity()
    data = request.json

    goal, error = update_goal(user_id, goal_id, data)
    if error:
        return jsonify({'code': 1, 'message': error}), 404

    return jsonify({
        'code': 0,
        'message': '目标更新成功',
        'data': goal.to_dict()
    })


@goals_bp.route('/<int:goal_id>', methods=['DELETE'])
@jwt_required()
def remove_goal(goal_id):
    """删除目标（软删除）"""
    user_id = get_jwt_identity()

    success, error = delete_goal(user_id, goal_id)
    if not success:
        return jsonify({'code': 1, 'message': error}), 404

    return jsonify({
        'code': 0,
        'message': '目标删除成功'
    })


@goals_bp.route('/<int:goal_id>/generate-tasks', methods=['POST'])
@jwt_required()
def generate_tasks(goal_id):
    """AI生成任务并写入数据库"""
    user_id = get_jwt_identity()

    goal = get_goal_by_id(user_id, goal_id)
    if not goal:
        return jsonify({'code': 1, 'message': '目标不存在'}), 404

    try:
        from services.ai_service import generate_plan
        from services.task_service import create_tasks_from_ai

        result = generate_plan(goal.title, goal.description)
        tasks = create_tasks_from_ai(user_id, goal_id, result['tasks'])

        return jsonify({
            'code': 0,
            'message': 'AI任务生成成功',
            'data': {
                'goal': goal.title,
                'tasks_created': len(tasks)
            }
        })
    except RuntimeError as e:
        return jsonify({'code': 1, 'message': str(e)}), 500
    except Exception as e:
        return jsonify({'code': 1, 'message': f'生成失败: {str(e)}'}), 500
