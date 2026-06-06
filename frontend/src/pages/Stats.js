import React, { useState, useEffect } from 'react';
import { getTodayStats, getWeekStats, getMonthStats, getOverview } from '../api/apiClient';

const CARD = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

function StatNumber({ value, label, color = '#6366f1' }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function Stats() {
  const [todayStats, setTodayStats] = useState(null);
  const [weekStats, setWeekStats] = useState(null);
  const [monthStats, setMonthStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [today, week, month, overviewData] = await Promise.all([
        getTodayStats(),
        getWeekStats(),
        getMonthStats(),
        getOverview()
      ]);
      setTodayStats(today);
      setWeekStats(week);
      setMonthStats(month);
      setOverview(overviewData);
    } catch (error) {
      console.error('加载统计失败:', error);
    }
    setLoading(false);
  };

  const getWeekday = (dateString) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const date = new Date(dateString);
    return weekdays[date.getDay()];
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>📊 数据统计</h2>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={CARD}>
            <div style={{ height: 14, width: '30%', backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {[1, 2, 3].map(j => (
                <div key={j} style={{ textAlign: 'center' }}>
                  <div style={{ height: 28, width: 40, backgroundColor: '#f0f0f0', borderRadius: 4, margin: '0 auto 6px' }} />
                  <div style={{ height: 12, width: 30, backgroundColor: '#f0f0f0', borderRadius: 4, margin: '0 auto' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>📊 数据统计</h2>

      {/* 总览 */}
      <div style={CARD}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px', fontWeight: '500' }}>📈 总览</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <StatNumber value={overview?.goals?.total || 0} label="总目标" color="#6366f1" />
          <StatNumber value={overview?.goals?.completed || 0} label="已完成" color="#10b981" />
          <StatNumber value={overview?.checkins || 0} label="打卡天数" color="#f59e0b" />
        </div>
      </div>

      {/* 今日统计 */}
      <div style={CARD}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px', fontWeight: '500' }}>📅 今日统计</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <StatNumber value={todayStats?.total || 0} label="总任务" color="#6366f1" />
          <StatNumber value={todayStats?.completed || 0} label="已完成" color="#10b981" />
          <StatNumber value={`${todayStats?.rate || 0}%`} label="完成率" color="#f59e0b" />
        </div>
      </div>

      {/* 本周统计 */}
      <div style={CARD}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px', fontWeight: '500' }}>📈 本周完成率</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px', gap: '6px' }}>
          {weekStats?.week_data?.map((day) => (
            <div key={day.date} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              height: '100%',
              justifyContent: 'flex-end'
            }}>
              <div style={{
                fontSize: '10px',
                color: '#999',
                marginBottom: '4px'
              }}>
                {day.rate}%
              </div>
              <div style={{
                width: '100%',
                maxWidth: '32px',
                height: `${Math.max(day.rate, 4)}%`,
                backgroundColor: day.rate >= 80 ? '#10b981' : day.rate >= 50 ? '#f59e0b' : '#6366f1',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.5s ease'
              }} />
              <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>
                {getWeekday(day.date)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 本月统计 */}
      <div style={CARD}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px', fontWeight: '500' }}>📊 本月统计</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <StatNumber value={monthStats?.total || 0} label="总任务" color="#6366f1" />
          <StatNumber value={monthStats?.completed || 0} label="已完成" color="#10b981" />
          <StatNumber value={`${monthStats?.rate || 0}%`} label="完成率" color="#f59e0b" />
        </div>
      </div>
    </div>
  );
}

export default Stats;
