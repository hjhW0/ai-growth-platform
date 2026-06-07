import React, { useState, useEffect } from 'react';
import { checkIn, getCheckinStatus, getStreak, trackEvent } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday } from '../utils/dateFormatter';
import { t, card } from '../styles/tokens';

function CheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mood, setMood] = useState('normal');
  const [justChecked, setJustChecked] = useState(false);
  const today = getToday();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statusData, streakData] = await Promise.all([
        getCheckinStatus({ date: today }), getStreak()
      ]);
      setCheckedIn(statusData.checked_in);
      setStreak(streakData.streak || 0);
      setError(null);
    } catch (error) {
      console.error('加载数据失败:', error);
      setError('加载数据失败，请稍后重试');
    }
    setInitialLoading(false);
  };

  const handleCheckIn = async () => {
    if (checkedIn || loading) return;
    setLoading(true);
    try {
      await checkIn({ check_date: today, check_type: 'daily', mood, note: '' });
      trackEvent('checkin', JSON.stringify({ mood }));
      setCheckedIn(true);
      setJustChecked(true);
      loadData();
    } catch (error) { console.error('打卡失败:', error); }
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
  const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日'];

  if (initialLoading) {
    return (
      <div>
        <div style={{ ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}` }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundColor: t.surfaceAlt, margin: `0 auto ${t.sp5}` }} />
          <div style={{ height: 16, width: '40%', backgroundColor: t.surfaceAlt, borderRadius: t.rSm, margin: `0 auto ${t.sp3}` }} />
          <div style={{ height: 12, width: '25%', backgroundColor: t.surfaceAlt, borderRadius: t.rSm, margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}`, backgroundColor: t.errorLight, border: `1px solid rgba(239,68,68,0.15)` }}>
        <div style={{ fontSize: '32px', marginBottom: t.sp3 }}>😵</div>
        <div style={{ color: t.error, fontSize: t.md, fontWeight: '500', marginBottom: t.sp2 }}>{error}</div>
        <button onClick={() => { setInitialLoading(true); setError(null); loadData(); }} style={{
          padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, border: 'none',
          backgroundColor: t.primary, color: 'white', cursor: 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
        }}>重试</button>
      </div>
    );
  }

  return (
    <div>
      {/* Main check-in card */}
      <div className="animate-in" style={{
        ...card,
        textAlign: 'center',
        padding: `${t.sp8} ${t.sp5}`,
        background: checkedIn
          ? `linear-gradient(135deg, ${t.successLight} 0%, #ecfdf5 100%)`
          : `linear-gradient(135deg, ${t.primaryLight} 0%, #f0f0ff 100%)`,
        border: `1px solid ${checkedIn ? 'rgba(16,185,129,0.15)' : 'rgba(91,95,239,0.15)'}`,
        marginBottom: t.sp4,
      }}>
        <div style={{ fontSize: t.sm, color: t.textSecondary, marginBottom: t.sp2 }}>
          {formatDateChinese(today)} {getWeekday(today)}
        </div>

        {/* Mood selector */}
        {!checkedIn && (
          <div style={{ marginBottom: t.sp5 }}>
            <div style={{ fontSize: t.xs, color: t.textMuted, marginBottom: t.sp3 }}>今日心情</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: t.sp3 }}>
              {[
                { value: 'good', icon: '😊', label: '不错' },
                { value: 'normal', icon: '😐', label: '还行' },
                { value: 'bad', icon: '😔', label: '一般' },
              ].map(m => (
                <button key={m.value} onClick={() => setMood(m.value)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  background: mood === m.value ? t.primaryLight : 'transparent',
                  border: `2px solid ${mood === m.value ? 'rgba(91,95,239,0.3)' : t.border}`,
                  borderRadius: t.rMd, padding: `${t.sp2} ${t.sp3}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                  minWidth: '60px',
                }}>
                  <span style={{ fontSize: '24px' }}>{m.icon}</span>
                  <span style={{ fontSize: t.xs, color: mood === m.value ? t.primary : t.textMuted, fontWeight: '500' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Check-in button */}
        <button
          onClick={handleCheckIn}
          disabled={checkedIn || loading}
          style={{
            width: '120px', height: '120px',
            borderRadius: '50%', border: 'none',
            backgroundColor: checkedIn ? t.success : t.primary,
            color: 'white', fontSize: checkedIn ? '32px' : t.lg,
            fontWeight: '700', cursor: checkedIn ? 'default' : 'pointer',
            margin: `${t.sp4} auto`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '4px',
            boxShadow: checkedIn
              ? `0 8px 30px rgba(16,185,129,0.3)`
              : `0 8px 30px rgba(91,95,239,0.3)`,
            transition: 'all 0.3s ease',
            transform: justChecked ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {loading ? (
            <span style={{ fontSize: t.base }}>...</span>
          ) : checkedIn ? (
            <>✓</>
          ) : (
            <>
              <span style={{ fontSize: '28px' }}>🔥</span>
              <span style={{ fontSize: t.sm }}>打卡</span>
            </>
          )}
        </button>

        <div style={{ marginTop: t.sp3 }}>
          <div style={{ fontSize: t['3xl'], fontWeight: '700', color: t.text }}>{streak}</div>
          <div style={{ fontSize: t.sm, color: t.textMuted }}>连续打卡天数</div>
        </div>

        {checkedIn && (
          <div style={{
            marginTop: t.sp4, padding: `${t.sp3} ${t.sp4}`,
            backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: t.rMd,
            fontSize: t.sm, color: t.success, fontWeight: '500',
          }}>
            {streak >= 7 ? '🎉 太厉害了！已连续一周！' : streak >= 3 ? '💪 坚持就是胜利！' : '✨ 今天也辛苦了！'}
          </div>
        )}
      </div>

      {/* Week view */}
      <div className="animate-in animate-in-delay-1" style={card}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>
          本周打卡
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {weekDates.map((date, index) => {
            const isToday = date === today;
            const isPast = date < today;
            return (
              <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isToday ? t.primary : isPast ? t.successLight : t.surfaceAlt,
                  color: isToday ? 'white' : isPast ? t.success : t.textMuted,
                  fontSize: t.sm, fontWeight: isToday ? '700' : '500',
                  border: isToday ? `2px solid ${t.primary}` : `1px solid ${isPast ? 'rgba(16,185,129,0.2)' : t.border}`,
                }}>
                  {weekdayLabels[index]}
                </div>
                <div style={{ fontSize: '9px', color: isToday ? t.primary : t.textMuted, fontWeight: '500' }}>
                  {isToday ? '今天' : isPast ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="animate-in animate-in-delay-2" style={{ ...card, marginTop: t.sp3 }}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3 }}>打卡小贴士</div>
        <div style={{ color: t.textSecondary, fontSize: t.sm, lineHeight: 1.8 }}>
          <div>• 每天坚持打卡，养成好习惯</div>
          <div>• 连续打卡可以获得更多成就</div>
          <div>• 打卡记录会保存在统计页面</div>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
