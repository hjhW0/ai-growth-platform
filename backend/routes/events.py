from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_event import UserEvent
from extensions import db
from datetime import datetime, timedelta
from sqlalchemy import func

events_bp = Blueprint('events', __name__)


@events_bp.route('', methods=['POST'])
@jwt_required()
def log_event():
    """记录用户行为事件"""
    user_id = get_jwt_identity()
    data = request.get_json()

    event_type = data.get('event_type')
    if not event_type:
        return jsonify({'error': 'event_type 必填'}), 400

    event = UserEvent(
        user_id=user_id,
        event_type=event_type,
        event_data=data.get('event_data'),
    )
    db.session.add(event)
    db.session.commit()

    return jsonify({'code': 0, 'event_id': event.id})


@events_bp.route('/batch', methods=['POST'])
@jwt_required()
def log_events_batch():
    """批量记录事件（前端离线缓冲后批量上报）"""
    user_id = get_jwt_identity()
    events = request.get_json().get('events', [])

    created = 0
    for ev in events:
        if not ev.get('event_type'):
            continue
        event = UserEvent(
            user_id=user_id,
            event_type=ev['event_type'],
            event_data=ev.get('event_data'),
        )
        db.session.add(event)
        created += 1

    db.session.commit()
    return jsonify({'code': 0, 'created': created})


@events_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """获取行为统计（管理员用）"""
    days = request.args.get('days', 7, type=int)
    since = datetime.utcnow() - timedelta(days=days)

    # 漏斗统计：每个事件类型的独立用户数
    funnel = db.session.query(
        UserEvent.event_type,
        func.count(UserEvent.id).label('total'),
        func.count(func.distinct(UserEvent.user_id)).label('unique_users'),
    ).filter(
        UserEvent.created_at >= since
    ).group_by(UserEvent.event_type).all()

    # 每日活跃用户
    daily_active = db.session.query(
        func.date(UserEvent.created_at).label('date'),
        func.count(func.distinct(UserEvent.user_id)).label('users'),
    ).filter(
        UserEvent.created_at >= since
    ).group_by(func.date(UserEvent.created_at)).all()

    # 总用户数
    from models.user import User
    total_users = User.query.count()

    # 留存：注册后第N天还活跃的用户
    retention = []
    for day in [1, 3, 7]:
        day_start = datetime.utcnow() - timedelta(days=day)
        day_end = datetime.utcnow() - timedelta(days=day - 1) if day > 1 else datetime.utcnow()
        active = db.session.query(
            func.count(func.distinct(UserEvent.user_id))
        ).filter(
            UserEvent.created_at >= day_start,
            UserEvent.created_at < day_end,
        ).scalar()
        retention.append({'day': day, 'active_users': active})

    return jsonify({
        'total_users': total_users,
        'funnel': [
            {'event_type': r[0], 'total': r[1], 'unique_users': r[2]}
            for r in funnel
        ],
        'daily_active': [
            {'date': str(r[0]), 'users': r[1]}
            for r in daily_active
        ],
        'retention': retention,
    })


@events_bp.route('/user-summary', methods=['GET'])
@jwt_required()
def get_user_summary():
    """获取当前用户的行为摘要"""
    user_id = get_jwt_identity()
    days = request.args.get('days', 7, type=int)
    since = datetime.utcnow() - timedelta(days=days)

    events = db.session.query(
        UserEvent.event_type,
        func.count(UserEvent.id).label('count'),
    ).filter(
        UserEvent.user_id == user_id,
        UserEvent.created_at >= since,
    ).group_by(UserEvent.event_type).all()

    return jsonify({
        'days': days,
        'events': {r[0]: r[1] for r in events},
    })
