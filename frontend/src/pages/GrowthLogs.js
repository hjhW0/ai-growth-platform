import React, { useState, useEffect } from 'react';
import { getGrowthLogs } from '../api/apiClient';

const CARD = {
  backgroundColor: '#111111',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  border: '1px solid #27272a'
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
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fafafa', marginBottom: '16px' }}>📚 成长日志</h2>
        {[1,2,3].map(i => <div key={i} style={CARD}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><div style={{ height: 14, width: 80, backgroundColor: '#1a1a1a', borderRadius: 4 }} /><div style={{ height: 14, width: 50, backgroundColor: '#1a1a1a', borderRadius: 4 }} /></div><div style={{ height: 50, backgroundColor: '#1a1a1a', borderRadius: 6 }} /></div>)}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fafafa', marginBottom: '16px' }}>📚 成长日志</h2>
      {logs.length === 0 ? (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
          <div style={{ color: '#71717a', fontSize: '14px', marginBottom: '4px' }}>暂无成长记录</div>
          <div style={{ color: '#52525b', fontSize: '13px' }}>去 AI 中心生成复盘后自动记录</div>
        </div>
      ) : (
        logs.map((log, index) => (
          <div key={log.id || index} style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#fafafa', fontSize: '13px' }}>{log.log_date}</span>
              {log.mood && (
                <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '11px', backgroundColor: log.mood === 'good' ? 'rgba(34,197,94,0.1)' : log.mood === 'bad' ? 'rgba(239,68,68,0.1)' : '#1a1a1a', color: log.mood === 'good' ? '#22c55e' : log.mood === 'bad' ? '#ef4444' : '#71717a' }}>
                  {log.mood === 'good' ? '😊 不错' : log.mood === 'bad' ? '😔 一般' : '😐 还行'}
                </span>
              )}
            </div>
            {log.ai_summary && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(99,102,241,0.05)', borderRadius: '8px', marginBottom: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '13px', color: '#a1a1aa', border: '1px solid rgba(99,102,241,0.1)' }}>
                {log.ai_summary}
              </div>
            )}
            {log.tags && log.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                {log.tags.map((tag, i) => <span key={i} style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '11px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: '500' }}>{tag}</span>)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default GrowthLogs;
