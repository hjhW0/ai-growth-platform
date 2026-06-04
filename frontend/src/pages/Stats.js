import React, { useState, useEffect } from 'react';
import { getTodayStats, getWeekStats, getMonthStats, getOverview } from '../api/apiClient';

function Stats() {
  const [todayStats, setTodayStats] = useState(null);
  const [weekStats, setWeekStats] = useState(null);
  const [monthStats, setMonthStats] = useState(null);
  const [overview, setOverview] = useState(null);

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
  };

  const getWeekday = (dateString) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const date = new Date(dateString);
    return weekdays[date.getDay()];
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>📊 数据统计</h2>

      {/* 总览 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>📈 总览</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>
              {overview?.goals?.total || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>总目标</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {overview?.goals?.completed || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>已完成</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {overview?.checkins || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>打卡天数</div>
          </div>
        </div>
      </div>

      {/* 今日统计 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>📅 今日统计</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>
              {todayStats?.total || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>总任务</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {todayStats?.completed || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>已完成</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {todayStats?.rate || 0}%
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>完成率</div>
          </div>
        </div>
      </div>

      {/* 本周统计 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>📈 本周完成率</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '200px' }}>
          {weekStats?.week_data?.map((day, index) => (
            <div key={day.date} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                width: '30px',
                height: `${Math.max(day.rate, 5)}%`,
                backgroundColor: day.rate >= 80 ? '#10b981' : day.rate >= 50 ? '#f59e0b' : '#6366f1',
                borderRadius: '4px 4px 0 0',
                marginBottom: '8px'
              }} />
              <div style={{ fontSize: '12px', color: '#666' }}>
                {getWeekday(day.date)}
              </div>
              <div style={{ fontSize: '10px', color: '#999' }}>
                {day.rate}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 本月统计 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>📊 本月统计</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>
              {monthStats?.total || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>总任务</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {monthStats?.completed || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>已完成</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {monthStats?.rate || 0}%
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>完成率</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
