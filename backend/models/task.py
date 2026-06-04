from datetime import datetime
from extensions import db
from .base import BaseModel


class DailyTask(BaseModel):
    """每日任务模型"""
    __tablename__ = 'daily_tasks'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    goal_id = db.Column(db.Integer, db.ForeignKey('goals.id'), nullable=True, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    task_date = db.Column(db.Date, nullable=False, index=True)
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, in_progress, completed, cancelled
    priority = db.Column(db.String(10), default='medium', nullable=False)  # high, medium, low
    order = db.Column(db.Integer, default=0, nullable=False)  # 排序字段
    duration = db.Column(db.Integer, nullable=True)  # 预计时长（分钟）
    completed_at = db.Column(db.DateTime, nullable=True)

    # 复合索引
    __table_args__ = (
        db.Index('idx_user_date', 'user_id', 'task_date'),
    )

    def complete(self):
        """完成任务"""
        self.status = 'completed'
        self.completed_at = datetime.utcnow()

    def to_dict(self):
        """转为字典"""
        base = super().to_dict()
        base.update({
            'user_id': self.user_id,
            'goal_id': self.goal_id,
            'title': self.title,
            'description': self.description,
            'task_date': self.task_date.isoformat() if self.task_date else None,
            'status': self.status,
            'priority': self.priority,
            'order': self.order,
            'duration': self.duration,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        })
        return base
