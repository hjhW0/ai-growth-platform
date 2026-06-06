---
target: Dashboard
total_score: 24
p0_count: 0
p1_count: 1
p2_count: 3
timestamp: 2026-06-06T17-35-38Z
slug: frontend-src-pages-dashboard-js
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeleton loading good; no per-card loading or error states |
| 2 | Match System / Real World | 3 | Emoji relatable for students; "AI 建议" lacks context for new users |
| 3 | User Control and Freedom | 2 | No undo on task completion; feedback modal has close but no cancel |
| 4 | Consistency and Standards | 3 | Card styling consistent; muted text colors inconsistent (#999/#bbb/#ccc) |
| 5 | Error Prevention | 2 | No confirmation on task complete; no character limit on feedback |
| 6 | Recognition Rather Than Recall | 3 | Emoji labels clear; greeting with username is warm |
| 7 | Flexibility and Efficiency of Use | 2 | No keyboard shortcuts; no bulk actions; "see more" link helps |
| 8 | Aesthetic and Minimalist Design | 3 | Clean layout; FAB slightly prominent |
| 9 | Error Recovery | 2 | API errors logged to console only; alert() on feedback failure |
| 10 | Help and Documentation | 1 | No help, no tooltips, no onboarding |
| **Total** | | **24/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: Doesn't scream "AI made it." Emoji-as-icon is a deliberate PRODUCT.md choice. Gradient hero card is common but appropriate. Skeleton loading well-executed. Layout avoids "three identical cards" trap.

**Deterministic scan**: 1 finding. `layout-transition` (warning) at line 167: `transition: width` on progress bar causes layout thrash.

## Overall Impression

Solid, functional dashboard for students. Warm greeting, streak counter, emoji personality create friendly feel. Biggest gap: error handling. Second gap: accessibility.

## What's Working

1. Skeleton loading matches final layout shape
2. Time-based greeting with emoji creates personal warmth
3. Empty states with emoji + guidance text are helpful

## Priority Issues

**[P1] No error states shown to user** - API failures show nothing. Fix: add error state per card with retry. Command: $impeccable harden Dashboard

**[P2] Inconsistent muted text colors** - #999/#bbb/#ccc used interchangeably. Fix: standardize to #999. Command: $impeccable polish Dashboard

**[P2] No keyboard accessibility** - Modal, task list, FAB not keyboard-navigable. Fix: add tabIndex, focus management. Command: $impeccable audit Dashboard

**[P2] Progress bar animates width** - Layout thrash. Fix: use scaleX transform. Command: $impeccable optimize Dashboard

**[P3] FAB may overlap bottom nav** - Touch target conflict. Fix: increase bottom offset. Command: $impeccable adapt Dashboard

## Persona Red Flags

**Alex (Power User)**: No keyboard shortcuts. No bulk actions. Will abandon in 30 seconds.

**Jordan (First-Timer)**: "AI 建议" has no explanation. No onboarding.

**Casey (Mobile User)**: Touch targets adequate. FAB/nav could conflict on short screens.

## Minor Observations

- localStorage.getItem on every render; should memoize
- alert() on feedback failure is jarring
- Skeleton uses ease-in-out; custom curve would be more premium
- <a href="/tasks"> causes full reload; should use React Router Link

## Questions to Consider

- Should AI建议 section have a "生成复盘" button when empty?
- Should dashboard show a daily motivational tip?
- Is the feedback FAB the best use of bottom-right real estate?
