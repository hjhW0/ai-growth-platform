import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { getTodayStats, getWeekStats, getMonthStats, getOverview } from '../api/apiClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { t, card } from '../styles/tokens';
import ErrorState from '../components/ErrorState';

function StatCard({ value, label, color, icon }) {
  return (
    <div className="card-hover" style={{
      ...card, padding: t.sp4, textAlign: 'center',
      background: `linear-gradient(135deg, ${color}10, rgba(255, 255, 255, 0.02))`,
      border: `1px solid ${color}20`,
      boxShadow: `0 0 20px ${color}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
      cursor: 'default',
    }}>
      <div style={{
        marginBottom: t.sp2, display: 'flex', justifyContent: 'center',
        width: 36, height: 36, borderRadius: '50%', margin: `0 auto ${t.sp2}`,
        background: `radial-gradient(circle, ${color}20, transparent)`,
        border: `1px solid ${color}15`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {icon}
        </div>
      </div>
      <div style={{
        fontSize: t['2xl'], fontWeight: '700', color,
        textShadow: `0 0 16px ${color}30`,
      }}>{value}</div>
      <div style={{ fontSize: t.xs, color: t.textMuted, marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: 'rgba(26, 28, 41, 0.95)', padding: `${t.sp2} ${t.sp3}`,
      borderRadius: t.rSm, border: `1px solid rgba(78, 238, 148, 0.15)`,
      fontSize: t.sm, boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ color: t.text, fontWeight: '600' }}>{label}</div>
      <div style={{ color: t.primary }}>完成率: {payload[0].value}%</div>
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
      setError('温室的数据还在生长中，暂时加载不到');
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
    if (rate >= 80) return '#4EEE94';
    if (rate >= 50) return '#f59e0b';
    return '#a78bfa';
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>
          数据统计
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.sp3 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              ...card, padding: t.sp4, height: 100,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>
          数据统计
        </h2>
        <ErrorState message={error} onRetry={() => { setLoading(true); setError(null); loadStats(); }} />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>
        成长仪表盘
      </h2>

      {/* Overview grid */}
      <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.sp3, marginBottom: t.sp4 }}>
        <StatCard value={overview?.goals?.total || 0} label="总目标" color={t.primary} icon={<Target size={18} style={{ color: t.primary }} />} />
        <StatCard value={overview?.goals?.completed || 0} label="已完成" color={t.success} icon={<CheckCircle2 size={18} style={{ color: t.success }} />} />
        <StatCard value={overview?.checkins || 0} label="打卡天数" color={t.warning} icon={<Flame size={18} style={{ color: t.warning }} />} />
        <StatCard value={`${todayStats?.rate || 0}%`} label="今日完成率" color={todayStats?.rate >= 80 ? t.success : t.primary} icon={<TrendingUp size={18} style={{ color: todayStats?.rate >= 80 ? t.success : t.primary }} />} />
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
          <div style={{ width: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.success }}>{todayStats?.completed || 0}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>已完成</div>
          </div>
          <div style={{ width: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />
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
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.textMuted }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: t.textMuted }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(78, 238, 148, 0.04)' }} />
            <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={getBarColor(entry.rate)}
                  opacity={0.85}
                  style={{ filter: `drop-shadow(0 0 6px ${getBarColor(entry.rate)}40)` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
          <div style={{ width: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: t.xl, fontWeight: '700', color: t.success }}>{monthStats?.completed || 0}</div>
            <div style={{ fontSize: t.xs, color: t.textMuted }}>已完成</div>
          </div>
          <div style={{ width: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />
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
