import React, { useEffect, useRef } from 'react';

function ChatBox({ message, setMessage, chatHistory, loading, onSend }) {
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 240px)', minHeight: '300px' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: '#52525b', padding: '60px 20px', fontSize: '14px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤖</div>
            <div style={{ color: '#71717a', marginBottom: '4px' }}>有什么想和 AI 聊的？</div>
            <div style={{ fontSize: '13px', color: '#52525b' }}>试试问一个问题</div>
          </div>
        )}

        {chatHistory.map((chat, index) => {
          const isUser = chat.role === 'user';
          const isLast = index === chatHistory.length - 1;
          const isStreaming = loading && isLast && !isUser && !chat.content;

          return (
            <div key={index} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
              <div style={{ maxWidth: '80%', minWidth: '48px' }}>
                <div style={{ fontSize: '11px', color: '#52525b', marginBottom: '4px', textAlign: isUser ? 'right' : 'left', paddingLeft: isUser ? 0 : '4px', paddingRight: isUser ? '4px' : 0 }}>
                  {isUser ? '你' : 'AI'}
                </div>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  backgroundColor: isUser ? '#6366f1' : '#111111',
                  color: isUser ? 'white' : '#fafafa',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  border: isUser ? 'none' : '1px solid #27272a'
                }}>
                  {chat.content || (isStreaming ? '' : '...')}
                  {isStreaming && <span style={{ display: 'inline-block', width: '2px', height: '14px', backgroundColor: '#6366f1', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 1s infinite' }} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div style={{ backgroundColor: '#111111', borderRadius: '12px', padding: '10px', marginTop: '10px', border: '1px solid #27272a', position: 'sticky', bottom: 0 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题... (Enter 发送)"
            rows={1}
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #27272a', borderRadius: '8px', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'inherit', maxHeight: '100px', backgroundColor: '#0a0a0a', color: '#fafafa', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#27272a'}
          />
          <button
            onClick={onSend}
            disabled={loading || !message.trim()}
            style={{ backgroundColor: (loading || !message.trim()) ? '#1a1a1a' : '#6366f1', color: (loading || !message.trim()) ? '#52525b' : 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: (loading || !message.trim()) ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', height: '40px', transition: 'all 0.2s' }}
          >
            {loading ? '...' : '发送'}
          </button>
        </div>
      </div>

      <style>{`@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`}</style>
    </div>
  );
}

export default ChatBox;
