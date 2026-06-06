from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.checkin import CheckIn
from datetime import datetime, timedelta, timezone

checkin_bp = Blueprint('checkin', __name__)

# 统一使用北京时间 (UTC+8)
CN_TZ = timezone(timedelta(hours=8))


def get_today_cn():
    """获取北京时间的今天日期"""
    return datetime.now(CN_TZ).date()


@checkin_bp.route('/', methods=['POST'])
@jwt_required()
def check_in():
    """每日打卡"""
    user_id = get_jwt_identity()
    data = request.json

    check_date = datetime.strptime(data.get('check_date', get_today_cn().strftime('%Y-%m-%d')), '%Y-%m-%d').date()
    check_type = data.get('check_type', 'daily')

    # 检查是否已打卡
    existing = CheckIn.query.filter_by(
        user_id=user_id,
        check_date=check_date,
        check_type=check_type,
        is_deleted=False
    ).first()

    if existing:
        return jsonify({'error': '今日已打卡', 'checkin': existing.to_dict()}), 409

    checkin = CheckIn(
        user_id=user_id,
        check_date=check_date,
        check_type=check_type,
        note=data.get('note'),
        mood=data.get('mood')
    )

    db.session.add(checkin)
    db.session.commit()

    return jsonify({'message': '打卡成功', 'checkin': checkin.to_dict()}), 201


@checkin_bp.route('/status', methods=['GET'])
@jwt_required()
def get_checkin_status():
    """获取打卡状态"""
    user_id = get_jwt_identity()
    check_date = request.args.get('date', get_today_cn().strftime('%Y-%m-%d'))
    date = datetime.strptime(check_date, '%Y-%m-%d').date()

    checkin = CheckIn.query.filter_by(
        user_id=user_id,
        check_date=date,
        is_deleted=False
    ).first()

    return jsonify({
        'checked_in': checkin is not None,
        'date': check_date,
        'checkin': checkin.to_dict() if checkin else None
    })


@checkin_bp.route('/streak', methods=['GET'])
@jwt_required()
def get_streak():
    """获取连续打卡天数"""
    user_id = get_jwt_identity()

    # 获取所有打卡日期，按日期升序
    checkins = CheckIn.query.filter_by(
        user_id=user_id,
        is_deleted=False
    ).order_by(CheckIn.check_date.asc()).all()

    if not checkins:
        return jsonify({'streak': 0})

    # 去重，只保留唯一日期
    check_dates = sorted(set(c.check_date for c in checkins), reverse=True)

    # 从今天开始往前数连续天数
    today = get_today_cn()
    streak = 0
    for date in check_dates:
        expected = today - timedelta(days=streak)
        if date == expected:
            streak += 1
        elif date < expected:
            break  # 中断了，停止

    return jsonify({'streak': streak})


@checkin_bp.route('/history', methods=['GET'])
@jwt_required()
def get_checkin_history():
    """获取打卡历史"""
    user_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)

    start_date = get_today_cn() - timedelta(days=days)

    checkins = CheckIn.query.filter(
        CheckIn.user_id == user_id,
        CheckIn.check_date >= start_date,
        CheckIn.is_deleted == False
    ).order_by(CheckIn.check_date.desc()).all()

    return jsonify({'history': [c.to_dict() for c in checkins]})
