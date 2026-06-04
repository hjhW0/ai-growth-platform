import pytest


class TestRegister:
    """注册接口测试"""

    def test_register_success(self, client):
        res = client.post('/api/auth/register', json={
            'username': 'newuser',
            'password': 'pass123456'
        })
        assert res.status_code == 201
        data = res.get_json()
        assert 'access_token' in data

    def test_register_duplicate(self, client):
        client.post('/api/auth/register', json={
            'username': 'dupuser',
            'password': 'pass123456'
        })
        res = client.post('/api/auth/register', json={
            'username': 'dupuser',
            'password': 'pass123456'
        })
        assert res.status_code in (400, 409)

    def test_register_missing_fields(self, client):
        res = client.post('/api/auth/register', json={'username': 'only_name'})
        assert res.status_code == 400


class TestLogin:
    """登录接口测试"""

    def test_login_success(self, client):
        client.post('/api/auth/register', json={
            'username': 'loginuser',
            'password': 'pass123456'
        })
        res = client.post('/api/auth/login', json={
            'username': 'loginuser',
            'password': 'pass123456'
        })
        assert res.status_code == 200
        data = res.get_json()
        assert 'access_token' in data

    def test_login_wrong_password(self, client):
        client.post('/api/auth/register', json={
            'username': 'wrongpass',
            'password': 'pass123456'
        })
        res = client.post('/api/auth/login', json={
            'username': 'wrongpass',
            'password': 'wrongpassword'
        })
        assert res.status_code == 401

    def test_login_nonexistent_user(self, client):
        res = client.post('/api/auth/login', json={
            'username': 'nouser',
            'password': 'pass123456'
        })
        assert res.status_code == 401
