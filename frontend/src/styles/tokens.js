// Design tokens - 赛博温室主题
export const t = {
  // Colors - 深夜温室色系
  bg: '#11151A',
  bgAlt: '#18201F',
  surface: 'rgba(28, 34, 36, 0.92)',
  surfaceAlt: 'rgba(255, 255, 255, 0.045)',
  surfaceHover: 'rgba(255, 255, 255, 0.075)',
  border: 'rgba(226, 244, 234, 0.09)',
  borderLight: 'rgba(226, 244, 234, 0.05)',
  borderGlow: 'rgba(78, 238, 148, 0.16)',

  text: '#e8e8f0',
  textSecondary: '#a0a0b8',
  textMuted: '#6b6b80',

  // 主品牌色：清新薄荷绿
  primary: '#4ADE80',
  primaryLight: 'rgba(74, 222, 128, 0.14)',
  primaryDark: '#35B86C',

  // 辅助氛围色
  accentPurple: '#a78bfa',
  accentPurpleLight: 'rgba(167, 139, 250, 0.15)',
  accentGold: '#fbbf24',
  accentGoldLight: 'rgba(251, 191, 36, 0.15)',

  success: '#4ADE80',
  successLight: 'rgba(74, 222, 128, 0.14)',
  warning: '#f59e0b',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  error: '#ef4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',

  // Typography
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  xs: '11px',
  sm: '12px',
  base: '14px',
  md: '15px',
  lg: '16px',
  xl: '18px',
  '2xl': '22px',
  '3xl': '28px',

  // Spacing
  sp1: '4px',
  sp2: '8px',
  sp3: '12px',
  sp4: '16px',
  sp5: '20px',
  sp6: '24px',
  sp8: '32px',

  // Radius
  rSm: '6px',
  rMd: '10px',
  rLg: '14px',
  rXl: '20px',
  rFull: '9999px',
};

// 柔和卡片
export const card = {
  backgroundColor: t.surface,
  borderRadius: t.rLg,
  padding: t.sp5,
  border: `1px solid ${t.border}`,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.16)',
  transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
};

// 发光卡片
export const cardGlow = {
  ...card,
  border: `1px solid ${t.borderGlow}`,
  boxShadow: `0 8px 22px rgba(0, 0, 0, 0.18), 0 0 12px rgba(74, 222, 128, 0.06)`,
};

export const cardCompact = {
  ...card,
  padding: t.sp4,
};

export const input = {
  width: '100%',
  padding: '10px 14px',
  border: `1.5px solid ${t.border}`,
  borderRadius: t.rMd,
  fontSize: t.base,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: t.text,
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export const btn = {
  padding: '10px 20px',
  borderRadius: t.rMd,
  border: 'none',
  fontSize: t.base,
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit',
  minHeight: '44px',
  transition: 'all 0.2s ease',
};

export const btnPrimary = {
  ...btn,
  background: `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`,
  color: '#ffffff',
  boxShadow: '0 3px 10px rgba(74, 222, 128, 0.24)',
};

export const btnGhost = {
  ...btn,
  backgroundColor: 'transparent',
  color: t.textSecondary,
};

export const label = {
  fontSize: t.sm,
  color: t.textSecondary,
  fontWeight: '500',
  marginBottom: '6px',
  display: 'block',
};

export const pageTitle = {
  fontSize: t.xl,
  fontWeight: '700',
  color: t.text,
  margin: 0,
  letterSpacing: '-0.02em',
};

export const sectionTitle = {
  fontSize: t.sm,
  color: t.textMuted,
  fontWeight: '600',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
};

// Helpers
export const focusBorder = (e) => {
  e.target.style.borderColor = t.primary;
  e.target.style.boxShadow = `0 0 0 3px rgba(74, 222, 128, 0.14)`;
};
export const blurBorder = (e) => {
  e.target.style.borderColor = t.border;
  e.target.style.boxShadow = 'none';
};
