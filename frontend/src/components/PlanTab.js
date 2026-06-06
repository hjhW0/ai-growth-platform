import React from 'react';

const CARD = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

function PlanTab({ goal, setGoal, plan, loading, onGenerate }) {
  return (
    <div>
      <div style={CARD}>
        <div style={{ fontSize: '14px', color: '#999', marginBottom: '14px', fontWeight: '500' }}>🎯 AI 规划师</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="输入你的目标，例如：三个月学完408"
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#ddd'}
          />
          <button
            onClick={onGenerate}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#e0e0e0' : '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              minHeight: '44px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? '生成中...' : '生成计划'}
          </button>
        </div>
      </div>

      {plan && (
        <div style={CARD}>
          <div style={{ fontSize: '14px', color: '#10b981', marginBottom: '14px', fontWeight: '600' }}>AI 为你制定的计划</div>
          <div style={{
            padding: '14px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.7',
            fontSize: '14px',
            color: '#444'
          }}>
            {plan}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanTab;
