from datetime import datetime
from extensions import db


class BaseModel(db.Model):
    """基础模型类，包含通用字段"""
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)

    def soft_delete(self):
        """软删除"""
        self.is_deleted = True
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """转为字典"""
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_deleted': self.is_deleted
        }
