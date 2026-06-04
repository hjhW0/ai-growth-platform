import React from 'react';

function PlanTab({ goal, setGoal, plan, loading, onGenerate }) {
  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '16px' }}>🎯 AI 规划师</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="输入你的目标，例如：三个月学完408"
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          />
          <button
            onClick={onGenerate}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '生成中...' : '生成计划'}
          </button>
        </div>
      </div>

      {plan && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#10b981' }}>AI 为你制定的计划</h3>
          <div style={{
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}>
            {plan}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanTab;
