from datetime import datetime
from extensions import db
from .base import BaseModel


class AIChat(BaseModel):
    """AI 对话记录模型"""
    __tablename__ = 'ai_chats'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    conversation_id = db.Column(db.String(36), nullable=True, index=True)  # 会话ID，用于分组
    role = db.Column(db.String(20), nullable=False)  # user, assistant, system
    content = db.Column(db.Text, nullable=False)
    chat_type = db.Column(db.String(20), default='general', nullable=False)  # general, plan, review, advice
    model = db.Column(db.String(50), nullable=True)  # 使用的模型名称
    tokens_used = db.Column(db.Integer, nullable=True)  # 使用的 token 数量

    def to_dict(self):
        """转为字典"""
        base = super().to_dict()
        base.update({
            'user_id': self.user_id,
            'conversation_id': self.conversation_id,
            'role': self.role,
            'content': self.content,
            'chat_type': self.chat_type,
            'model': self.model,
            'tokens_used': self.tokens_used
        })
        return base
