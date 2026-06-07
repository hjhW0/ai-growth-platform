import React from 'react';
import { t, card, input, focusBorder, blurBorder } from '../styles/tokens';

function PlanTab({ goal, setGoal, plan, loading, onGenerate }) {
  return (
    <div>
      <div className="animate-in" style={card}>
        <div style={{ fontSize: t.sm, color: t.textMuted, fontWeight: '600', marginBottom: t.sp4, letterSpacing: '0.02em' }}>
          AI 规划师
        </div>
        <div style={{ display: 'flex', gap: t.sp2, flexWrap: 'wrap' }}>
          <input
            type="text" value={goal} onChange={e => setGoal(e.target.value)}
            placeholder="输入你的目标，例如：三个月学完408"
            style={{ ...input, flex: 1, minWidth: '140px' }}
            onFocus={focusBorder} onBlur={blurBorder}
          />
          <button onClick={onGenerate} disabled={loading} style={{
            padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
            minHeight: '44px', transition: 'all 0.15s',
            backgroundColor: loading ? t.border : t.success,
            color: loading ? t.textMuted : 'white',
          }}>
            {loading ? '生成中...' : '生成计划'}
          </button>
        </div>
      </div>

      {plan && (
        <div className="animate-in" style={{ ...card, marginTop: t.sp3 }}>
          <div style={{ fontSize: t.sm, color: t.success, fontWeight: '600', marginBottom: t.sp3 }}>
            AI 为你制定的计划
          </div>
          <div style={{
            padding: t.sp4, backgroundColor: t.successLight,
            borderRadius: t.rMd, whiteSpace: 'pre-wrap',
            lineHeight: 1.7, fontSize: t.sm, color: t.textSecondary,
            border: `1px solid rgba(16,185,129,0.12)`,
          }}>
            {plan}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanTab;
