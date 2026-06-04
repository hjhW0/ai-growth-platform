from models.base import BaseModel
from extensions import db


class Feedback(BaseModel):
    """用户反馈模型"""
    __tablename__ = 'feedbacks'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, default=5)  # 1-5分

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content': self.content,
            'rating': self.rating,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None
        }
