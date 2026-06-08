import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Sparkles, ArrowRight, CheckCircle2, CircleDashed } from 'lucide-react';
import { t, card } from '../styles/tokens';

function ReviewTab({ review, reviewData, growthLogs, loading, onGenerate }) {
  return (
    <div>
      {/* Today data */}
      {reviewData && (
        <div className="animate-in" style={{
          ...card, marginBottom: t.sp3,
          background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.04) 0%, rgba(167, 139, 250, 0.04) 100%)',
        }}>
          <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>
            今日数据
          </div>
          <div style={{ display: 'flex', gap: t.sp3 }}>
            {[
              { value: reviewData.completed_count, label: '已完成', color: t.success },
              { value: reviewData.pending_count, label: '未完成', color: t.error },
              { value: `${reviewData.rate}%`, label: '完成率', color: t.primary },
            ].map((item, idx) => (
              <div key={idx} style={{
                flex: 1, textAlign: 'center', padding: `${t.sp3} 0`,
                background: `linear-gradient(135deg, ${item.color}10, rgba(255, 255, 255, 0.02))`,
                borderRadius: t.rMd,
                border: `1px solid ${item.color}15`,
              }}>
                <div style={{
                  fontSize: t.xl, fontWeight: '700', color: item.color,
                  textShadow: `0 0 12px ${item.color}25`,
                }}>{item.value}</div>
                <div style={{ fontSize: t.xs, color: t.textMuted }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: t.sp3, display: 'flex', gap: t.sp4, fontSize: t.sm, color: t.textMuted }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              打卡：
              {reviewData.checked_in ? (
                <>
                  <CheckCircle2 size={14} style={{ color: t.success }} /> 已完成
                </>
              ) : (
                <>
                  <CircleDashed size={14} style={{ color: t.textMuted }} /> 未打卡
                </>
              )}
            </span>
            {reviewData.mood && <span>心情：{reviewData.mood}</span>}
          </div>
        </div>
      )}

      {/* Generate button */}
      <div className="animate-in animate-in-delay-1" style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
          <RefreshCw size={14} style={{ color: t.primary }} />
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>
            AI 每日复盘
          </span>
        </div>
        <p style={{ color: t.textSecondary, marginBottom: t.sp4, fontSize: t.sm, lineHeight: 1.6 }}>
          温室会自动读取今日的任务和打卡数据，帮你回顾今天的成长
        </p>
        <button onClick={onGenerate} disabled={loading} style={{
          width: '100%', padding: `${t.sp3} ${t.sp5}`,
          borderRadius: t.rMd, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          minHeight: '44px', transition: 'all 0.2s',
          background: loading
            ? 'rgba(255, 255, 255, 0.06)'
            : 'linear-gradient(135deg, #4EEE94, #3cc07a)',
          color: loading ? t.textMuted : 'white',
          boxShadow: loading ? 'none' : '0 2px 12px rgba(78, 238, 148, 0.25)',
        }}>
          {loading ? '温室正在回顾...' : '生成今日复盘'}
        </button>
      </div>

      {/* Review result */}
      {review && (
        <div className="animate-in" style={{ ...card, marginTop: t.sp3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
            <Sparkles size={14} style={{ color: t.primary }} />
            <span style={{ fontSize: t.sm, color: t.primary, fontWeight: '600' }}>
              温室的复盘
            </span>
          </div>
          <div style={{
            padding: t.sp4,
            background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.06), rgba(167, 139, 250, 0.04))',
            borderRadius: t.rMd, whiteSpace: 'pre-wrap',
            lineHeight: 1.8, fontSize: t.sm, color: t.textSecondary,
            border: '1px solid rgba(78, 238, 148, 0.1)',
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
              成长足迹
            </div>
            <Link to="/growth-logs" style={{
              color: t.primary, fontSize: t.sm, textDecoration: 'none', fontWeight: '500',
              display: 'flex', alignItems: 'center', gap: '2px',
            }}>
              全部 <ArrowRight size={12} />
            </Link>
          </div>
          {growthLogs.map((log, index) => (
            <div key={log.id || index} style={{
              padding: `${t.sp3} 0`,
              borderBottom: index < growthLogs.length - 1 ? `1px solid rgba(255, 255, 255, 0.04)` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: t.sp2 }}>
                <span style={{ fontWeight: '600', color: t.text, fontSize: t.sm }}>{log.log_date}</span>
                {log.mood && <span style={{ color: t.textMuted, fontSize: t.xs }}>心情：{log.mood}</span>}
              </div>
              <div style={{ fontSize: t.sm, color: t.textSecondary, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
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
