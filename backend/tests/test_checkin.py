import pytest
from datetime import datetime, timedelta, timezone

# 北京时间
CN_TZ = timezone(timedelta(hours=8))


def get_today_cn():
    return datetime.now(CN_TZ).date()


def checkin_on_date(client, auth_headers, date_str):
    """辅助函数：在指定日期打卡"""
    return client.post('/api/checkin/', json={
        'check_date': date_str,
        'check_type': 'daily',
        'mood': 'good'
    }, headers=auth_headers)


class TestCheckIn:
    """打卡测试"""

    def test_checkin_success(self, client, auth_headers):
        today = get_today_cn().strftime('%Y-%m-%d')
        res = checkin_on_date(client, auth_headers, today)
        assert res.status_code == 201
        assert '打卡成功' in res.get_json()['message']

    def test_checkin_duplicate(self, client, auth_headers):
        today = get_today_cn().strftime('%Y-%m-%d')
        checkin_on_date(client, auth_headers, today)
        res = checkin_on_date(client, auth_headers, today)
        assert res.status_code == 409
        assert '已打卡' in res.get_json()['error']

    def test_checkin_no_auth(self, client):
        res = client.post('/api/checkin/', json={'check_date': '2026-06-06'})
        assert res.status_code == 401


class TestCheckinStatus:
    """打卡状态测试"""

    def test_status_not_checked(self, client, auth_headers):
        today = get_today_cn().strftime('%Y-%m-%d')
        res = client.get(f'/api/checkin/status?date={today}', headers=auth_headers)
        assert res.status_code == 200
        assert res.get_json()['checked_in'] is False

    def test_status_checked(self, client, auth_headers):
        today = get_today_cn().strftime('%Y-%m-%d')
        checkin_on_date(client, auth_headers, today)
        res = client.get(f'/api/checkin/status?date={today}', headers=auth_headers)
        assert res.get_json()['checked_in'] is True


class TestStreak:
    """连续打卡天数测试"""

    def test_streak_no_checkins(self, client, auth_headers):
        res = client.get('/api/checkin/streak', headers=auth_headers)
        assert res.status_code == 200
        assert res.get_json()['streak'] == 0

    def test_streak_today_only(self, client, auth_headers):
        """今天打卡 → 连续1天"""
        today = get_today_cn()
        checkin_on_date(client, auth_headers, today.strftime('%Y-%m-%d'))

        res = client.get('/api/checkin/streak', headers=auth_headers)
        assert res.get_json()['streak'] == 1

    def test_streak_consecutive_days(self, client, auth_headers):
        """连续3天打卡 → 连续3天"""
        today = get_today_cn()
        for i in range(3):
            date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
            checkin_on_date(client, auth_headers, date)

        res = client.get('/api/checkin/streak', headers=auth_headers)
        assert res.get_json()['streak'] == 3

    def test_streak_broken(self, client, auth_headers):
        """今天打卡 + 前天打卡（昨天断了）→ 连续1天"""
        today = get_today_cn()
        checkin_on_date(client, auth_headers, today.strftime('%Y-%m-%d'))
        checkin_on_date(client, auth_headers, (today - timedelta(days=2)).strftime('%Y-%m-%d'))

        res = client.get('/api/checkin/streak', headers=auth_headers)
        assert res.get_json()['streak'] == 1

    def test_streak_no_today_but_yesterday(self, client, auth_headers):
        """昨天打卡但今天没打 → 连续0天（streak 从今天算起）"""
        today = get_today_cn()
        checkin_on_date(client, auth_headers, (today - timedelta(days=1)).strftime('%Y-%m-%d'))

        res = client.get('/api/checkin/streak', headers=auth_headers)
        assert res.get_json()['streak'] == 0


class TestCheckinHistory:
    """打卡历史测试"""

    def test_history_empty(self, client, auth_headers):
        res = client.get('/api/checkin/history', headers=auth_headers)
        assert res.status_code == 200
        assert res.get_json()['history'] == []

    def test_history_returns_checkins(self, client, auth_headers):
        today = get_today_cn()
        checkin_on_date(client, auth_headers, today.strftime('%Y-%m-%d'))

        res = client.get('/api/checkin/history', headers=auth_headers)
        history = res.get_json()['history']
        assert len(history) == 1
        assert history[0]['mood'] == 'good'
