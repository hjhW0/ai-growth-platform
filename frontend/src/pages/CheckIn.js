import React, { useState, useEffect } from 'react';
import { checkIn, getCheckinStatus, getStreak } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday } from '../utils/dateFormatter';

function CheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
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

  return (
    <div style={{ paddingBottom: '80px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>🔥 每日打卡</h2>

      {/* 打卡卡片 */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        borderRadius: '16px',
        padding: '40px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          {formatDateChinese(today)} {getWeekday(today)}
        </div>

        {/* 心情选择 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px' }}>今日心情</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
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
                  border: '2px solid white',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  fontSize: '24px'
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
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '4px solid white',
            backgroundColor: checkedIn ? 'rgba(255,255,255,0.3)' : 'white',
            color: checkedIn ? 'white' : '#f59e0b',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: checkedIn ? 'default' : 'pointer',
            margin: '20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {loading ? '打卡中...' : checkedIn ? '✓ 已打卡' : '打卡'}
        </button>

        {/* 连续打卡 */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{streak}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>连续打卡天数</div>
        </div>
      </div>

      {/* 本周打卡记录 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>📅 本周打卡记录</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {weekDates.map((date, index) => {
            const isToday = date === today;
            const isPast = date < today;
            const dayName = ['一', '二', '三', '四', '五', '六', '日'][index];

            return (
              <div key={date} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isToday ? '#6366f1' : '#f0f0f0',
                  color: isToday ? 'white' : '#666',
                  fontSize: '14px',
                  fontWeight: isToday ? 'bold' : 'normal'
                }}>
                  {dayName}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isToday ? '#6366f1' : '#999'
                }}>
                  {isToday ? '今天' : isPast ? '过去' : '未来'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 打卡提示 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>💡 打卡小贴士</h3>
        <div style={{ color: '#666', lineHeight: '1.6' }}>
          <p>• 每天坚持打卡，养成好习惯</p>
          <p>• 连续打卡可以获得更多成就</p>
          <p>• 打卡记录会保存在统计页面</p>
          <p>• 坚持就是胜利！💪</p>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
