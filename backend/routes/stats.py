from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.task import DailyTask
from models.goal import Goal
from models.checkin import CheckIn
from datetime import datetime, timedelta

stats_bp = Blueprint('stats', __name__)


@stats_bp.route('/today', methods=['GET'])
@jwt_required()
def get_today_stats():
    """获取今日统计"""
    user_id = get_jwt_identity()
    today = datetime.now().date()

    total = DailyTask.query.filter_by(
        user_id=user_id, task_date=today, is_deleted=False
    ).count()

    completed = DailyTask.query.filter_by(
        user_id=user_id, task_date=today, is_deleted=False, status='completed'
    ).count()

    rate = round(completed / total * 100, 1) if total > 0 else 0

    return jsonify({
        'date': today.isoformat(),
        'total': total,
        'completed': completed,
        'rate': rate
    })


@stats_bp.route('/week', methods=['GET'])
@jwt_required()
def get_week_stats():
    """获取本周统计"""
    user_id = get_jwt_identity()
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())

    week_data = []
    for i in range(7):
        date = week_start + timedelta(days=i)

        total = DailyTask.query.filter_by(
            user_id=user_id, task_date=date, is_deleted=False
        ).count()

        completed = DailyTask.query.filter_by(
            user_id=user_id, task_date=date, is_deleted=False, status='completed'
        ).count()

        week_data.append({
            'date': date.isoformat(),
            'total': total,
            'completed': completed,
            'rate': round(completed / total * 100, 1) if total > 0 else 0
        })

    return jsonify({'week_data': week_data})


@stats_bp.route('/month', methods=['GET'])
@jwt_required()
def get_month_stats():
    """获取本月统计"""
    user_id = get_jwt_identity()
    today = datetime.now().date()
    month_start = today.replace(day=1)

    total = DailyTask.query.filter(
        DailyTask.user_id == user_id,
        DailyTask.task_date >= month_start,
        DailyTask.is_deleted == False
    ).count()

    completed = DailyTask.query.filter(
        DailyTask.user_id == user_id,
        DailyTask.task_date >= month_start,
        DailyTask.is_deleted == False,
        DailyTask.status == 'completed'
    ).count()

    rate = round(completed / total * 100, 1) if total > 0 else 0

    return jsonify({
        'month': today.strftime('%Y-%m'),
        'total': total,
        'completed': completed,
        'rate': rate
    })


@stats_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_overview():
    """获取总览统计"""
    user_id = get_jwt_identity()

    # 目标统计
    total_goals = Goal.query.filter_by(user_id=user_id, is_deleted=False).count()
    active_goals = Goal.query.filter_by(user_id=user_id, is_deleted=False, status='active').count()
    completed_goals = Goal.query.filter_by(user_id=user_id, is_deleted=False, status='completed').count()

    # 打卡统计
    total_checkins = CheckIn.query.filter_by(user_id=user_id, is_deleted=False).count()

    # 本周完成任务数
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())
    week_completed = DailyTask.query.filter(
        DailyTask.user_id == user_id,
        DailyTask.task_date >= week_start,
        DailyTask.is_deleted == False,
        DailyTask.status == 'completed'
    ).count()

    return jsonify({
        'goals': {
            'total': total_goals,
            'active': active_goals,
            'completed': completed_goals
        },
        'checkins': total_checkins,
        'week_completed': week_completed
    })
