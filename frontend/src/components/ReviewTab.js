import React from 'react';
import { Link } from 'react-router-dom';

const CARD = { backgroundColor: '#111111', borderRadius: '12px', padding: '20px', marginBottom: '12px', border: '1px solid #27272a' };

function ReviewTab({ review, reviewData, growthLogs, loading, onGenerate }) {
  return (
    <div>
      {reviewData && (
        <div style={CARD}>
          <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '14px', fontWeight: '500' }}>📊 今日数据</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
            <div style={{ textAlign: 'center', flex: 1, padding: '10px 0', backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.15)' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>{reviewData.completed_count}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>已完成</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1, padding: '10px 0', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>{reviewData.pending_count}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>未完成</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1, padding: '10px 0', backgroundColor: 'rgba(99,102,241,0.08)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#6366f1' }}>{reviewData.rate}%</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>完成率</div>
            </div>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '16px', fontSize: '12px', color: '#71717a' }}>
            <span>打卡：{reviewData.checked_in ? '✅ 已完成' : '❌ 未打卡'}</span>
            {reviewData.mood && <span>心情：{reviewData.mood}</span>}
          </div>
        </div>
      )}

      <div style={CARD}>
        <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '10px', fontWeight: '500' }}>📝 AI 每日复盘</div>
        <p style={{ color: '#71717a', marginBottom: '14px', fontSize: '13px' }}>AI 将自动读取今日任务完成情况和打卡数据，生成个性化复盘</p>
        <button onClick={onGenerate} disabled={loading}
          style={{ backgroundColor: loading ? '#1a1a1a' : '#6366f1', color: loading ? '#52525b' : 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600', minHeight: '44px', width: '100%', transition: 'all 0.2s' }}>
          {loading ? '⏳ AI 分析中...' : '🔮 一键生成今日复盘'}
        </button>
      </div>

      {review && (
        <div style={CARD}>
          <div style={{ fontSize: '13px', color: '#6366f1', marginBottom: '14px', fontWeight: '600' }}>🤖 AI 复盘总结</div>
          <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '13px', color: '#a1a1aa', border: '1px solid #27272a' }}>{review}</div>
        </div>
      )}

      {growthLogs.length > 0 && (
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: '500' }}>📚 历史成长记录</div>
            <Link to="/growth-logs" style={{ color: '#6366f1', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>查看全部 →</Link>
          </div>
          {growthLogs.map((log, index) => (
            <div key={log.id || index} style={{ padding: '12px 0', borderBottom: index < growthLogs.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#fafafa', fontSize: '13px' }}>{log.log_date}</span>
                {log.mood && <span style={{ color: '#52525b', fontSize: '12px' }}>心情：{log.mood}</span>}
              </div>
              <div style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{log.ai_summary || log.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewTab;
