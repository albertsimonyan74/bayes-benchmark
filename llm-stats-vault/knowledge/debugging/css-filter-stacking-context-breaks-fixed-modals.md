---
tags: [debugging, css, react, stacking-context, modal, frontend]
date: 2026-04-26
---

# CSS filter: Stacking Context Breaks position:fixed Modals

## What Happened
Task modals and PNG lightbox modals were rendering behind other elements or appearing at wrong positions, even with high `z-index` values (`z-index: 99999`).

## Root Cause
The App() root `motion.div` has `filter: blur(0px)` applied via Framer Motion for page transitions. **Any element with a CSS `filter` property creates a new stacking context**, which traps all descendant `position: fixed` elements within it.

This means: `position: fixed` inside a `filter`-bearing ancestor behaves like `position: absolute` relative to that ancestor — it cannot escape to viewport coordinates.

## Fix
Lifted all modal/overlay state **out of** the `motion.div` and rendered them as **siblings** after the closing `</motion.div>` tag in App()'s return:

```jsx
// App() return:
<>
  <motion.div style={{filter: 'blur(0px)'}}>
    {/* All page content — NO modals here */}
  </motion.div>

  {/* Modals rendered OUTSIDE the filter context */}
  <AnimatePresence>
    {modal && <TaskModal ... />}
  </AnimatePresence>
  {fullImg && <LightboxOverlay ... />}
</>
```

## Also Fixed: Portal Tooltip System
Same root cause: tooltips inside modal overflow context were clipped.  
Fix: `TooltipPortal.jsx` uses `createPortal(content, document.body)` — renders tooltips at `document.body`, always outside any stacking context.

## Also Fixed: Cursor
Cursor component removed from React, moved to vanilla JS IIFE in `index.html` — avoids any interaction with the React stacking context.

## How to Apply
- Never put `position: fixed` overlays inside elements that have CSS `filter`, `transform`, `perspective`, `will-change`, or `isolation` properties
- Always render app-level modals/overlays as siblings of the filtered root, not children
- Use `createPortal` for any tooltip/popover that must escape parent overflow or stacking context
