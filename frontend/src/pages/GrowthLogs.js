import React, { useState, useEffect } from 'react';
import { getGrowthLogs } from '../api/apiClient';
import { t, card } from '../styles/tokens';
import EmptyPot from '../components/EmptyPot';
import ErrorState from '../components/ErrorState';
import { SkeletonCard } from '../components/Skeleton';

const moodConfig = {
  good: { icon: '😊', label: '不错', color: t.success, bg: 'rgba(78, 238, 148, 0.1)' },
  bad: { icon: '😔', label: '一般', color: t.error, bg: 'rgba(239, 68, 68, 0.08)' },
  normal: { icon: '😐', label: '还行', color: t.textMuted, bg: 'rgba(255, 255, 255, 0.04)' },
};

function GrowthLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    try {
      const res = await getGrowthLogs({ limit: 50 });
      setLogs(res.data || []);
      setError(null);
    } catch (error) {
      console.error('加载成长日志失败:', error);
      setError('温室的记忆库暂时打不开');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>
          成长足迹
        </h2>
        <SkeletonCard lines={2} height={100} />
        <SkeletonCard lines={2} height={100} />
        <SkeletonCard lines={2} height={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>
          成长足迹
        </h2>
        <ErrorState message={error} onRetry={() => { setLoading(true); setError(null); loadLogs(); }} />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>
        成长足迹
      </h2>

      {logs.length === 0 ? (
        <div style={{ ...card }}>
          <EmptyPot text="还没有成长记录" sub="去 AI 中心生成复盘，温室会帮你记录每一天" />
        </div>
      ) : (
        <div>
          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: t.sp5 }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute', left: '7px', top: '8px', bottom: '8px',
              width: '2px',
              background: 'linear-gradient(to bottom, rgba(78, 238, 148, 0.3), rgba(167, 139, 250, 0.15))',
              borderRadius: '1px',
            }} />

            {logs.map((log, index) => {
              const mood = moodConfig[log.mood] || moodConfig.normal;
              return (
                <div key={log.id || index} className="animate-in" style={{
                  position: 'relative',
                  marginBottom: index < logs.length - 1 ? t.sp4 : 0,
                  paddingLeft: t.sp4,
                  animationDelay: `${index * 0.05}s`,
                }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: `-${t.sp5}`, top: '8px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4EEE94, #3cc07a)',
                    border: `2px solid ${t.bg}`,
                    zIndex: 1,
                    boxShadow: '0 0 8px rgba(78, 238, 148, 0.3)',
                  }} />

                  <div className="card-hover" style={{ ...card, padding: t.sp4, cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp3 }}>
                      <span style={{ fontWeight: '600', color: t.text, fontSize: t.sm }}>{log.log_date}</span>
                      {log.mood && (
                        <span style={{
                          padding: '2px 8px', borderRadius: t.rFull,
                          fontSize: t.xs, fontWeight: '500',
                          backgroundColor: mood.bg, color: mood.color,
                          display: 'flex', alignItems: 'center', gap: '4px',
                          border: `1px solid ${mood.color}20`,
                        }}>
                          {mood.icon} {mood.label}
                        </span>
                      )}
                    </div>
                    {log.ai_summary && (
                      <div style={{
                        padding: t.sp3,
                        background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.06), rgba(167, 139, 250, 0.04))',
                        borderRadius: t.rMd, whiteSpace: 'pre-wrap',
                        lineHeight: 1.8, fontSize: t.sm, color: t.textSecondary,
                        border: '1px solid rgba(78, 238, 148, 0.08)',
                      }}>
                        {log.ai_summary}
                      </div>
                    )}
                    {log.tags && log.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap', marginTop: t.sp3 }}>
                        {log.tags.map((tag, i) => (
                          <span key={i} style={{
                            padding: '2px 8px', borderRadius: t.rFull,
                            fontSize: t.xs, fontWeight: '500',
                            backgroundColor: 'rgba(78, 238, 148, 0.08)', color: t.primary,
                            border: '1px solid rgba(78, 238, 148, 0.12)',
                          }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default GrowthLogs;
