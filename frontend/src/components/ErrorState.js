import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import { t, card } from '../styles/tokens';

function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      ...card, textAlign: 'center', padding: `${t.sp8} ${t.sp5}`,
      backgroundColor: t.errorLight, border: '1px solid rgba(220,38,38,0.16)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: t.rFull,
        margin: `0 auto ${t.sp3}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239,68,68,0.18)',
        color: t.error,
      }}>
        <WifiOff size={22} />
      </div>
      <div style={{ color: t.error, fontSize: t.md, fontWeight: '500', marginBottom: t.sp2 }}>{message}</div>
      <div style={{ color: t.textMuted, fontSize: t.sm, marginBottom: t.sp4 }}>点击下方按钮重新连接</div>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: `${t.sp3} ${t.sp5}`, borderRadius: t.rMd, border: 'none',
          background: '#ffffff',
          color: t.primary, cursor: 'pointer',
          fontSize: t.sm, fontWeight: '600', fontFamily: 'inherit',
          border: `1px solid ${t.border}`,
          transition: 'all 0.2s',
        }}><RefreshCw size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />重新连接</button>
      )}
    </div>
  );
}

export default ErrorState;
