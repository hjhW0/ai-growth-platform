import React from 'react';
import { Link } from 'react-router-dom';
import { t, card } from '../styles/tokens';

function ReviewTab({ review, reviewData, growthLogs, loading, onGenerate }) {
  return (
    <div>
      {/* Today data */}
      {reviewData && (
        <div className="animate-in" style={{ ...card, marginBottom: t.sp3 }}>
          <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>
            今日数据
          </div>
          <div style={{ display: 'flex', gap: t.sp3 }}>
            <div style={{
              flex: 1, textAlign: 'center', padding: `${t.sp3} 0`,
              backgroundColor: t.successLight, borderRadius: t.rMd,
              border: `1px solid rgba(16,185,129,0.12)`,
            }}>
              <div style={{ fontSize: t.xl, fontWeight: '700', color: t.success }}>{reviewData.completed_count}</div>
              <div style={{ fontSize: t.xs, color: t.textMuted }}>已完成</div>
            </div>
            <div style={{
              flex: 1, textAlign: 'center', padding: `${t.sp3} 0`,
              backgroundColor: t.errorLight, borderRadius: t.rMd,
              border: `1px solid rgba(239,68,68,0.12)`,
            }}>
              <div style={{ fontSize: t.xl, fontWeight: '700', color: t.error }}>{reviewData.pending_count}</div>
              <div style={{ fontSize: t.xs, color: t.textMuted }}>未完成</div>
            </div>
            <div style={{
              flex: 1, textAlign: 'center', padding: `${t.sp3} 0`,
              backgroundColor: t.primaryLight, borderRadius: t.rMd,
              border: `1px solid rgba(91,95,239,0.12)`,
            }}>
              <div style={{ fontSize: t.xl, fontWeight: '700', color: t.primary }}>{reviewData.rate}%</div>
              <div style={{ fontSize: t.xs, color: t.textMuted }}>完成率</div>
            </div>
          </div>
          <div style={{ marginTop: t.sp3, display: 'flex', gap: t.sp4, fontSize: t.sm, color: t.textMuted }}>
            <span>打卡：{reviewData.checked_in ? '✅ 已完成' : '❌ 未打卡'}</span>
            {reviewData.mood && <span>心情：{reviewData.mood}</span>}
          </div>
        </div>
      )}

      {/* Generate button */}
      <div className="animate-in animate-in-delay-1" style={card}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp3, letterSpacing: '0.02em' }}>
          AI 每日复盘
        </div>
        <p style={{ color: t.textSecondary, marginBottom: t.sp4, fontSize: t.sm, lineHeight: 1.5 }}>
          AI 将自动读取今日任务完成情况和打卡数据，生成个性化复盘
        </p>
        <button onClick={onGenerate} disabled={loading} style={{
          width: '100%', padding: `${t.sp3} ${t.sp5}`,
          borderRadius: t.rMd, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          minHeight: '44px', transition: 'all 0.15s',
          backgroundColor: loading ? t.border : t.primary,
          color: loading ? t.textMuted : 'white',
        }}>
          {loading ? '⏳ AI 分析中...' : '🔮 一键生成今日复盘'}
        </button>
      </div>

      {/* Review result */}
      {review && (
        <div className="animate-in" style={{ ...card, marginTop: t.sp3 }}>
          <div style={{ fontSize: t.sm, color: t.primary, fontWeight: '600', marginBottom: t.sp3 }}>
            AI 复盘总结
          </div>
          <div style={{
            padding: t.sp4, backgroundColor: t.primaryLight,
            borderRadius: t.rMd, whiteSpace: 'pre-wrap',
            lineHeight: 1.7, fontSize: t.sm, color: t.textSecondary,
            border: `1px solid rgba(91,95,239,0.08)`,
          }}>
            {review}
          </div>
        </div>
      )}

      {/* History */}
      {growthLogs.length > 0 && (
        <div className="animate-in animate-in-delay-2" style={{ ...card, marginTop: t.sp3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp4 }}>
            <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>
              历史记录
            </div>
            <Link to="/growth-logs" style={{ color: t.primary, fontSize: t.sm, textDecoration: 'none', fontWeight: '500' }}>
              查看全部 →
            </Link>
          </div>
          {growthLogs.map((log, index) => (
            <div key={log.id || index} style={{
              padding: `${t.sp3} 0`,
              borderBottom: index < growthLogs.length - 1 ? `1px solid ${t.borderLight}` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: t.sp2 }}>
                <span style={{ fontWeight: '600', color: t.text, fontSize: t.sm }}>{log.log_date}</span>
                {log.mood && <span style={{ color: t.textMuted, fontSize: t.xs }}>心情：{log.mood}</span>}
              </div>
              <div style={{ fontSize: t.sm, color: t.textSecondary, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
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
