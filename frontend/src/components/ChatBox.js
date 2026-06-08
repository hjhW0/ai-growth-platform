import React, { useEffect, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { t, card, focusBorder, blurBorder } from '../styles/tokens';

function ChatBox({ message, setMessage, chatHistory, loading, onSend }) {
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  // 移动端键盘弹出时滚动到输入框
  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 300);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div ref={containerRef} className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 320px)', minHeight: '300px' }}>
      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${t.sp1}`, display: 'flex', flexDirection: 'column', gap: t.sp3 }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', padding: `${t.sp8} ${t.sp5}` }}>
            <div className="ai-orb" style={{ width: 56, height: 56, margin: `0 auto ${t.sp4}` }}>
              <Sparkles size={22} style={{ color: t.primary }} />
            </div>
            <div style={{ color: t.textSecondary, fontWeight: '500', marginBottom: t.sp1, fontSize: t.base }}>
              和温室聊聊吧
            </div>
            <div style={{ fontSize: t.sm, color: t.textMuted, lineHeight: 1.6 }}>
              可以问我学习规划、习惯养成、<br />或者任何你正在思考的事情
            </div>
          </div>
        )}

        {chatHistory.map((chat, index) => {
          const isUser = chat.role === 'user';
          const isLast = index === chatHistory.length - 1;
          const isStreaming = loading && isLast && !isUser && !chat.content;

          return (
            <div key={index} style={{
              display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
              padding: `0 ${t.sp1}`,
              animation: isLast ? 'fadeIn 0.3s ease-out' : 'none',
            }}>
              <div style={{ maxWidth: '82%', minWidth: '48px' }}>
                {!isUser && (
                  <div style={{
                    fontSize: t.xs, color: t.textMuted, marginBottom: '4px',
                    paddingLeft: t.sp1, display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: t.primaryLight,
                      border: `1px solid ${t.borderGlow}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Sparkles size={8} style={{ color: t.primary }} />
                    </div>
                    温室
                  </div>
                )}
                <div style={{
                  padding: `${t.sp3} ${t.sp4}`,
                  borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: isUser
                    ? `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`
                    : '#ffffff',
                  color: isUser ? '#ffffff' : t.text,
                  fontSize: t.base, lineHeight: 1.7,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  border: isUser ? 'none' : `1px solid ${t.border}`,
                  boxShadow: isUser
                    ? '0 8px 18px rgba(34, 197, 94, 0.18)'
                    : '0 8px 18px rgba(31, 85, 52, 0.06)',
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
      <div className="chat-input-bar" style={{
        backgroundColor: '#ffffff',
        borderRadius: t.rMd,
        padding: t.sp3, marginTop: t.sp3,
        border: `1px solid ${t.border}`,
        boxShadow: '0 12px 24px rgba(31, 85, 52, 0.08)',
        position: 'sticky', bottom: 0,
      }}>
        <div style={{ display: 'flex', gap: t.sp2, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="说点什么吧..."
            rows={1}
            style={{
              flex: 1, padding: `${t.sp3} ${t.sp3}`,
              border: `1.5px solid ${t.border}`, borderRadius: t.rMd,
              fontSize: t.base, resize: 'none', outline: 'none',
              fontFamily: 'inherit', maxHeight: '100px',
              backgroundColor: t.surfaceAlt, color: t.text,
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => { focusBorder(e); handleInputFocus(); }}
            onBlur={blurBorder}
          />
          <button
            onClick={onSend}
            disabled={loading || !message.trim()}
            style={{
              background: (loading || !message.trim())
                ? t.surfaceAlt
                : `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`,
              color: (loading || !message.trim()) ? t.textMuted : '#ffffff',
              border: 'none', padding: `${t.sp3} ${t.sp4}`,
              borderRadius: t.rMd, cursor: (loading || !message.trim()) ? 'not-allowed' : 'pointer',
              fontSize: t.sm, fontWeight: '600', whiteSpace: 'nowrap',
              height: '40px', fontFamily: 'inherit',
              transition: 'all 0.2s',
              boxShadow: (loading || !message.trim()) ? 'none' : '0 8px 18px rgba(34, 197, 94, 0.18)',
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
