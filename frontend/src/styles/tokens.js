// Design tokens - 清新绿色成长主题
export const t = {
  // Colors - 白天温室色系
  bg: '#F4FBF6',
  bgAlt: '#EAF7EF',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF8F1',
  surfaceHover: '#E3F3E8',
  border: '#D7E8DC',
  borderLight: '#E9F2EC',
  borderGlow: 'rgba(34, 197, 94, 0.22)',

  text: '#163124',
  textSecondary: '#4E6658',
  textMuted: '#7F9588',

  // 主品牌色：清新叶绿
  primary: '#22C55E',
  primaryLight: '#DDFBE7',
  primaryDark: '#15803D',

  // 辅助氛围色
  accentPurple: '#7C6CE8',
  accentPurpleLight: '#EEECFF',
  accentGold: '#F59E0B',
  accentGoldLight: '#FFF4D8',
  accentSky: '#0EA5E9',
  accentSkyLight: '#E0F2FE',

  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#f59e0b',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',

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
  boxShadow: '0 10px 24px rgba(31, 85, 52, 0.08)',
  transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
};

// 重点卡片
export const cardGlow = {
  ...card,
  border: `1px solid ${t.borderGlow}`,
  background: 'linear-gradient(135deg, #ffffff 0%, #f0fff5 100%)',
  boxShadow: '0 14px 28px rgba(34, 197, 94, 0.13)',
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
  backgroundColor: '#ffffff',
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
  boxShadow: '0 8px 18px rgba(34, 197, 94, 0.22)',
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
  e.target.style.boxShadow = `0 0 0 3px rgba(34, 197, 94, 0.14)`;
};
export const blurBorder = (e) => {
  e.target.style.borderColor = t.border;
  e.target.style.boxShadow = 'none';
};
