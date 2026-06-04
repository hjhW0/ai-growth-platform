import React from 'react';

function WeeklyReportTab({ weeklyReport, weekData, loading, onGenerate }) {
  return (
    <div>
      {/* 本周数据概览 */}
      {weekData && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ marginBottom: '16px', color: '#666' }}>📊 本周数据概览</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '14px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{weekData.completed_count}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>已完成任务</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{weekData.rate}%</div>
              <div style={{ fontSize: '12px', color: '#666' }}>总完成率</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{weekData.checkin_count}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>打卡天数</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: '#fce7f3', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ec4899' }}>{weekData.total_duration_minutes}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>学习时长(分钟)</div>
            </div>
          </div>

          {/* 每日完成情况 */}
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>每日完成率</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
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
                  <div style={{ fontSize: '11px', color: '#888' }}>周{weekday}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: d.rate >= 80 ? '#22c55e' : d.rate > 0 ? '#eab308' : '#ccc' }}>
                    {d.rate}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* 活跃目标 */}
          {weekData.active_goals && weekData.active_goals.length > 0 && (
            <div style={{ fontSize: '13px', color: '#888' }}>
              当前目标：{weekData.active_goals.map(g => g.title).join('、')}
            </div>
          )}
        </div>
      )}

      {/* 生成按钮 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '12px' }}>📊 AI 周报告</h3>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          AI 将自动读取本周任务、打卡、目标数据，生成深度分析报告
        </p>
        <button
          onClick={onGenerate}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#ec4899',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '⏳ AI 分析中...' : '🔮 一键生成周报告'}
        </button>
      </div>

      {/* AI 周报结果 */}
      {weeklyReport && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#ec4899' }}>🤖 AI 周报告</h3>
          <div style={{
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8'
          }}>
            {weeklyReport}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyReportTab;
