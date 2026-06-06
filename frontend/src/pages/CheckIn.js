import React, { useState, useEffect } from 'react';
import { checkIn, getCheckinStatus, getStreak } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday } from '../utils/dateFormatter';

const CARD = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

function CheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mood, setMood] = useState('normal');
  const [note, setNote] = useState('');
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
      await checkIn({
        check_date: today,
        check_type: 'daily',
        mood,
        note
      });
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
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
          borderRadius: '16px',
          padding: '40px 24px',
          marginBottom: '12px'
        }}>
          <div style={{ height: 16, width: '50%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, margin: '0 auto 20px' }} />
          <div style={{ height: 120, width: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 auto 20px' }} />
          <div style={{ height: 36, width: '30%', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, margin: '0 auto' }} />
        </div>
        <div style={CARD}>
          <div style={{ height: 16, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f0f0f0' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>🔥 每日打卡</h2>

      {/* 打卡卡片 */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        borderRadius: '16px',
        padding: '32px 24px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '12px'
      }}>
        <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
          {formatDateChinese(today)} {getWeekday(today)}
        </div>

        {/* 心情选择 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px', fontSize: '13px', opacity: 0.8 }}>今日心情</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {[
              { value: 'good', icon: '😊', label: '好' },
              { value: 'normal', icon: '😐', label: '一般' },
              { value: 'bad', icon: '😔', label: '差' }
            ].map(m => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                style={{
                  background: mood === m.value ? 'rgba(255,255,255,0.3)' : 'transparent',
                  border: '2px solid rgba(255,255,255,0.6)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  fontSize: '22px',
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
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.8)',
            backgroundColor: checkedIn ? 'rgba(255,255,255,0.3)' : 'white',
            color: checkedIn ? 'white' : '#f59e0b',
            fontSize: '18px',
            fontWeight: '700',
            cursor: checkedIn ? 'default' : 'pointer',
            margin: '16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: checkedIn ? 'none' : '0 4px 15px rgba(0,0,0,0.15)'
          }}
        >
          {loading ? '打卡中...' : checkedIn ? '✓ 已打卡' : '打卡'}
        </button>

        {/* 连续打卡 */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{streak}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>连续打卡天数</div>
        </div>
      </div>

      {/* 本周打卡记录 */}
      <div style={CARD}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>📅 本周打卡记录</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {weekDates.map((date, index) => {
            const isToday = date === today;
            const dayName = ['一', '二', '三', '四', '五', '六', '日'][index];

            return (
              <div key={date} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isToday ? '#6366f1' : '#f5f5f5',
                  color: isToday ? 'white' : '#999',
                  fontSize: '13px',
                  fontWeight: isToday ? '600' : '400',
                  transition: 'all 0.2s'
                }}>
                  {dayName}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: isToday ? '#6366f1' : '#bbb'
                }}>
                  {isToday ? '今天' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 打卡提示 */}
      <div style={CARD}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>💡 打卡小贴士</div>
        <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.8' }}>
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
