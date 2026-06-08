import React from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
import { t, card } from '../styles/tokens';

function WeeklyReportTab({ weeklyReport, weekData, loading, onGenerate }) {
  return (
    <div>
      {/* Week data overview */}
      {weekData && (
        <div className="animate-in" style={{
          ...card, marginBottom: t.sp3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp4 }}>
            <BarChart3 size={14} style={{ color: t.primary }} />
            <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>
              本周数据概览
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.sp3, marginBottom: t.sp4 }}>
            {[
              { value: weekData.completed_count, label: '已完成任务', color: t.success },
              { value: `${weekData.rate}%`, label: '总完成率', color: t.primary },
              { value: weekData.checkin_count, label: '打卡天数', color: t.warning },
              { value: weekData.total_duration_minutes, label: '学习时长(分)', color: '#ec4899' },
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: t.sp3,
                background: `linear-gradient(135deg, ${item.color}12, #ffffff)`,
                borderRadius: t.rMd, textAlign: 'center',
                border: `1px solid ${item.color}15`,
              }}>
                <div style={{
                  fontSize: t.xl, fontWeight: '700', color: item.color,
                }}>{item.value}</div>
                <div style={{ fontSize: t.xs, color: t.textMuted }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Daily rate */}
          <div style={{ fontSize: t.xs, color: t.textMuted, marginBottom: t.sp2, fontWeight: '600' }}>每日完成率</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: t.sp3 }}>
            {weekData.daily_data && Object.entries(weekData.daily_data).map(([date, d]) => {
              const weekday = ['一','二','三','四','五','六','日'][new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1];
              const barColor = d.rate >= 80 ? t.success : d.rate > 0 ? t.warning : t.textMuted;
              return (
                <div key={date} style={{
                  flex: 1, textAlign: 'center', padding: `${t.sp2} 0`,
                  background: d.rate >= 80
                    ? t.primaryLight
                    : d.rate > 0
                      ? t.warningLight
                      : t.surfaceAlt,
                  borderRadius: t.rSm,
                  border: `1px solid ${d.rate >= 80 ? t.borderGlow : t.border}`,
                }}>
                  <div style={{ fontSize: '9px', color: t.textMuted }}>周{weekday}</div>
                  <div style={{ fontSize: t.sm, fontWeight: '600', color: barColor }}>
                    {d.rate > 0 ? `${d.rate}%` : '-'}
                  </div>
                </div>
              );
            })}
          </div>

          {weekData.active_goals && weekData.active_goals.length > 0 && (
            <div style={{ fontSize: t.sm, color: t.textMuted }}>
              当前目标：{weekData.active_goals.map(g => g.title).join('、')}
            </div>
          )}
        </div>
      )}

      {/* Generate button */}
      <div className="animate-in animate-in-delay-1" style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
          <BarChart3 size={14} style={{ color: '#ec4899' }} />
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>
            AI 周报告
          </span>
        </div>
        <p style={{ color: t.textSecondary, marginBottom: t.sp4, fontSize: t.sm, lineHeight: 1.6 }}>
          温室会自动读取本周的任务、打卡和目标数据，生成一份深度成长报告
        </p>
        <button onClick={onGenerate} disabled={loading} style={{
          width: '100%', padding: `${t.sp3} ${t.sp5}`,
          borderRadius: t.rMd, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          minHeight: '44px', transition: 'all 0.2s',
          background: loading
            ? t.surfaceAlt
            : 'linear-gradient(135deg, #ec4899, #db2777)',
          color: loading ? t.textMuted : 'white',
          boxShadow: loading ? 'none' : '0 2px 12px rgba(236, 72, 153, 0.25)',
        }}>
          {loading ? '温室正在回顾本周...' : '生成周报告'}
        </button>
      </div>

      {/* Report result */}
      {weeklyReport && (
        <div className="animate-in" style={{ ...card, marginTop: t.sp3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
            <Sparkles size={14} style={{ color: '#ec4899' }} />
            <span style={{ fontSize: t.sm, color: '#ec4899', fontWeight: '600' }}>
              温室的周报
            </span>
          </div>
          <div style={{
            padding: t.sp4,
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.06), rgba(167, 139, 250, 0.04))',
            borderRadius: t.rMd, whiteSpace: 'pre-wrap',
            lineHeight: 1.8, fontSize: t.sm, color: t.textSecondary,
            border: '1px solid rgba(236, 72, 153, 0.1)',
          }}>
            {weeklyReport}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyReportTab;
