import React, { useState, useEffect } from 'react';
import { checkIn, getCheckinStatus, getStreak } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday } from '../utils/dateFormatter';

const CARD = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
  border: '1px solid #27272a'
};

function CheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mood, setMood] = useState('normal');
  const today = getToday();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statusData, streakData] = await Promise.all([
        getCheckinStatus({ date: today }),
        getStreak()
      ]);
      setCheckedIn(statusData.checked_in);
      setStreak(streakData.streak || 0);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
    setInitialLoading(false);
  };

  const handleCheckIn = async () => {
    if (checkedIn || loading) return;
    setLoading(true);
    try {
      await checkIn({ check_date: today, check_type: 'daily', mood, note: '' });
      setCheckedIn(true);
      loadData();
    } catch (error) {
      console.error('打卡失败:', error);
    }
    setLoading(false);
  };

  const getWeekDates = () => {
    const dates = [];
    const todayObj = new Date();
    const monday = new Date(todayObj);
    monday.setDate(todayObj.getDate() - todayObj.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  if (initialLoading) {
    return (
      <div>
        <div style={{ ...CARD, background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.1) 100%)', borderColor: 'rgba(245,158,11,0.2)' }}>
          <div style={{ height: 16, width: '50%', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 8, margin: '0 auto 20px' }} />
          <div style={{ height: 100, width: 100, borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.1)', margin: '0 auto 20px' }} />
          <div style={{ height: 32, width: '30%', backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: 8, margin: '0 auto' }} />
        </div>
        <div style={CARD}>
          <div style={{ height: 14, width: '40%', backgroundColor: '#1a1a1a', borderRadius: 4, marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[1,2,3,4,5,6,7].map(i => <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1a1a1a' }} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fafafa', marginBottom: '16px' }}>🔥 每日打卡</h2>

      {/* 打卡卡片 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.1) 100%)',
        borderRadius: '12px',
        padding: '32px 24px',
        color: '#fafafa',
        textAlign: 'center',
        marginBottom: '12px',
        border: '1px solid rgba(245,158,11,0.2)'
      }}>
        <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '4px' }}>
          {formatDateChinese(today)} {getWeekday(today)}
        </div>

        {/* 心情选择 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px', fontSize: '12px', color: '#71717a' }}>今日心情</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {[
              { value: 'good', icon: '😊' },
              { value: 'normal', icon: '😐' },
              { value: 'bad', icon: '😔' }
            ].map(m => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                style={{
                  background: mood === m.value ? 'rgba(245,158,11,0.2)' : 'transparent',
                  border: `2px solid ${mood === m.value ? 'rgba(245,158,11,0.5)' : '#27272a'}`,
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {m.icon}
              </button>
            ))}
          </div>
        </div>

        {/* 打卡按钮 */}
        <button
          onClick={handleCheckIn}
          disabled={checkedIn || loading}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: `3px solid ${checkedIn ? 'rgba(34,197,94,0.5)' : 'rgba(245,158,11,0.5)'}`,
            backgroundColor: checkedIn ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.1)',
            color: checkedIn ? '#22c55e' : '#f59e0b',
            fontSize: '16px',
            fontWeight: '700',
            cursor: checkedIn ? 'default' : 'pointer',
            margin: '16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? '打卡中...' : checkedIn ? '✓ 已打卡' : '打卡'}
        </button>

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#fafafa' }}>{streak}</div>
          <div style={{ fontSize: '12px', color: '#71717a' }}>连续打卡天数</div>
        </div>
      </div>

      {/* 本周打卡记录 */}
      <div style={CARD}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fafafa', marginBottom: '16px' }}>📅 本周打卡记录</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {weekDates.map((date, index) => {
            const isToday = date === today;
            return (
              <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isToday ? 'rgba(99,102,241,0.2)' : '#1a1a1a',
                  color: isToday ? '#6366f1' : '#71717a',
                  fontSize: '12px',
                  fontWeight: isToday ? '600' : '400',
                  border: isToday ? '1px solid rgba(99,102,241,0.3)' : '1px solid #27272a'
                }}>
                  {['一','二','三','四','五','六','日'][index]}
                </div>
                <div style={{ fontSize: '10px', color: isToday ? '#6366f1' : '#3f3f46' }}>
                  {isToday ? '今天' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 打卡提示 */}
      <div style={CARD}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fafafa', marginBottom: '12px' }}>💡 打卡小贴士</div>
        <div style={{ color: '#71717a', fontSize: '13px', lineHeight: '1.8' }}>
          <p style={{ margin: '0 0 4px 0' }}>• 每天坚持打卡，养成好习惯</p>
          <p style={{ margin: '0 0 4px 0' }}>• 连续打卡可以获得更多成就</p>
          <p style={{ margin: '0 0 4px 0' }}>• 打卡记录会保存在统计页面</p>
          <p style={{ margin: 0 }}>• 坚持就是胜利！💪</p>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
