import React from 'react';

const CARD = { backgroundColor: '#111111', borderRadius: '12px', padding: '20px', marginBottom: '12px', border: '1px solid #27272a' };

function PlanTab({ goal, setGoal, plan, loading, onGenerate }) {
  return (
    <div>
      <div style={CARD}>
        <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '14px', fontWeight: '500' }}>🎯 AI 规划师</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input type="text" value={goal} onChange={e => setGoal(e.target.value)} placeholder="输入你的目标，例如：三个月学完408"
            style={{ flex: 1, minWidth: '140px', padding: '10px 12px', border: '1px solid #27272a', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#0a0a0a', color: '#fafafa', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#27272a'} />
          <button onClick={onGenerate} disabled={loading}
            style={{ backgroundColor: loading ? '#1a1a1a' : '#22c55e', color: loading ? '#52525b' : 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600', minHeight: '44px', transition: 'all 0.2s' }}>
            {loading ? '生成中...' : '生成计划'}
          </button>
        </div>
      </div>
      {plan && (
        <div style={CARD}>
          <div style={{ fontSize: '13px', color: '#22c55e', marginBottom: '14px', fontWeight: '600' }}>AI 为你制定的计划</div>
          <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '13px', color: '#a1a1aa', border: '1px solid #27272a' }}>{plan}</div>
        </div>
      )}
    </div>
  );
}

export default PlanTab;
