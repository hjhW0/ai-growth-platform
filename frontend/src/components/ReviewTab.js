import React from 'react';
import { Link } from 'react-router-dom';

const CARD = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

function ReviewTab({ review, reviewData, growthLogs, loading, onGenerate }) {
  return (
    <div>
      {/* 今日数据卡片 */}
      {reviewData && (
        <div style={CARD}>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '14px', fontWeight: '500' }}>📊 今日数据</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
            <div style={{ textAlign: 'center', flex: 1, padding: '10px 0', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#10b981' }}>{reviewData.completed_count}</div>
              <div style={{ fontSize: '11px', color: '#999' }}>已完成</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1, padding: '10px 0', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#ef4444' }}>{reviewData.pending_count}</div>
              <div style={{ fontSize: '11px', color: '#999' }}>未完成</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1, padding: '10px 0', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#6366f1' }}>{reviewData.rate}%</div>
              <div style={{ fontSize: '11px', color: '#999' }}>完成率</div>
            </div>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '16px', fontSize: '12px', color: '#999' }}>
            <span>打卡：{reviewData.checked_in ? '✅ 已完成' : '❌ 未打卡'}</span>
            {reviewData.mood && <span>心情：{reviewData.mood}</span>}
          </div>
        </div>
      )}

      {/* 生成按钮 */}
      <div style={CARD}>
        <div style={{ fontSize: '14px', color: '#999', marginBottom: '10px', fontWeight: '500' }}>📝 AI 每日复盘</div>
        <p style={{ color: '#999', marginBottom: '14px', fontSize: '13px' }}>
          AI 将自动读取今日任务完成情况和打卡数据，生成个性化复盘
        </p>
        <button
          onClick={onGenerate}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#e0e0e0' : '#6366f1',
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
          {loading ? '⏳ AI 分析中...' : '🔮 一键生成今日复盘'}
        </button>
      </div>

      {/* AI 复盘结果 */}
      {review && (
        <div style={CARD}>
          <div style={{ fontSize: '14px', color: '#6366f1', marginBottom: '14px', fontWeight: '600' }}>🤖 AI 复盘总结</div>
          <div style={{
            padding: '14px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.7',
            fontSize: '14px',
            color: '#444'
          }}>
            {review}
          </div>
        </div>
      )}

      {/* 历史成长日志 */}
      {growthLogs.length > 0 && (
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', color: '#999', fontWeight: '500' }}>📚 历史成长记录</div>
            <Link to="/growth-logs" style={{ color: '#6366f1', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>查看全部 →</Link>
          </div>
          {growthLogs.map((log, index) => (
            <div key={log.id || index} style={{
              padding: '12px 0',
              borderBottom: index < growthLogs.length - 1 ? '1px solid #f5f5f5' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#333', fontSize: '13px' }}>{log.log_date}</span>
                {log.mood && <span style={{ color: '#bbb', fontSize: '12px' }}>心情：{log.mood}</span>}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {log.ai_summary || log.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewTab;
