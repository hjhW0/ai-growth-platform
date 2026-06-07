import React, { useState, useEffect } from 'react';
import { getTodayStats, getWeekStats, getMonthStats, getOverview } from '../api/apiClient';
import { t, card } from '../styles/tokens';

function StatCard({ value, label, color, bgColor, icon }) {
  return (
    <div style={{
      ...card, padding: t.sp4, textAlign: 'center',
      background: `linear-gradient(135deg, ${bgColor}, ${bgColor})`,
      border: `1px solid ${color}15`,
    }}>
      <div style={{ fontSize: '20px', marginBottom: t.sp1 }}>{icon}</div>
      <div style={{ fontSize: t['2xl'], fontWeight: '700', color }}>{value}</div>
      <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function Stats() {
  const [todayStats, setTodayStats] = useState(null);
  const [weekStats, setWeekStats] = useState(null);
  const [monthStats, setMonthStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [today, week, month, overviewData] = await Promise.all([
        getTodayStats(), getWeekStats(), getMonthStats(), getOverview()
      ]);
      setTodayStats(today);
      setWeekStats(week);
      setMonthStats(month);
      setOverview(overviewData);
    } catch (error) { console.error('加载统计失败:', error); }
    setLoading(false);
  };

  const getWeekday = (dateString) => {
    return ['日','一','二','三','四','五','六'][new Date(dateString).getDay()];
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>数据统计</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.sp3 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ ...card, padding: t.sp4 }}>
              <div style={{ height: 14, width: '40%', backgroundColor: t.surfaceAlt, borderRadius: t.rSm, margin: `0 auto ${t.sp3}` }} />
              <div style={{ height: 24, width: '50%', backgroundColor: t.surfaceAlt, borderRadius: t.rSm, margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>数据统计</h2>

      {/* Overview grid */}
      <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.sp3, marginBottom: t.sp4 }}>
        <StatCard
          value={overview?.goals?.total || 0}
          label="总目标"
          color={t.primary}
          bgColor={t.primaryLight}
          icon="🎯"
        />
        <StatCard
          value={overview?.goals?.completed || 0}
          label="已完成"
          color={t.success}
          bgColor={t.successLight}
          icon="✅"
        />
        <StatCard
          value={overview?.checkins || 0}
          label="打卡天数"
          color={t.warning}
          bgColor={t.warningLight}
          icon="🔥"
        />
        <StatCard
          value={`${todayStats?.rate || 0}%`}
          label="今日完成率"
          color={todayStats?.rate >= 80 ? t.success : t.primary}
          bgColor={todayStats?.rate >= 80 ? t.successLight : t.primaryLight}
          icon="📈"
        />
      </div>

      {/* Today detail */}
      <div className="animate-in animate-in-delay-1" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>
          今日统计
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.primary }}>{todayStats?.total || 0}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>总任务</div>
          </div>
          <div style={{ width: 1, backgroundColor: t.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.success }}>{todayStats?.completed || 0}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>已完成</div>
          </div>
          <div style={{ width: 1, backgroundColor: t.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.warning }}>{todayStats?.rate || 0}%</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>完成率</div>
          </div>
        </div>
      </div>

      {/* Week chart */}
      <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>
          本周完成率
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          height: '120px', gap: t.sp2,
        }}>
          {weekStats?.week_data?.map((day) => {
            const barColor = day.rate >= 80 ? t.success : day.rate >= 50 ? t.warning : t.primary;
            return (
              <div key={day.date} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flex: 1, height: '100%', justifyContent: 'flex-end',
              }}>
                <div style={{ fontSize: '10px', color: t.textMuted, marginBottom: '4px', fontWeight: '500' }}>
                  {day.rate > 0 ? `${day.rate}%` : ''}
                </div>
                <div style={{
                  width: '100%', maxWidth: '32px',
                  height: `${Math.max(day.rate, 3)}%`,
                  backgroundColor: barColor,
                  borderRadius: `${t.rSm} ${t.rSm} 0 0`,
                  opacity: 0.85,
                  transition: 'height 0.5s ease',
                }} />
                <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: t.sp2, fontWeight: '500' }}>
                  {getWeekday(day.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month detail */}
      <div className="animate-in animate-in-delay-3" style={card}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>
          本月统计
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.primary }}>{monthStats?.total || 0}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>总任务</div>
          </div>
          <div style={{ width: 1, backgroundColor: t.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.success }}>{monthStats?.completed || 0}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>已完成</div>
          </div>
          <div style={{ width: 1, backgroundColor: t.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.warning }}>{monthStats?.rate || 0}%</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>完成率</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
