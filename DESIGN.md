---
name: AI 成长平台
description: 暗色科技风的学生个人成长与学习规划工具
colors:
  background: "#0a0a0a"
  surface: "#111111"
  surface-elevated: "#1a1a1a"
  border: "#27272a"
  text-primary: "#fafafa"
  text-secondary: "#a1a1aa"
  text-muted: "#71717a"
  primary: "#6366f1"
  primary-glow: "rgba(99, 102, 241, 0.15)"
  success: "#22c55e"
  success-glow: "rgba(34, 197, 94, 0.15)"
  warning: "#f59e0b"
  warning-glow: "rgba(245, 158, 11, 0.15)"
  error: "#ef4444"
  error-glow: "rgba(239, 68, 68, 0.15)"
typography:
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
---

# Design System: AI 成长平台 (Dark Tech)

## 1. Overview

**Creative North Star: "The Growth Terminal"**

A dark, focused environment where students track their progress. The interface feels like a premium developer tool: clean, fast, information-dense. Dark backgrounds reduce eye strain during late-night study sessions. Subtle glow accents on key actions create a sense of importance without being distracting.

The system rejects corporate dashboards, rejects playful/kiddy aesthetics, and rejects generic SaaS templates. It embraces the Linear/Vercel design language: dark surfaces, precise typography, minimal decoration, purposeful motion.

**Key Characteristics:**
- Near-black backgrounds (#0a0a0a) with slightly elevated surfaces (#111111)
- Indigo accent with subtle glow on interactive elements
- Minimal borders, elevation through background contrast
- Emoji retained as personality markers (not replaced with icons)
- System font stack for fast rendering

## 2. Colors

### Backgrounds
- **Deep Black** (#0a0a0a): Page background. Everything floats on this.
- **Surface** (#111111): Card backgrounds, input fields.
- **Surface Elevated** (#1a1a1a): Hover states, active nav items.

### Text
- **Primary** (#fafafa): Headings, important values. High contrast on dark.
- **Secondary** (#a1a1aa): Body text, descriptions. Comfortable reading.
- **Muted** (#71717a): Labels, timestamps, tertiary info.

### Accent
- **Indigo** (#6366f1): Primary actions, active states, links.
- **Indigo Glow** (rgba(99,102,241,0.15)): Subtle background tint on active/hover elements.

### Semantic
- **Success** (#22c55e): Completed states, positive feedback.
- **Warning** (#f59e0b): Medium priority, streaks.
- **Error** (#ef4444): High priority, destructive actions, errors.

### Borders
- **Default** (#27272a): Card borders, dividers. Very subtle on dark.

### Named Rules

**The Contrast Rule.** All text must hit WCAG AA on #0a0a0a background. #fafafa for headings (15.4:1), #a1a1aa for body (7.4:1), #71717a for labels (4.6:1). Never use colors below 4.5:1 ratio.

**The Glow Restraint Rule.** Glows appear only on interactive elements (buttons, active states) as background tints, not as box-shadows or text effects. One glow color per element.

## 3. Typography

**Font:** system-ui, -apple-system, BlinkMacSystemFont, sans-serif

**Character:** Clean, technical, fast. System font ensures native feel on all devices.

### Hierarchy
- **Title** (600, 18px): Page titles, section headings.
- **Body** (400, 14px): Default content text.
- **Label** (500, 12px): Card labels, metadata, timestamps.
- **Display** (700, 28-32px): Stat numbers, key metrics.

## 4. Elevation

The system uses background contrast for depth, not shadows.

### Surface Levels
- **Base** (#0a0a0a): Page background.
- **Level 1** (#111111): Cards, panels.
- **Level 2** (#1a1a1a): Hover states, popovers.
- **Level 3** (#27272a): Active pressed states.

### Named Rules

**The No-Shadow Rule.** Dark surfaces don't need shadows. Depth is communicated through background lightness. Only the feedback FAB and modals use shadows for floating context.

## 5. Components

### Buttons
- **Shape:** 8px radius, 10px 20px padding
- **Primary:** Indigo background (#6366f1), white text. Hover: lighter indigo.
- **Secondary:** Surface background (#111111), primary text, border #27272a. Hover: elevated surface.
- **Ghost:** Transparent, secondary text. Hover: surface background.

### Cards
- **Background:** #111111
- **Border:** 1px solid #27272a
- **Radius:** 12px
- **Padding:** 20px
- **No shadow** (elevation through background contrast)

### Inputs
- **Background:** #111111
- **Border:** 1px solid #27272a
- **Focus:** Border color #6366f1
- **Text:** #fafafa
- **Placeholder:** #71717a

### Navigation
- **Background:** #0a0a0a with top border #27272a
- **Active:** Indigo text + indigo glow background
- **Inactive:** #71717a text

### Chat Bubbles
- **User:** Indigo background (#6366f1), white text
- **AI:** Surface background (#111111), primary text, border #27272a

## 6. Do's and Don'ts

### Do:
- **Do** use #0a0a0a as the base, #111111 for cards, #1a1a1a for hover states
- **Do** use indigo glow (rgba(99,102,241,0.15)) for active/hover backgrounds
- **Do** keep borders minimal: 1px #27272a only where needed
- **Do** use emoji for personality (navigation, section labels, empty states)
- **Do** ensure all text meets WCAG AA contrast on dark backgrounds

### Don't:
- **Don't** use pure black (#000000) as background. Use #0a0a0a.
- **Don't** use box-shadows for elevation. Use background contrast.
- **Don't** use bright/saturated colors for large surfaces. Accent colors are for small elements only.
- **Don't** use gradient backgrounds on cards. Keep them flat.
- **Don't** mix light and dark sections. The entire page is dark.
