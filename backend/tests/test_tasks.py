import pytest
from datetime import datetime, timedelta


class TestCreateTask:
    """创建任务测试"""

    def test_create_task_success(self, client, auth_headers):
        res = client.post('/api/tasks/', json={
            'title': '学习 Python',
            'task_date': '2026-06-06',
            'priority': 'high'
        }, headers=auth_headers)
        assert res.status_code == 201
        data = res.get_json()
        assert data['task']['title'] == '学习 Python'
        assert data['task']['priority'] == 'high'
        assert data['task']['status'] == 'pending'

    def test_create_task_empty_title(self, client, auth_headers):
        res = client.post('/api/tasks/', json={
            'title': ''
        }, headers=auth_headers)
        assert res.status_code == 400

    def test_create_task_no_auth(self, client):
        res = client.post('/api/tasks/', json={'title': 'test'})
        assert res.status_code == 401


class TestGetTasks:
    """获取任务列表测试"""

    def test_get_tasks_empty(self, client, auth_headers):
        res = client.get('/api/tasks/', headers=auth_headers)
        assert res.status_code == 200
        assert res.get_json()['tasks'] == []

    def test_get_tasks_by_date(self, client, auth_headers):
        client.post('/api/tasks/', json={
            'title': '今日任务',
            'task_date': '2026-06-06'
        }, headers=auth_headers)
        client.post('/api/tasks/', json={
            'title': '明日任务',
            'task_date': '2026-06-07'
        }, headers=auth_headers)

        res = client.get('/api/tasks/?date=2026-06-06', headers=auth_headers)
        tasks = res.get_json()['tasks']
        assert len(tasks) == 1
        assert tasks[0]['title'] == '今日任务'


class TestCompleteTask:
    """完成任务测试"""

    def test_complete_task(self, client, auth_headers):
        # 创建任务
        res = client.post('/api/tasks/', json={
            'title': '待完成任务'
        }, headers=auth_headers)
        task_id = res.get_json()['task']['id']

        # 完成任务
        res = client.post(f'/api/tasks/{task_id}/complete', headers=auth_headers)
        assert res.status_code == 200
        data = res.get_json()
        assert data['task']['status'] == 'completed'
        assert data['task']['completed_at'] is not None

    def test_complete_nonexistent_task(self, client, auth_headers):
        res = client.post('/api/tasks/999/complete', headers=auth_headers)
        assert res.status_code == 404


class TestDeleteTask:
    """删除任务测试"""

    def test_delete_task(self, client, auth_headers):
        res = client.post('/api/tasks/', json={'title': '要删除的任务'}, headers=auth_headers)
        task_id = res.get_json()['task']['id']

        res = client.delete(f'/api/tasks/{task_id}', headers=auth_headers)
        assert res.status_code == 200

        # 确认已删除（软删除，查不到）
        res = client.get(f'/api/tasks/{task_id}', headers=auth_headers)
        assert res.status_code == 404

    def test_delete_nonexistent_task(self, client, auth_headers):
        res = client.delete('/api/tasks/999', headers=auth_headers)
        assert res.status_code == 404
