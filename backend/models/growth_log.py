from datetime import datetime
from extensions import db
from .base import BaseModel


class GrowthLog(BaseModel):
    """成长日志模型"""
    __tablename__ = 'growth_logs'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    log_date = db.Column(db.Date, nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    mood = db.Column(db.String(20), nullable=True)  # good, normal, bad
    ai_summary = db.Column(db.Text, nullable=True)  # AI 生成的总结
    tags = db.Column(db.String(500), nullable=True)  # 标签，逗号分隔

    def to_dict(self):
        """转为字典"""
        base = super().to_dict()
        base.update({
            'user_id': self.user_id,
            'log_date': self.log_date.isoformat() if self.log_date else None,
            'content': self.content,
            'mood': self.mood,
            'ai_summary': self.ai_summary,
            'tags': self.tags.split(',') if self.tags else []
        })
        return base
