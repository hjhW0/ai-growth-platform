import React from 'react';
import { t, card } from '../styles/tokens';

// 单个骨架条
export function SkeletonLine({ height = 14, width = '100%', style = {} }) {
  return (
    <div style={{
      height, width, borderRadius: t.rSm,
      background: 'linear-gradient(90deg, #e6f4eb 25%, #f5fbf7 50%, #e6f4eb 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

// 卡片骨架
export function SkeletonCard({ lines = 2, height = 80 }) {
  return (
    <div style={{ ...card, marginBottom: t.sp3, height }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          height={12}
          width={i === 0 ? '50%' : '70%'}
          style={{ marginBottom: i < lines - 1 ? t.sp3 : 0 }}
        />
      ))}
    </div>
  );
}

// 列表骨架
export function SkeletonList({ count = 3 }) {
  return (
    <div style={card}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: t.sp3,
          padding: `${t.sp3} 0`,
          borderBottom: i < count - 1 ? `1px solid ${t.borderLight}` : 'none',
        }}>
          <SkeletonLine height={20} width={20} style={{ borderRadius: '50%', flexShrink: 0 }} />
          <SkeletonLine height={14} width={`${60 + Math.random() * 30}%`} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;
