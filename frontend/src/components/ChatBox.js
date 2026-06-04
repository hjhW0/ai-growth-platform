import React from 'react';

function ChatBox({ message, setMessage, chatHistory, loading, onSend }) {
  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
            placeholder="输入你的问题..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={onSend}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#6366f1',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '思考中...' : '发送'}
          </button>
        </div>
      </div>

      {/* 对话历史 */}
      <div>
        {chatHistory.map((chat, index) => {
          const isStreaming = loading && index === 0 && chat.role === 'assistant';
          return (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: chat.role === 'user' ? '#6366f1' : '#10b981' }}>
                  {chat.role === 'user' ? '你：' : 'AI：'}
                </strong>
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap',
                minHeight: isStreaming ? '24px' : 'auto'
              }}>
                {chat.content}
                {isStreaming && <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '16px',
                  backgroundColor: '#6366f1',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'blink 1s infinite'
                }} />}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default ChatBox;
