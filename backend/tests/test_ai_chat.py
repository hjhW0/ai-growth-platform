import pytest
from unittest.mock import patch


class TestAIChat:
    """AI 对话接口测试"""

    @patch('utils.ai_client.chat', return_value='2')
    def test_chat_basic(self, mock_chat, client, auth_headers):
        res = client.post('/api/ai/chat', json={
            'message': '1+1等于几'
        }, headers=auth_headers)
        assert res.status_code == 200
        data = res.get_json()
        assert data['response'] == '2'
        assert 'conversation_id' in data

    @patch('utils.ai_client.chat', return_value='2')
    def test_chat_conversation_id_consistent(self, mock_chat, client, auth_headers):
        """同一个对话的 conversation_id 应该一致"""
        res1 = client.post('/api/ai/chat', json={
            'message': '1+1等于几'
        }, headers=auth_headers)
        cid1 = res1.get_json()['conversation_id']

        res2 = client.post('/api/ai/chat', json={
            'message': '那2+2呢',
            'conversation_id': cid1
        }, headers=auth_headers)
        cid2 = res2.get_json()['conversation_id']

        assert cid1 == cid2

    def test_chat_empty_message(self, client, auth_headers):
        res = client.post('/api/ai/chat', json={
            'message': ''
        }, headers=auth_headers)
        assert res.status_code == 400

    @patch('utils.ai_client.chat', return_value='我是AI成长助手，有什么可以帮助你？')
    def test_chat_bad_pattern_filter(self, mock_chat, client, auth_headers):
        """废话回复应被过滤"""
        res = client.post('/api/ai/chat', json={
            'message': '你好'
        }, headers=auth_headers)
        data = res.get_json()
        assert data['response'] == '收到，你可以继续说。'

    def test_chat_unauthorized(self, client):
        res = client.post('/api/ai/chat', json={
            'message': 'test'
        })
        assert res.status_code == 401


class TestChatHistory:
    """对话历史接口测试"""

    @patch('utils.ai_client.chat', return_value='test response')
    def test_history_returns_messages(self, mock_chat, client, auth_headers):
        # 先发一条消息
        client.post('/api/ai/chat', json={
            'message': 'hello'
        }, headers=auth_headers)

        # 获取历史
        res = client.get('/api/ai/history', headers=auth_headers)
        assert res.status_code == 200
        data = res.get_json()
        assert 'history' in data
        assert len(data['history']) >= 2  # user + assistant
