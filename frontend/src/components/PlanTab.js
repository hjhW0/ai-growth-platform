import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { t, card, input, focusBorder, blurBorder } from '../styles/tokens';

function PlanTab({ goal, setGoal, plan, loading, onGenerate }) {
  return (
    <div>
      <div className="animate-in" style={{
        ...card,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp4 }}>
          <Compass size={14} style={{ color: t.primary }} />
          <span style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', letterSpacing: '0.02em' }}>
            AI 规划师
          </span>
        </div>
        <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap' }}>
          <input
            type="text" value={goal} onChange={e => setGoal(e.target.value)}
            placeholder="说说你的目标，比如：三个月学完408"
            style={{ ...input, flex: 1, minWidth: '140px' }}
            onFocus={focusBorder} onBlur={blurBorder}
          />
          <button onClick={onGenerate} disabled={loading} style={{
            padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
            minHeight: '44px', transition: 'all 0.2s',
            background: loading
              ? t.surfaceAlt
              : `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`,
            color: loading ? t.textMuted : '#ffffff',
            boxShadow: loading ? 'none' : '0 8px 18px rgba(34, 197, 94, 0.18)',
          }}>
            {loading ? '温室正在规划...' : '生成计划'}
          </button>
        </div>
      </div>

      {plan && (
        <div className="animate-in" style={{ ...card, marginTop: t.sp3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: t.sp2, marginBottom: t.sp3 }}>
            <Sparkles size={14} style={{ color: t.success }} />
            <span style={{ fontSize: t.sm, color: t.success, fontWeight: '600' }}>
              温室为你制定的路线图
            </span>
          </div>
          <div style={{
            padding: t.sp4,
            background: t.surfaceAlt,
            borderRadius: t.rMd, whiteSpace: 'pre-wrap',
            lineHeight: 1.8, fontSize: t.sm, color: t.textSecondary,
            border: `1px solid ${t.borderLight}`,
          }}>
            {plan}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanTab;
