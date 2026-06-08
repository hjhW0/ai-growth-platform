import React from 'react';
import { t } from '../styles/tokens';

// 空状态插画 — 花盆 + 嫩芽 + 萤火虫
function EmptyPot({ text, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: `${t.sp6} 0` }}>
      <div style={{ position: 'relative', width: 80, height: 80, margin: `0 auto ${t.sp4}` }}>
        {/* 花盆 */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 44, height: 32,
          background: 'linear-gradient(135deg, rgba(78, 238, 148, 0.15), rgba(167, 139, 250, 0.15))',
          borderRadius: '0 0 14px 14px',
          border: '1px solid rgba(78, 238, 148, 0.2)',
          borderTop: 'none',
        }} />
        {/* 茎 */}
        <div style={{
          position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          width: 3, height: 20,
          background: 'linear-gradient(to top, rgba(78, 238, 148, 0.5), rgba(78, 238, 148, 0.2))',
          borderRadius: 2,
          animation: 'breathe 3s ease-in-out infinite',
        }} />
        {/* 叶子左 */}
        <div style={{
          position: 'absolute', bottom: 40, left: 'calc(50% - 15px)',
          width: 13, height: 8,
          background: 'rgba(78, 238, 148, 0.35)',
          borderRadius: '50% 0 50% 0',
          transform: 'rotate(-35deg)',
        }} />
        {/* 叶子右 */}
        <div style={{
          position: 'absolute', bottom: 44, left: 'calc(50% + 3px)',
          width: 11, height: 7,
          background: 'rgba(78, 238, 148, 0.3)',
          borderRadius: '0 50% 0 50%',
          transform: 'rotate(30deg)',
        }} />
        {/* 萤火虫 */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: 5 + i * 11,
            left: 15 + i * 20,
            width: 4, height: 4,
            borderRadius: '50%',
            background: 'rgba(78, 238, 148, 0.5)',
            boxShadow: '0 0 6px rgba(78, 238, 148, 0.4)',
            animation: `breathe ${2 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
          }} />
        ))}
      </div>
      <div style={{ color: t.textSecondary, fontSize: t.base, marginBottom: t.sp1 }}>{text}</div>
      {sub && <div style={{ color: t.textMuted, fontSize: t.sm }}>{sub}</div>}
    </div>
  );
}

export default EmptyPot;
