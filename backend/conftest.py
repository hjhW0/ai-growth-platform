import pytest
import sys
import os

# 确保 backend 目录在 path 中
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from extensions import db as _db


@pytest.fixture
def app():
    """创建测试用的 Flask app"""
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'JWT_SECRET_KEY': 'test-secret',
        'SECRET_KEY': 'test-secret',
    })

    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture
def client(app):
    """Flask 测试客户端"""
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    """注册并登录，返回带 JWT 的 headers"""
    # 注册
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'test123456'
    })
    # 登录
    res = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'test123456'
    })
    token = res.get_json()['access_token']
    return {'Authorization': f'Bearer {token}'}
