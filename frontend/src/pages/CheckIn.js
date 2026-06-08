import React, { useState, useEffect } from 'react';
import { BarChart3, Check, Flame, CheckCircle2, CloudSun, Meh, Sprout, SunMedium, ThermometerSun } from 'lucide-react';
import { checkIn, getCheckinStatus, getStreak, trackEvent } from '../api/apiClient';
import { getToday, formatDateChinese, getWeekday } from '../utils/dateFormatter';
import { t, card } from '../styles/tokens';
import ErrorState from '../components/ErrorState';

function Confetti({ show }) {
  if (!show) return null;
  const colors = [t.primary, t.accentPurple, t.warning, '#f472b6', t.accentSky, t.success];
  return (
    <div className="confetti-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1.5 + Math.random() * 1.5}s`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function CheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mood, setMood] = useState('normal');
  const [justChecked, setJustChecked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
      setError('温室信号不太好，数据没加载到');
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
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
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
  const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日'];

  const getEncouragement = () => {
    if (streak >= 30) return '一个月了！你已经养成了一个习惯';
    if (streak >= 14) return '两周不间断，温室里的小苗长势喜人';
    if (streak >= 7) return '整整一周！你的坚持正在开花';
    if (streak >= 3) return '连续三天，种子已经开始发芽了';
    return '今天也辛苦了，给自己一个拥抱';
  };

  const moodOptions = [
    { value: 'good', Icon: SunMedium, label: '不错' },
    { value: 'normal', Icon: Meh, label: '还行' },
    { value: 'bad', Icon: CloudSun, label: '一般' },
  ];

  if (initialLoading) {
    return (
      <div>
        <div style={{
          ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}`,
          background: 'linear-gradient(90deg, #e6f4eb 25%, #f5fbf7 50%, #e6f4eb 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          height: 280, marginBottom: t.sp4,
        }} />
        <div style={{
          ...card,
          background: 'linear-gradient(90deg, #e6f4eb 25%, #f5fbf7 50%, #e6f4eb 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          height: 100,
        }} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { setInitialLoading(true); setError(null); loadData(); }} />;
  }

  return (
    <div>
      <Confetti show={showConfetti} />

      {/* Main check-in card */}
      <div className="animate-in" style={{
        ...card,
        textAlign: 'center',
        padding: `${t.sp8} ${t.sp5}`,
        background: checkedIn
          ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 58%, #eef2ff 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: `1px solid ${checkedIn ? t.borderGlow : t.border}`,
        marginBottom: t.sp4,
        boxShadow: checkedIn ? '0 16px 34px rgba(34, 197, 94, 0.14)' : card.boxShadow,
        transition: 'all 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装饰光晕 */}
        {checkedIn && (
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'breathe 4s ease-in-out infinite',
          }} />
        )}

        <div style={{ fontSize: t.sm, color: t.textSecondary, marginBottom: t.sp2 }}>
          {formatDateChinese(today)} {getWeekday(today)}
        </div>

        {/* Mood selector */}
        {!checkedIn && (
          <div style={{ marginBottom: t.sp5 }}>
            <div style={{ fontSize: t.xs, color: t.textMuted, marginBottom: t.sp3 }}>今天心情怎么样？</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: t.sp3 }}>
              {moodOptions.map(m => {
                const Icon = m.Icon;
                return (
                <button key={m.value} onClick={() => setMood(m.value)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  background: mood === m.value ? t.primaryLight : '#ffffff',
                  border: `2px solid ${mood === m.value ? t.borderGlow : t.border}`,
                  borderRadius: t.rMd, padding: `${t.sp2} ${t.sp3}`,
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  minWidth: '60px', fontFamily: 'inherit',
                  boxShadow: mood === m.value ? '0 10px 18px rgba(34,197,94,0.12)' : 'none',
                  transform: mood === m.value ? 'scale(1.05)' : 'scale(1)',
                }}>
                  <Icon size={22} style={{ color: mood === m.value ? t.primary : t.textMuted }} />
                  <span style={{ fontSize: t.xs, color: mood === m.value ? t.primary : t.textMuted, fontWeight: '500' }}>{m.label}</span>
                </button>
              );})}
            </div>
          </div>
        )}

        {/* Check-in button */}
        <button
          onClick={handleCheckIn}
          disabled={checkedIn || loading}
          style={{
            width: '130px', height: '130px',
            borderRadius: '50%', border: 'none',
            background: checkedIn
              ? `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`
              : 'linear-gradient(135deg, #ffffff, #dcfce7)',
            color: checkedIn ? '#ffffff' : t.primaryDark, fontSize: checkedIn ? '36px' : t.lg,
            fontWeight: '700', cursor: checkedIn ? 'default' : 'pointer',
            margin: `${t.sp4} auto`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '6px',
            boxShadow: checkedIn
              ? '0 16px 34px rgba(34, 197, 94, 0.24)'
              : '0 12px 28px rgba(31, 85, 52, 0.12)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: justChecked ? 'scale(1.1)' : 'scale(1)',
            border: `2px solid ${checkedIn ? t.primary : t.borderGlow}`,
            animation: checkedIn ? 'none' : 'breathe 4s ease-in-out infinite',
            fontFamily: 'inherit',
          }}
        >
          {loading ? (
            <span style={{ fontSize: t.base, animation: 'pulse 1s infinite' }}>...</span>
          ) : checkedIn ? (
            <CheckCircle2 size={40} />
          ) : (
            <>
              <Flame size={36} />
              <span style={{ fontSize: t.sm }}>打卡</span>
            </>
          )}
        </button>

        <div style={{ marginTop: t.sp3 }}>
          <div style={{
            fontSize: t['3xl'], fontWeight: '700', color: t.primary,
          }}>{streak}</div>
          <div style={{ fontSize: t.sm, color: t.textMuted }}>连续打卡天数</div>
        </div>

        {checkedIn && (
          <div style={{
            marginTop: t.sp4, padding: `${t.sp3} ${t.sp4}`,
            background: t.primaryLight,
            borderRadius: t.rMd,
            fontSize: t.sm, color: t.primary, fontWeight: '500',
            border: `1px solid ${t.borderGlow}`,
          }}>
            {getEncouragement()}
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
              <div key={date} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isToday ? t.primary : isPast ? t.primaryLight : t.surfaceAlt,
                  color: isToday ? '#ffffff' : isPast ? t.success : t.textMuted,
                  fontSize: t.sm, fontWeight: isToday ? '700' : '500',
                  border: isToday ? `2px solid ${t.primary}` : `1px solid ${isPast ? t.borderGlow : t.border}`,
                  boxShadow: isToday ? '0 10px 18px rgba(34,197,94,0.18)' : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  {weekdayLabels[index]}
                </div>
                <div style={{
                  fontSize: '9px', color: isToday ? t.primary : t.textMuted, fontWeight: '500',
                }}>
                  {isToday ? '今天' : isPast ? <Check size={10} /> : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="animate-in animate-in-delay-2" style={{ ...card, marginTop: t.sp3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
          <Sprout size={14} style={{ color: t.primary }} />
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600' }}>温室小贴士</span>
        </div>
        <div style={{ color: t.textSecondary, fontSize: t.sm, lineHeight: 1.9 }}>
          {[
            { Icon: Sprout, text: '每天浇灌一点点，小苗会长成大树' },
            { Icon: ThermometerSun, text: '连续打卡让温室保持温暖' },
            { Icon: BarChart3, text: '打卡记录会保存在统计页面' },
          ].map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: t.sp2 }}>
              <Icon size={14} style={{ color: t.primary, flexShrink: 0 }} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
