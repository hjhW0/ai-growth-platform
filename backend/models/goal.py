from datetime import datetime
from extensions import db
from .base import BaseModel


class Goal(BaseModel):
    """目标模型"""
    __tablename__ = 'goals'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('goals.id'), nullable=True, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    path = db.Column(db.String(500), nullable=True, index=True)  # 路径，如 "1/2/3"
    status = db.Column(db.String(20), default='active', nullable=False)  # active, completed, paused, archived
    priority = db.Column(db.String(10), default='medium', nullable=False)  # high, medium, low
    deadline = db.Column(db.Date, nullable=True)
    goal_type = db.Column(db.String(20), default='learning', nullable=False)  # learning, career, health, hobby, other
    completed_at = db.Column(db.DateTime, nullable=True)

    # 自引用关系
    children = db.relationship('Goal', backref=db.backref('parent', remote_side='Goal.id'), lazy='dynamic')

    # 关系
    daily_tasks = db.relationship('DailyTask', backref='goal', lazy='dynamic')

    def update_path(self):
        """更新路径字段"""
        if self.parent_id:
            parent = Goal.query.get(self.parent_id)
            if parent:
                self.path = f"{parent.path}/{self.id}" if parent.path else str(self.id)
            else:
                self.path = str(self.id)
        else:
            self.path = str(self.id)

    def complete(self):
        """完成目标"""
        self.status = 'completed'
        self.completed_at = datetime.utcnow()

    def to_dict(self):
        """转为字典"""
        base = super().to_dict()
        base.update({
            'user_id': self.user_id,
            'parent_id': self.parent_id,
            'title': self.title,
            'description': self.description,
            'path': self.path,
            'status': self.status,
            'priority': self.priority,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'goal_type': self.goal_type,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'children_count': self.children.filter_by(is_deleted=False).count()
        })
        return base
