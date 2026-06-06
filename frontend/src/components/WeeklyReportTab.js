import React from 'react';

const CARD = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

function WeeklyReportTab({ weeklyReport, weekData, loading, onGenerate }) {
  return (
    <div>
      {/* 本周数据概览 */}
      {weekData && (
        <div style={CARD}>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '14px', fontWeight: '500' }}>📊 本周数据概览</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{weekData.completed_count}</div>
              <div style={{ fontSize: '11px', color: '#999' }}>已完成任务</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#6366f1' }}>{weekData.rate}%</div>
              <div style={{ fontSize: '11px', color: '#999' }}>总完成率</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{weekData.checkin_count}</div>
              <div style={{ fontSize: '11px', color: '#999' }}>打卡天数</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fce7f3', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ec4899' }}>{weekData.total_duration_minutes}</div>
              <div style={{ fontSize: '11px', color: '#999' }}>学习时长(分钟)</div>
            </div>
          </div>

          {/* 每日完成情况 */}
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontWeight: '500' }}>每日完成率</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {weekData.daily_data && Object.entries(weekData.daily_data).map(([date, d]) => {
              const weekday = ['一', '二', '三', '四', '五', '六', '日'][new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1];
              return (
                <div key={date} style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 0',
                  backgroundColor: d.rate >= 80 ? '#dcfce7' : d.rate > 0 ? '#fef9c3' : '#f5f5f5',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontSize: '10px', color: '#999' }}>周{weekday}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: d.rate >= 80 ? '#10b981' : d.rate > 0 ? '#f59e0b' : '#ddd' }}>
                    {d.rate}%
                  </div>
                </div>
              );
            })}
          </div>

          {weekData.active_goals && weekData.active_goals.length > 0 && (
            <div style={{ fontSize: '12px', color: '#999' }}>
              当前目标：{weekData.active_goals.map(g => g.title).join('、')}
            </div>
          )}
        </div>
      )}

      {/* 生成按钮 */}
      <div style={CARD}>
        <div style={{ fontSize: '14px', color: '#999', marginBottom: '10px', fontWeight: '500' }}>📊 AI 周报告</div>
        <p style={{ color: '#999', marginBottom: '14px', fontSize: '13px' }}>
          AI 将自动读取本周任务、打卡、目标数据，生成深度分析报告
        </p>
        <button
          onClick={onGenerate}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#e0e0e0' : '#ec4899',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            minHeight: '44px',
            width: '100%',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? '⏳ AI 分析中...' : '🔮 一键生成周报告'}
        </button>
      </div>

      {/* AI 周报结果 */}
      {weeklyReport && (
        <div style={CARD}>
          <div style={{ fontSize: '14px', color: '#ec4899', marginBottom: '14px', fontWeight: '600' }}>🤖 AI 周报告</div>
          <div style={{
            padding: '14px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.7',
            fontSize: '14px',
            color: '#444'
          }}>
            {weeklyReport}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyReportTab;
