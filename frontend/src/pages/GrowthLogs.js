import React, { useState, useEffect } from 'react';
import { getGrowthLogs } from '../api/apiClient';

const CARD = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

function GrowthLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await getGrowthLogs({ limit: 50 });
      setLogs(res.data || []);
    } catch (error) {
      console.error('加载成长日志失败:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>📚 成长日志</h2>
        {[1, 2, 3].map(i => (
          <div key={i} style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ height: 14, width: 80, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
              <div style={{ height: 14, width: 50, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
            </div>
            <div style={{ height: 60, backgroundColor: '#f0f0f0', borderRadius: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>📚 成长日志</h2>

      {logs.length === 0 ? (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📝</div>
          <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>暂无成长记录</div>
          <div style={{ color: '#ccc', fontSize: '13px' }}>去 AI 中心生成复盘后自动记录</div>
        </div>
      ) : (
        logs.map((log, index) => (
          <div key={log.id || index} style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>{log.log_date}</span>
              {log.mood && (
                <span style={{
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: log.mood === 'good' ? '#dcfce7' : log.mood === 'bad' ? '#fef2f2' : '#f5f5f5',
                  color: log.mood === 'good' ? '#10b981' : log.mood === 'bad' ? '#ef4444' : '#999'
                }}>
                  {log.mood === 'good' ? '😊 不错' : log.mood === 'bad' ? '😔 一般' : '😐 还行'}
                </span>
              )}
            </div>

            {log.ai_summary && (
              <div style={{
                padding: '12px',
                backgroundColor: '#f5f5ff',
                borderRadius: '8px',
                marginBottom: '8px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.7',
                fontSize: '13px',
                color: '#555'
              }}>
                {log.ai_summary}
              </div>
            )}

            {log.tags && log.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                {log.tags.map((tag, i) => (
                  <span key={i} style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    backgroundColor: '#eef2ff',
                    color: '#6366f1',
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default GrowthLogs;
