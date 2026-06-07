import React, { useState, useEffect } from 'react';
import { getTodayStats, getWeekStats, getMonthStats, getOverview } from '../api/apiClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: t.surface, padding: `${t.sp2} ${t.sp3}`,
      borderRadius: t.rSm, border: `1px solid ${t.border}`,
      fontSize: t.sm, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ color: t.text, fontWeight: '600' }}>{label}</div>
      <div style={{ color: t.textSecondary }}>完成率: {payload[0].value}%</div>
    </div>
  );
}

function Stats() {
  const [todayStats, setTodayStats] = useState(null);
  const [weekStats, setWeekStats] = useState(null);
  const [monthStats, setMonthStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);
    } catch (error) {
      console.error('加载统计失败:', error);
      setError('加载统计数据失败，请稍后重试');
    }
    setLoading(false);
  };

  const getWeekday = (dateString) => {
    return ['日','一','二','三','四','五','六'][new Date(dateString).getDay()];
  };

  const chartData = weekStats?.week_data?.map(day => ({
    name: `周${getWeekday(day.date)}`,
    rate: day.rate,
    date: day.date,
  })) || [];

  const getBarColor = (rate) => {
    if (rate >= 80) return t.success;
    if (rate >= 50) return t.warning;
    return t.primary;
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

  if (error) {
    return (
      <div>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>数据统计</h2>
        <div style={{
          ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}`,
          backgroundColor: t.errorLight, border: `1px solid rgba(239,68,68,0.15)`,
        }}>
          <div style={{ fontSize: '32px', marginBottom: t.sp3 }}>😵</div>
          <div style={{ color: t.error, fontSize: t.md, fontWeight: '500', marginBottom: t.sp2 }}>{error}</div>
          <button onClick={() => { setLoading(true); setError(null); loadStats(); }} style={{
            padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, border: 'none',
            backgroundColor: t.primary, color: 'white', cursor: 'pointer',
            fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          }}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>数据统计</h2>

      {/* Overview grid */}
      <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.sp3, marginBottom: t.sp4 }}>
        <StatCard value={overview?.goals?.total || 0} label="总目标" color={t.primary} bgColor={t.primaryLight} icon="🎯" />
        <StatCard value={overview?.goals?.completed || 0} label="已完成" color={t.success} bgColor={t.successLight} icon="✅" />
        <StatCard value={overview?.checkins || 0} label="打卡天数" color={t.warning} bgColor={t.warningLight} icon="🔥" />
        <StatCard value={`${todayStats?.rate || 0}%`} label="今日完成率" color={todayStats?.rate >= 80 ? t.success : t.primary} bgColor={todayStats?.rate >= 80 ? t.successLight : t.primaryLight} icon="📈" />
      </div>

      {/* Today detail */}
      <div className="animate-in animate-in-delay-1" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>今日统计</div>
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

      {/* Week chart with Recharts */}
      <div className="animate-in animate-in-delay-2" style={{ ...card, marginBottom: t.sp3 }}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>本周完成率</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.borderLight} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.textMuted }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: t.textMuted }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.rate)} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Month detail */}
      <div className="animate-in animate-in-delay-3" style={card}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>本月统计</div>
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
