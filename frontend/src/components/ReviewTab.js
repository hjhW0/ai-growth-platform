import React from 'react';
import { Link } from 'react-router-dom';

function ReviewTab({ review, reviewData, growthLogs, loading, onGenerate }) {
  return (
    <div>
      {/* 今日数据卡片 */}
      {reviewData && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ marginBottom: '12px', color: '#666' }}>📊 今日数据</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{reviewData.completed_count}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>已完成</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{reviewData.pending_count}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>未完成</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{reviewData.rate}%</div>
              <div style={{ fontSize: '12px', color: '#666' }}>完成率</div>
            </div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '13px', color: '#888' }}>
            <span>打卡：{reviewData.checked_in ? '✅ 已完成' : '❌ 未打卡'}</span>
            {reviewData.mood && <span>心情：{reviewData.mood}</span>}
          </div>
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
        <h3 style={{ marginBottom: '12px' }}>📝 AI 每日复盘</h3>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          AI 将自动读取今日任务完成情况和打卡数据，生成个性化复盘
        </p>
        <button
          onClick={onGenerate}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#8b5cf6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '⏳ AI 分析中...' : '🔮 一键生成今日复盘'}
        </button>
      </div>

      {/* AI 复盘结果 */}
      {review && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#8b5cf6' }}>🤖 AI 复盘总结</h3>
          <div style={{
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8'
          }}>
            {review}
          </div>
        </div>
      )}

      {/* 历史成长日志 */}
      {growthLogs.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#666', margin: 0 }}>📚 历史成长记录</h3>
            <Link to="/growth-logs" style={{ color: '#6366f1', fontSize: '14px', textDecoration: 'none' }}>查看全部 →</Link>
          </div>
          {growthLogs.map((log, index) => (
            <div key={log.id || index} style={{
              padding: '14px',
              borderBottom: index < growthLogs.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#333' }}>{log.log_date}</span>
                {log.mood && <span style={{ color: '#888', fontSize: '13px' }}>心情：{log.mood}</span>}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#555',
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
