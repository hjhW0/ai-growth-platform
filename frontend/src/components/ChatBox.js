import React, { useEffect, useRef } from 'react';

function ChatBox({ message, setMessage, chatHistory, loading, onSend }) {
  const chatEndRef = useRef(null);

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // 旧消息在上，新消息在下（数据已经是正序）
  const sortedHistory = chatHistory;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      {/* 对话历史 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {sortedHistory.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#ccc',
            padding: '60px 20px',
            fontSize: '14px'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤖</div>
            有什么想和 AI 聊的？试试问一个问题
          </div>
        )}

        {sortedHistory.map((chat, index) => {
          const isUser = chat.role === 'user';
          const isLast = index === sortedHistory.length - 1;
          const isStreaming = loading && isLast && !isUser && !chat.content;

          return (
            <div key={index} style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              padding: '0 8px'
            }}>
              <div style={{
                maxWidth: '80%',
                minWidth: '60px'
              }}>
                {/* 角色标签 */}
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '4px',
                  textAlign: isUser ? 'right' : 'left',
                  paddingLeft: isUser ? 0 : '4px',
                  paddingRight: isUser ? '4px' : 0
                }}>
                  {isUser ? '你' : 'AI'}
                </div>

                {/* 消息气泡 */}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: isUser ? '#6366f1' : '#f0f0f0',
                  color: isUser ? 'white' : '#333',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {chat.content || (isStreaming ? '' : '...')}
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
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* 输入框 - 固定在底部 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '12px',
        marginTop: '12px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
        position: 'sticky',
        bottom: 0
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题... (Enter 发送)"
            rows={1}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '15px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              maxHeight: '120px'
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
          />
          <button
            onClick={onSend}
            disabled={loading || !message.trim()}
            style={{
              backgroundColor: (loading || !message.trim()) ? '#e0e0e0' : '#6366f1',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: (loading || !message.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              height: '44px'
            }}
          >
            {loading ? '...' : '发送'}
          </button>
        </div>
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
