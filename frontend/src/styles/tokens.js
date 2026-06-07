// Design tokens - single source of truth
export const t = {
  // Colors
  bg: '#f8f9fb',
  surface: '#ffffff',
  surfaceAlt: '#f1f3f5',
  border: '#e5e7eb',
  borderLight: '#f0f0f0',

  text: '#1a1a2e',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',

  primary: '#5b5fef',
  primaryLight: '#eef0ff',
  primaryDark: '#4338ca',

  success: '#10b981',
  successLight: '#ecfdf5',
  warning: '#f59e0b',
  warningLight: '#fffbeb',
  error: '#ef4444',
  errorLight: '#fef2f2',

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

// Shared component styles
export const card = {
  backgroundColor: t.surface,
  borderRadius: t.rLg,
  padding: t.sp5,
  border: `1px solid ${t.border}`,
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
  backgroundColor: t.surface,
  color: t.text,
  transition: 'border-color 0.15s',
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
  transition: 'all 0.15s',
};

export const btnPrimary = {
  ...btn,
  backgroundColor: t.primary,
  color: 'white',
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
export const focusBorder = (e) => { e.target.style.borderColor = t.primary; };
export const blurBorder = (e) => { e.target.style.borderColor = t.border; };
