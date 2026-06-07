---
name: AI 成长平台
description: 温暖轻快的学生个人成长与学习规划工具
register: product
colors:
  background: "#f8f9fb"
  surface: "#ffffff"
  surfaceAlt: "#f1f3f5"
  border: "#e5e7eb"
  borderLight: "#f0f0f0"
  text: "#1a1a2e"
  textSecondary: "#6b7280"
  textMuted: "#9ca3af"
  primary: "#5b5fef"
  primaryLight: "#eef0ff"
  primaryDark: "#4338ca"
  success: "#10b981"
  successLight: "#ecfdf5"
  warning: "#f59e0b"
  warningLight: "#fffbeb"
  error: "#ef4444"
  errorLight: "#fef2f2"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.02em"
    textTransform: "uppercase"
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  full: "9999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "20px"
  s6: "24px"
  s8: "32px"
---

# Design System: AI 成长平台

## 1. Overview

**Creative North Star: "温暖的成长伙伴"**

A light, warm, encouraging environment where students track their progress. The interface feels like a personal journal: clean, friendly, rewarding. Light backgrounds keep the mood positive. Accent colors mark achievements and important actions. Emoji serve as personality markers throughout the interface.

The system rejects dark developer-tool aesthetics, rejects corporate dashboard templates, and rejects childish gamification. It embraces a clean, modern, warm visual language: white surfaces, soft shadows, blue-purple accent, generous spacing.

**Key Characteristics:**
- Light backgrounds (#f8f9fb) with white surfaces (#ffffff)
- Blue-purple primary accent (#5b5fef) for actions and highlights
- Semantic colors for state: green (success), amber (warning), red (error)
- Emoji as first-class design elements
- System font stack for native feel on all devices
- Glassmorphic navigation bars (backdrop-filter blur)

## 2. Colors

### Backgrounds
- **Page** (#f8f9fb): Page background. Slightly warm gray.
- **Surface** (#ffffff): Cards, panels, inputs. Pure white.
- **Surface Alt** (#f1f3f5): Skeleton loading, disabled states.

### Text
- **Primary** (#1a1a2e): Headings, important values. Near-black with blue undertone.
- **Secondary** (#6b7280): Body text, descriptions.
- **Muted** (#9ca3af): Labels, timestamps, tertiary info.

### Accent
- **Primary** (#5b5fef): Primary actions, active states, links.
- **Primary Light** (#eef0ff): Background tint for active/hover states.
- **Primary Dark** (#4338ca): Hover state for primary buttons.

### Semantic
- **Success** (#10b981): Completed states, positive feedback, streaks.
- **Warning** (#f59e0b): Medium priority, caution.
- **Error** (#ef4444): High priority, destructive actions, errors.

### Borders
- **Default** (#e5e7eb): Card borders, dividers.
- **Light** (#f0f0f0): Subtle separators within cards.

## 3. Typography

**Font:** -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif

**Hierarchy:**
- **Title** (700, 18px, -0.02em tracking): Page titles.
- **Body** (400, 14px): Default content text.
- **Label** (600, 12px, 0.02em tracking, uppercase): Section headers, card labels.
- **Display** (700, 22-28px): Stat numbers, key metrics.

## 4. Elevation

The system uses white surfaces with subtle borders and minimal shadows for depth.

### Surface Levels
- **Base** (#f8f9fb): Page background.
- **Level 1** (#ffffff + border): Cards, panels.
- **Level 2** (#ffffff + shadow): Modals, popovers, floating elements.

### Named Rules

**The Border-First Rule.** Cards use 1px #e5e7eb borders as primary depth indicator. Shadows only on floating elements (modals, FABs, toasts).

**The Glass Rule.** Navigation bars use `backdrop-filter: blur(12px)` with 92% white opacity for a frosted glass effect.

## 5. Components

### Buttons
- **Shape:** 10px radius, 10px 20px padding, 44px min-height
- **Primary:** Primary background (#5b5fef), white text.
- **Ghost:** Transparent, secondary text. Hover: surfaceAlt background.

### Cards
- **Background:** #ffffff
- **Border:** 1px solid #e5e7eb
- **Radius:** 14px
- **Padding:** 20px

### Inputs
- **Background:** #ffffff
- **Border:** 1.5px solid #e5e7eb
- **Focus:** Border color #5b5fef
- **Radius:** 10px

### Navigation
- **Top bar:** Sticky, glass effect, brand name + avatar
- **Bottom nav:** Fixed, glass effect, emoji icons + labels
- **Active state:** Primary text + primaryLight background

## 6. Do's and Don'ts

### Do:
- **Do** use white surfaces on light gray background for depth
- **Do** use emoji for personality (navigation, empty states, greetings)
- **Do** use semantic colors consistently (green=success, amber=warning, red=error)
- **Do** provide loading, error, and empty states for every data view
- **Do** use `animate-in` class for staggered card entrance animations

### Don't:
- **Don't** use dark backgrounds. The entire page is light.
- **Don't** use heavy shadows. Use borders for depth.
- **Don't** use accent colors on large surfaces. Accent is for small elements.
- **Don't** skip error states. Every API call needs error handling.
- **Don't** use gradient backgrounds on cards. Keep them flat.
