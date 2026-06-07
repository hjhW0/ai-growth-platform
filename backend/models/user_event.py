from extensions import db
from datetime import datetime


class UserEvent(db.Model):
    """用户行为事件表 - 用于漏斗分析和用户验证"""
    __tablename__ = 'user_events'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    event_type = db.Column(db.String(50), nullable=False, index=True)
    # 事件类型: login, create_goal, complete_goal, create_task, complete_task,
    #          checkin, ai_chat, ai_plan, ai_review, ai_report, ai_advice, submit_feedback
    event_data = db.Column(db.Text, nullable=True)  # JSON 附加数据
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_type': self.event_type,
            'event_data': self.event_data,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
