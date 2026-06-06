import React from 'react';

const CARD = { backgroundColor: '#111111', borderRadius: '12px', padding: '20px', marginBottom: '12px', border: '1px solid #27272a' };

function WeeklyReportTab({ weeklyReport, weekData, loading, onGenerate }) {
  return (
    <div>
      {weekData && (
        <div style={CARD}>
          <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '14px', fontWeight: '500' }}>📊 本周数据概览</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(34,197,94,0.15)' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#22c55e' }}>{weekData.completed_count}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>已完成任务</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(99,102,241,0.08)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#6366f1' }}>{weekData.rate}%</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>总完成率</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(245,158,11,0.15)' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b' }}>{weekData.checkin_count}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>打卡天数</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(236,72,153,0.08)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(236,72,153,0.15)' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#ec4899' }}>{weekData.total_duration_minutes}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>学习时长(分钟)</div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '8px', fontWeight: '500' }}>每日完成率</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {weekData.daily_data && Object.entries(weekData.daily_data).map(([date, d]) => {
              const weekday = ['一','二','三','四','五','六','日'][new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1];
              return (
                <div key={date} style={{ flex: 1, textAlign: 'center', padding: '8px 0', backgroundColor: d.rate >= 80 ? 'rgba(34,197,94,0.1)' : d.rate > 0 ? 'rgba(245,158,11,0.1)' : '#1a1a1a', borderRadius: '6px', border: '1px solid #27272a' }}>
                  <div style={{ fontSize: '10px', color: '#71717a' }}>周{weekday}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: d.rate >= 80 ? '#22c55e' : d.rate > 0 ? '#f59e0b' : '#3f3f46' }}>{d.rate}%</div>
                </div>
              );
            })}
          </div>

          {weekData.active_goals && weekData.active_goals.length > 0 && (
            <div style={{ fontSize: '12px', color: '#71717a' }}>当前目标：{weekData.active_goals.map(g => g.title).join('、')}</div>
          )}
        </div>
      )}

      <div style={CARD}>
        <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '10px', fontWeight: '500' }}>📊 AI 周报告</div>
        <p style={{ color: '#71717a', marginBottom: '14px', fontSize: '13px' }}>AI 将自动读取本周任务、打卡、目标数据，生成深度分析报告</p>
        <button onClick={onGenerate} disabled={loading}
          style={{ backgroundColor: loading ? '#1a1a1a' : '#ec4899', color: loading ? '#52525b' : 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600', minHeight: '44px', width: '100%', transition: 'all 0.2s' }}>
          {loading ? '⏳ AI 分析中...' : '🔮 一键生成周报告'}
        </button>
      </div>

      {weeklyReport && (
        <div style={CARD}>
          <div style={{ fontSize: '13px', color: '#ec4899', marginBottom: '14px', fontWeight: '600' }}>🤖 AI 周报告</div>
          <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '13px', color: '#a1a1aa', border: '1px solid #27272a' }}>{weeklyReport}</div>
        </div>
      )}
    </div>
  );
}

export default WeeklyReportTab;
