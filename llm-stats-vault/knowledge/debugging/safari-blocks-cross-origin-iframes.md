---
tags: [debugging, safari, iframe, cross-origin, frontend, browser-compat]
date: 2026-04-26
---

# Safari Blocks Cross-Origin Iframes

## What Happened
The "Open Interactive" button in VizGallery opened Plotly HTML charts inside an `<iframe>` embedded in a modal. Charts displayed correctly in Chrome and Firefox, but appeared blank in Safari.

## Root Cause
Safari's Intelligent Tracking Prevention (ITP) blocks cross-origin iframe content by default. The Plotly HTML files served from `localhost:3000/visualizations/interactive/` were being treated as cross-origin by Safari's security model, causing them to be blocked.

Even on the same origin, Safari is more aggressive about iframe restrictions than other browsers.

## Fix
Changed the "Open Interactive" button to use `window.open()` instead of an iframe:

```jsx
// Before (broken in Safari):
<iframe src={viz.interactive} ... />

// After (works in all browsers):
<button onClick={() => window.open(viz.interactive, '_blank')}>
  Open Interactive
</button>
```

GIF animations still use in-page modal with `<img>` tag (no iframe needed).

## Status
Fix implemented in `VizGallery.jsx` as of the last commit. **Verification pending** — needs testing in Safari, Chrome, and Firefox to confirm working.

## How to Apply
- Never use `<iframe>` for local HTML files you want to open interactively in all browsers
- Use `window.open(url, '_blank')` for opening HTML files in a new tab
- Exception: GIFs and images can always use `<img>` or in-page modal — no cross-origin issue

## Related
- [[react-frontend-uses-vite-with-portal-tooltips]] — VizGallery.jsx location
- [[current-priorities]] — Open Interactive verification is still pending
