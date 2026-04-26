---
tags: [integration, react, frontend, vite, ui]
date: 2026-04-26
---

# React Frontend Uses Vite with Portal Tooltips

## Setup
- **Framework**: React 19 + Vite 8
- **Node version**: 25
- **Port**: 3000
- **Start**: `cd capstone-website/frontend && npm run dev`

## Key Pages
- `App.jsx` — root with navbar, routing, modal state lifted here
- `VizGallery.jsx` — leaderboard cards + visualization gallery (tabs + lightbox)
- `ResultsSection.jsx` — animated scoring bars + LiveResults panel
- `Tasks.jsx` — paginated task browser with type/tier filters + GROUP BY TYPE mode

## Key Data Files (`src/data/`)
- `visualizations.js` — manifest of 15 PNGs + 14 interactive HTMLs + 1 GIF
- `results_summary.json` — live results for LiveResults panel (4 models, needs refresh)
- `stats.json` — benchmark stats (171 tasks, 38 types, 4 tiers)
- `tasks.json` — task specs for task browser
- `TooltipMap.js` — ~130 Bayesian stat term definitions

## Static Assets (`public/visualizations/`)
- `png/` — 15 PNGs + 1 GIF (`15_bar_race.gif`)
- `interactive/` — 14 Plotly HTML files + `_files/` subdirs

## Architecture Decisions
- **Modal state lifted to App()** — fixes CSS stacking context from `filter: blur(0px)` on root div. See [[css-filter-stacking-context-breaks-fixed-modals]].
- **Portal tooltip system** — `TooltipPortal.jsx` uses `createPortal` to `document.body` to bypass modal overflow clipping. See [[css-filter-stacking-context-breaks-fixed-modals]].
- **Cursor in vanilla JS** — cursor moved to IIFE in `index.html` after React cursor caused stacking context issues.
- **Open Interactive as `window.open`** — changed from iframe embed (Safari blocked it). See [[safari-blocks-cross-origin-iframes]].

## 15 Visualizations

| # | Title | Type | Key Insight |
|---|-------|------|------------|
| 01 | Performance Heatmap | Heatmap | REGRESSION + BAYES_FACTOR lowest across all models |
| 02 | Tier Performance Radar | Radar | Tier 3–4 separates model capabilities most clearly |
| 03 | Score Distributions | Density | Claude bimodal — strong on most, weak on regression |
| 04 | Difficulty Scatter | Scatter | Difficulty is consistent across models |
| 05 | Failure Analysis | Bar | REGRESSION = ~40% of all failures |
| 06 | Model Summary Table | Table | Claude leads numeric accuracy; ChatGPT leads structure |
| 07 | Latency vs Accuracy | Scatter | Claude: high accuracy, moderate latency |
| 08 | Grouped Bar by Tier | Bar | Score variance highest in Tier 3 |
| 09 | Cumulative Score Distribution | ECDF | Gap between models widens above 0.6 |
| 10 | Task Coverage Treemap | Treemap | Tier 3 dominates (69/136 tasks) |
| 11 | Score Correlation Matrix | Correlation | Inter-model r > 0.85 — consistent difficulty |
| 12 | Latency Distribution | Violin | DeepSeek has highest, most variable latency |
| 13 | Pass Rate Heatmap | Heatmap | Tier 4: Claude 69%, DeepSeek 38% |
| 14 | Difficulty Progression | Line | Sharp drop after difficulty ~0.6 |
| 15 | Ranking Animation | GIF | Rankings stabilize after ~80 tasks |
