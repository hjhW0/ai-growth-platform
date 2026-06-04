from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.feedback import Feedback

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('', methods=['POST'])
@jwt_required()
def submit_feedback():
    """提交反馈"""
    user_id = get_jwt_identity()
    data = request.json

    content = data.get('content', '').strip()
    if not content:
        return jsonify({'code': 1, 'message': '反馈内容不能为空'}), 400

    rating = data.get('rating', 5)
    if not (1 <= rating <= 5):
        rating = 5

    feedback = Feedback(
        user_id=user_id,
        content=content,
        rating=rating
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({'code': 0, 'message': '感谢你的反馈！', 'data': feedback.to_dict()})


@feedback_bp.route('', methods=['GET'])
@jwt_required()
def get_feedbacks():
    """获取用户自己的反馈列表"""
    user_id = get_jwt_identity()
    limit = request.args.get('limit', 20, type=int)

    feedbacks = Feedback.query.filter_by(
        user_id=user_id, is_deleted=False
    ).order_by(Feedback.created_at.desc()).limit(limit).all()

    return jsonify({
        'code': 0,
        'data': [f.to_dict() for f in feedbacks]
    })
