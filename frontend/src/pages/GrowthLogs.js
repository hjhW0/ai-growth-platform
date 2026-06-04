import React, { useState, useEffect } from 'react';
import { getGrowthLogs } from '../api/apiClient';

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
    return <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>加载中...</div>;
  }

  return (
    <div style={{ paddingBottom: '80px' }}>
      <h2 style={{ color: '#333', marginBottom: '24px' }}>📚 成长日志</h2>

      {logs.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: '#888',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          暂无成长记录，去 AI 中心生成复盘后自动记录
        </div>
      ) : (
        logs.map((log, index) => (
          <div key={log.id || index} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>{log.log_date}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {log.mood && (
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: log.mood === 'good' ? '#dcfce7' : log.mood === 'bad' ? '#fef2f2' : '#f5f5f5',
                    color: log.mood === 'good' ? '#22c55e' : log.mood === 'bad' ? '#ef4444' : '#888'
                  }}>
                    {log.mood === 'good' ? '😊 不错' : log.mood === 'bad' ? '😔 一般' : '😐 还行'}
                  </span>
                )}
              </div>
            </div>

            {log.ai_summary && (
              <div style={{
                padding: '14px',
                backgroundColor: '#f0f0ff',
                borderRadius: '8px',
                marginBottom: '10px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                fontSize: '14px',
                color: '#444'
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
                    fontSize: '12px',
                    backgroundColor: '#eef2ff',
                    color: '#6366f1'
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
