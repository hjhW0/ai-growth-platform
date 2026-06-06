---
name: AI 成长平台
description: 轻松有趣的学生个人成长与学习规划工具
colors:
  primary: "#6366f1"
  primary-deep: "#4f46e5"
  gradient-start: "#667eea"
  gradient-end: "#764ba2"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
  text-primary: "#333333"
  text-secondary: "#666666"
  text-muted: "#999999"
  text-placeholder: "#cccccc"
  border: "#dddddd"
  border-light: "#e0e0e0"
  surface: "#ffffff"
  background: "#f5f5f5"
  surface-alt: "#f0f0f0"
typography:
  display:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  headline:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px"
---

# Design System: AI 成长平台

## 1. Overview

**Creative North Star: "The Study Buddy"**

This is a companion, not a tool. The interface should feel like opening a well-organized notebook that also happens to cheer you on. Every surface is clean and uncluttered, but never cold: emoji accents, gentle gradients, and warm feedback make it feel like a friend who's tracking progress alongside you.

The system rejects corporate productivity software (no dashboards that look like ERP), rejects complexity for its own sake (no nested panels or infinite configuration), and rejects visual monotony (no all-gray, all-text interfaces). It embraces color as emotion: purple for primary actions signals ambition; amber/orange for streaks and check-ins signals warmth; green for completion signals satisfaction.

**Key Characteristics:**
- Emoji as first-class visual language (navigation, section headers, feedback)
- Gradient accents reserved for hero moments (login, check-in, key stats)
- Card-based layout with generous whitespace
- Bottom navigation for mobile-first thumb reach
- Inline styles (no CSS framework, no design tokens file; all styling is co-located with components)

## 2. Colors: The Indigo-and-Amber Palette

The palette centers on indigo (#6366f1) as the primary brand color, paired with warm amber/orange for streak and check-in surfaces. This creates a "cool ambition + warm encouragement" duality.

### Primary
- **Indigo** (#6366f1): The workhorse accent. Used on navigation active state, primary buttons, links, focus rings, stat highlights, chat bubbles (user side). Appears on every screen.
- **Indigo Deep** (#4f46e5): Hover/active state for primary buttons. Slightly darker, never used as a standalone surface.

### Secondary
- **Purple Gradient** (linear-gradient 135deg, #667eea → #764ba2): Reserved for hero surfaces only: login background, dashboard greeting card, feedback FAB. Not used on buttons or small elements.
- **Amber** (#f59e0b): Check-in surfaces, medium priority badges, warning states. Conveys warmth and streak energy.
- **Amber-to-Red Gradient** (linear-gradient 135deg, #f59e0b → #ef4444): Check-in hero card only. Signals "on fire" streak energy.

### Tertiary
- **Emerald** (#10b981): Completion states, success feedback, low priority badges, completed task checkmarks. Signals "done" and "good."
- **Red** (#ef4444): High priority badges, delete actions, error states. Used sparingly.

### Neutral
- **Ink** (#333333): Primary body text, headings.
- **Slate** (#666666): Secondary text, labels, descriptions.
- **Muted** (#999999): Placeholder text, timestamps, tertiary info.
- **Ghost** (#cccccc): Empty state text, disabled hints.
- **Cloud** (#f0f0f0): AI chat bubble background, inactive circle backgrounds, subtle dividers.
- **Snow** (#f5f5f5): Page background. Every card floats on this.
- **Paper** (#ffffff): Card and surface background.
- **Line** (#dddddd / #e0e0e0): Borders, input outlines, dividers.

### Named Rules

**The Gradient Restraint Rule.** Gradients appear on exactly three surfaces: login background, dashboard greeting card, and check-in hero. Everywhere else, flat color. If you're adding a gradient to a button, card, or section header, stop.

**The Emoji-as-Icon Rule.** The project uses emoji in place of icon libraries for navigation (🏠🎯📋🔥📊🤖), section headers (🎯📋📊🤖🔥), and feedback (😊😐😔). This is a deliberate personality choice, not a limitation. Don't replace emoji with SVG icons unless the emoji renders inconsistently across target devices.

## 3. Typography

**Display Font:** system-ui, -apple-system, BlinkMacSystemFont, sans-serif
**Body Font:** Same stack (single-family system)

**Character:** Clean, friendly, unpretentious. The system font stack ensures fast rendering and native feel on both iOS and Android. No decorative fonts; personality comes from emoji and color, not typeface.

### Hierarchy
- **Display** (700, 32px, line-height 1.2): Large stat numbers (goal count, streak days, completion rate). Appears in stat cards and check-in hero.
- **Title** (700, 20px, line-height 1.3): Page titles in nav bar, section headings in cards.
- **Headline** (600, 18px, line-height 1.4): Card section titles, form labels, prominent text.
- **Body** (400, 14-15px, line-height 1.6): Default text size for content, list items, descriptions. Chat messages use 15px.
- **Label** (400, 12px, line-height 1.4): Timestamps, secondary labels, small badges, priority indicators.

### Named Rules

**The No-Decorative-Type Rule.** The system uses exactly one font family (system-ui). No serif display fonts, no monospace for stats, no script for emphasis. Personality is carried by emoji, color, and layout, not by typeface choice.

## 4. Elevation

The system uses a single-layer shadow strategy: cards float above the page background with a consistent soft shadow. There is no multi-layer depth system (no stacked shadows, no z-index drama).

### Shadow Vocabulary
- **Card Default** (`box-shadow: 0 2px 8px rgba(0,0,0,0.08)`): Every white card on the page background. Subtle, barely perceptible, just enough to lift the card off the snow surface.
- **Card Elevated** (`box-shadow: 0 2px 8px rgba(0,0,0,0.1)`): Slightly heavier variant used on some pages (Tasks, CheckIn). Functionally identical to default; the inconsistency is a code artifact, not a design choice.
- **Nav Shadow** (`box-shadow: 0 -2px 8px rgba(0,0,0,0.1)`): Bottom navigation bar. Upward shadow signals "this bar floats above content."
- **Modal Shadow** (`box-shadow: 0 8px 32px rgba(0,0,0,0.2)`): Login card, feedback modal. Heavier shadow for focus-demanding overlays.
- **FAB Shadow** (`box-shadow: 0 4px 15px rgba(102,126,234,0.4)`): Feedback floating action button. Tinted shadow matching the gradient brand color.

### Named Rules

**The One-Shadow-Per-Element Rule.** Every element gets exactly one shadow treatment. Never combine box-shadow with border for the same decorative purpose. Cards use shadow, not border. Inputs use border, not shadow.

## 5. Components

### Buttons
- **Shape:** Rounded corners (8px radius for standard, 10px for chat input, 50% for circular check-in button)
- **Primary:** Indigo background (#6366f1), white text, 12px 24px padding. Hover: darker indigo (#4f46e5). Disabled: gray (#ccc) with not-allowed cursor.
- **Ghost:** Transparent background, indigo text, underline on hover. Used for toggle links (login/register switch).
- **Date Nav:** Light gray background (#f5f5f5), gray border, 8px 16px padding. Used for prev/next day navigation.
- **Check-in Circle:** 120px diameter, white background with 4px white border, amber text. When checked: semi-transparent white fill, white text.

### Cards / Containers
- **Corner Style:** 12px radius (standard) or 16px radius (hero cards)
- **Background:** White (#ffffff)
- **Shadow:** 0 2px 8px rgba(0,0,0,0.08)
- **Border:** None (shadow-only elevation)
- **Internal Padding:** 20px (standard), 28px (hero), 16px (compact)
- **Hero Cards:** Use gradient backgrounds instead of white. Padding is larger (28-40px). Text is white. Reserved for dashboard greeting and check-in hero.

### Inputs / Fields
- **Style:** White background, 1px solid border (#ddd default, #e0e0e0 for some), 8px radius
- **Focus:** Border color transitions to indigo (#6366f1). No glow, no shadow.
- **Padding:** 12px all sides
- **Font Size:** 16px (prevents iOS zoom on focus)

### Navigation
- **Bottom Bar:** Fixed to viewport bottom, white background, upward shadow. Six items with emoji icon + label. Active state: indigo text (#6366f1). Inactive: gray (#666). Icons are 20px emoji, labels are 12px.
- **Top Bar:** Indigo background (#6366f1), white text, 16px 24px padding. Contains app title (20px bold) and user info + logout button.

### Chat Bubbles
- **User:** Right-aligned, indigo background (#6366f1), white text, 16px 16px 4px 16px radius (tail at bottom-right). Max-width 80%.
- **AI:** Left-aligned, cloud background (#f0f0f0), dark text (#333), 16px 16px 16px 4px radius (tail at bottom-left). Max-width 80%.
- **Streaming Cursor:** 2px wide indigo bar, 16px height, blink animation.

### Stat Displays
- **Number:** 32px bold, colored by role (indigo for totals, emerald for completed, amber for rates).
- **Label:** 14px, muted color (#666), centered below number.
- **Grid:** 3-column grid with 16px gap.

## 6. Do's and Don'ts

### Do:
- **Do** use emoji liberally in navigation, section headers, and empty states. They are the primary personality vehicle.
- **Do** keep shadows consistent: 0 2px 8px rgba(0,0,0,0.08) for cards, heavier only for modals.
- **Do** use indigo (#6366f1) as the single primary accent. It should appear on every screen but not dominate any single screen.
- **Do** reserve gradients for hero moments only (login, greeting, check-in). Flat color everywhere else.
- **Do** ensure touch targets are at least 44px (the check-in button is 120px; nav items have generous padding).
- **Do** use the system font stack. Native feel is a feature, not a compromise.

### Don't:
- **Don't** use border-left or border-right as colored accent stripes on cards or list items. This is the "side-stripe" anti-pattern; use background tints or leading icons instead.
- **Don't** apply gradient text (background-clip: text). Use solid color for all text.
- **Don't** add glassmorphism (backdrop-filter: blur) to cards or modals. The system is flat and clean.
- **Don't** use border-radius above 16px on cards. The check-in circle (50%) and mood buttons (50%) are the only fully-round elements.
- **Don't** mix shadow and border on the same element for decorative purposes. Pick one.
- **Don't** add a second font family. The system-ui stack is the only typeface.
- **Don't** use more than 3 different font sizes on a single screen. Hierarchy comes from weight and color, not from a rainbow of sizes.
- **Don't** add dark mode without redesigning the gradient and color system. The current palette is light-mode-only.
