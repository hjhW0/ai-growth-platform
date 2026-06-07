import React, { useState, useEffect } from 'react';
import { getGrowthLogs } from '../api/apiClient';
import { t, card } from '../styles/tokens';

const moodConfig = {
  good: { icon: '😊', label: '不错', color: t.success, bg: t.successLight },
  bad: { icon: '😔', label: '一般', color: t.error, bg: t.errorLight },
  normal: { icon: '😐', label: '还行', color: t.textMuted, bg: t.surfaceAlt },
};

function GrowthLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    try {
      const res = await getGrowthLogs({ limit: 50 });
      setLogs(res.data || []);
    } catch (error) { console.error('加载成长日志失败:', error); }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>成长日志</h2>
        {[1,2,3].map(i => (
          <div key={i} style={{ ...card, marginBottom: t.sp3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: t.sp3 }}>
              <div style={{ height: 14, width: 80, backgroundColor: t.surfaceAlt, borderRadius: t.rSm }} />
              <div style={{ height: 14, width: 50, backgroundColor: t.surfaceAlt, borderRadius: t.rSm }} />
            </div>
            <div style={{ height: 60, backgroundColor: t.surfaceAlt, borderRadius: t.rMd }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: t.xl, fontWeight: '700', color: t.text, marginBottom: t.sp4, letterSpacing: '-0.02em' }}>成长日志</h2>

      {logs.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}` }}>
          <div style={{ fontSize: '40px', marginBottom: t.sp3 }}>📝</div>
          <div style={{ color: t.textSecondary, fontSize: t.md, fontWeight: '500', marginBottom: t.sp1 }}>暂无成长记录</div>
          <div style={{ color: t.textMuted, fontSize: t.sm }}>去 AI 中心生成复盘后自动记录</div>
        </div>
      ) : (
        <div>
          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: t.sp5 }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute', left: '7px', top: '8px', bottom: '8px',
              width: '2px', backgroundColor: t.border, borderRadius: '1px',
            }} />

            {logs.map((log, index) => {
              const mood = moodConfig[log.mood] || moodConfig.normal;
              return (
                <div key={log.id || index} className="animate-in" style={{
                  position: 'relative',
                  marginBottom: index < logs.length - 1 ? t.sp4 : 0,
                  paddingLeft: t.sp4,
                }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: `-${t.sp5}`, top: '8px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: t.primary, border: `2px solid ${t.surface}`,
                    zIndex: 1,
                  }} />

                  <div style={{ ...card, padding: t.sp4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp3 }}>
                      <span style={{ fontWeight: '600', color: t.text, fontSize: t.sm }}>{log.log_date}</span>
                      {log.mood && (
                        <span style={{
                          padding: '2px 8px', borderRadius: t.rFull,
                          fontSize: t.xs, fontWeight: '500',
                          backgroundColor: mood.bg, color: mood.color,
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}>
                          {mood.icon} {mood.label}
                        </span>
                      )}
                    </div>
                    {log.ai_summary && (
                      <div style={{
                        padding: t.sp3, backgroundColor: t.primaryLight,
                        borderRadius: t.rMd, whiteSpace: 'pre-wrap',
                        lineHeight: 1.7, fontSize: t.sm, color: t.textSecondary,
                        border: `1px solid rgba(91,95,239,0.08)`,
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
                            backgroundColor: t.primaryLight, color: t.primary,
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
