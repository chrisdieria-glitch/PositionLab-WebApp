# PositionLab Web

## Stack

- React
- Vite
- JavaScript
- CSS

---

## UI

Desktop-first.

Layouts should scale naturally to tablets and smaller screens.

Avoid mobile patterns that don't translate well to desktop.

---

## Components

Prefer reusable components.

Keep components small.

Avoid files over ~300 lines whenever possible.

---

## Styling

Use CSS variables whenever appropriate.

Avoid inline styles.

Maintain a consistent spacing system.

---

## State

Prefer local state.

Lift state only when necessary.

Avoid unnecessary global state.

---

## Performance

Avoid unnecessary re-renders.

Memoize only when profiling justifies it.

---

## Tables

Trading data should be presented in professional tables.

Numbers should be right aligned.

Monospace fonts for financial values.

---

## Charts

Keep charts lightweight.

Avoid unnecessary animations.

Prioritize responsiveness.

---

## UX

Keyboard shortcuts are encouraged.

Hover states should provide useful feedback.

Desktop interactions should feel fast.

---

## Goal

The web application should feel like a lightweight TradingView-style utility.

## Navigation Rule

Navigation must never destroy user data.

Changing screens, routes, tabs, or layouts should preserve the current working state.

If a navigation implementation would cause data loss, choose a different architecture (shared state, context, store, lifted state, etc.) instead of resetting the calculator.