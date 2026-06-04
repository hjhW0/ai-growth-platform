from datetime import datetime
from extensions import db
from .base import BaseModel


class CheckIn(BaseModel):
    """打卡记录模型"""
    __tablename__ = 'check_ins'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    check_date = db.Column(db.Date, nullable=False, index=True)
    check_type = db.Column(db.String(20), default='daily', nullable=False)  # daily, morning, evening
    note = db.Column(db.Text, nullable=True)
    mood = db.Column(db.String(20), nullable=True)  # good, normal, bad

    # 复合索引，确保每天每种类型只能打卡一次
    __table_args__ = (
        db.UniqueConstraint('user_id', 'check_date', 'check_type', name='uq_user_checkin'),
    )

    def to_dict(self):
        """转为字典"""
        base = super().to_dict()
        base.update({
            'user_id': self.user_id,
            'check_date': self.check_date.isoformat() if self.check_date else None,
            'check_type': self.check_type,
            'note': self.note,
            'mood': self.mood
        })
        return base
