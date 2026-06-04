from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from .base import BaseModel


class User(BaseModel):
    """用户模型"""
    __tablename__ = 'users'

    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    avatar = db.Column(db.String(256), nullable=True)

    # 关系
    goals = db.relationship('Goal', backref='user', lazy='dynamic')
    daily_tasks = db.relationship('DailyTask', backref='user', lazy='dynamic')
    check_ins = db.relationship('CheckIn', backref='user', lazy='dynamic')
    ai_chats = db.relationship('AIChat', backref='user', lazy='dynamic')
    growth_logs = db.relationship('GrowthLog', backref='user', lazy='dynamic')

    def set_password(self, password):
        """设置密码"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """验证密码"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """转为字典"""
        base = super().to_dict()
        base.update({
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar
        })
        return base
