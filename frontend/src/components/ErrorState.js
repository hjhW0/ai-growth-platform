import React from 'react';
import { t, card } from '../styles/tokens';

function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}`,
      backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239,68,68,0.12)',
    }}>
      <div style={{ fontSize: 40, marginBottom: t.sp3 }}>🥀</div>
      <div style={{ color: t.error, fontSize: t.md, fontWeight: '500', marginBottom: t.sp2 }}>{message}</div>
      <div style={{ color: t.textMuted, fontSize: t.sm, marginBottom: t.sp4 }}>点击下方按钮重新连接</div>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, border: 'none',
          background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.2), rgba(167, 139, 250, 0.2))',
          color: t.primary, cursor: 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          border: '1px solid rgba(78, 238, 148, 0.2)',
          transition: 'all 0.2s',
        }}>重新连接</button>
      )}
    </div>
  );
}

export default ErrorState;
