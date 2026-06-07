import React, { useEffect, useRef } from 'react';
import { t, card, focusBorder, blurBorder } from '../styles/tokens';

function ChatBox({ message, setMessage, chatHistory, loading, onSend }) {
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 260px)', minHeight: '300px' }}>
      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${t.sp1}`, display: 'flex', flexDirection: 'column', gap: t.sp3 }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: t.textMuted, padding: `${t.sp8} ${t.sp5}`, fontSize: t.base }}>
            <div style={{ fontSize: '40px', marginBottom: t.sp3 }}>🤖</div>
            <div style={{ color: t.textSecondary, fontWeight: '500', marginBottom: t.sp1 }}>有什么想和 AI 聊的？</div>
            <div style={{ fontSize: t.sm, color: t.textMuted }}>试试问一个学习或成长相关的问题</div>
          </div>
        )}

        {chatHistory.map((chat, index) => {
          const isUser = chat.role === 'user';
          const isLast = index === chatHistory.length - 1;
          const isStreaming = loading && isLast && !isUser && !chat.content;

          return (
            <div key={index} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', padding: `0 ${t.sp1}` }}>
              <div style={{ maxWidth: '82%', minWidth: '48px' }}>
                <div style={{
                  fontSize: t.xs, color: t.textMuted, marginBottom: '3px',
                  textAlign: isUser ? 'right' : 'left',
                  paddingLeft: isUser ? 0 : t.sp1,
                  paddingRight: isUser ? t.sp1 : 0,
                }}>
                  {isUser ? '你' : 'AI'}
                </div>
                <div style={{
                  padding: `${t.sp3} ${t.sp4}`,
                  borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  backgroundColor: isUser ? t.primary : t.surface,
                  color: isUser ? 'white' : t.text,
                  fontSize: t.base, lineHeight: 1.6,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  border: isUser ? 'none' : `1px solid ${t.border}`,
                }}>
                  {chat.content || (isStreaming ? '' : '...')}
                  {isStreaming && (
                    <span style={{
                      display: 'inline-block', width: '2px', height: '14px',
                      backgroundColor: t.primary, marginLeft: '2px',
                      verticalAlign: 'middle', animation: 'blink 1s infinite',
                    }} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div style={{
        backgroundColor: t.surface, borderRadius: t.rMd,
        padding: t.sp3, marginTop: t.sp3,
        border: `1px solid ${t.border}`,
        position: 'sticky', bottom: 0,
      }}>
        <div style={{ display: 'flex', gap: t.sp2, alignItems: 'flex-end' }}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题... (Enter 发送)"
            rows={1}
            style={{
              flex: 1, padding: `${t.sp3} ${t.sp3}`,
              border: `1.5px solid ${t.border}`, borderRadius: t.rMd,
              fontSize: t.base, resize: 'none', outline: 'none',
              fontFamily: 'inherit', maxHeight: '100px',
              backgroundColor: t.bg, color: t.text,
              transition: 'border-color 0.15s',
            }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
          <button
            onClick={onSend}
            disabled={loading || !message.trim()}
            style={{
              backgroundColor: (loading || !message.trim()) ? t.border : t.primary,
              color: (loading || !message.trim()) ? t.textMuted : 'white',
              border: 'none', padding: `${t.sp3} ${t.sp4}`,
              borderRadius: t.rMd, cursor: (loading || !message.trim()) ? 'not-allowed' : 'pointer',
              fontSize: t.sm, fontWeight: '600', whiteSpace: 'nowrap',
              height: '40px', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {loading ? '...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
