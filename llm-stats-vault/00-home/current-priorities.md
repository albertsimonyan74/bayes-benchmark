---
tags: [priorities, planning, roadmap]
date: 2026-04-27
---

# Current Priorities

## Status: Benchmark Complete ✅ · Website Live ✅

All 855 Phase1+2 runs + 375 synthetic runs complete. Results scored. R report rendered. Website deployed.

**Production URLs:**
- Frontend: https://capstone-llm-stats.vercel.app
- Backend: https://capstone-llm-stats.onrender.com

---

## Open Items (Paper-Blocking)

> Error taxonomy ✅ closed 2026-04-26. See [[2026-04-26-error-taxonomy-pipeline]].
> User Study website feature ✅ closed 2026-04-27. See [[2026-04-27-user-study-and-deployment]].

### 1. Error Taxonomy Analysis ✅ DONE (2026-04-26)
See [[proposal-gap-error-taxonomy-analysis-missing]].

### 2. User Study ✅ DONE — live interactive (2026-04-27)
Implemented as interactive website feature (not Google Form):
- Users submit Bayesian stats questions + optional image
- All 5 models respond in parallel (real API calls via httpx)
- User votes for best explanation
- Aggregate vote results displayed (CSS bar chart)
- Live at: https://capstone-llm-stats.vercel.app → scroll to "User Study"
- Vote data stored in Render container (ephemeral — resets on redeploy)

**For paper §5:** Can cite this as "interactive web-based user study" and report vote distribution once data accumulates. Note: votes are ephemeral on Render free tier — export `data/user_study_results.json` before any redeploy if votes need to be preserved.

See [[2026-04-27-user-study-and-deployment]].

---

## Phase 3 — New Benchmark Concepts (Optional)

### 3. New Task Types (Optional expansion)
Current: 38 types (31 Phase1 + 7 Phase2). Proposal doesn't require expansion.

Candidates (if time permits):
- Kalman filter (state estimation)
- EM algorithm (mixture models)
- Laplace approximation (posterior approximation)
- Copulas (dependency modeling)
- Extreme value theory

Pattern: [[adding-a-new-task-type-requires-4-changes]].

---

## Phase 4 — Visualization Quality ✅ DONE (2026-04-27)

### 4. Website Viz Overhaul ✅ DONE (initial)
- Trimmed 18 → 12 visualizations
- Featured 2×2 strip above gallery
- All descriptions plain language
- Fixed Gemini missing from 3 R-generated PNGs
- Removed redundant Results section + navbar entry
- Emoji → monoline SVGs
- TierLadder rebuilt with tier-specific examples and challenges

See [[2026-04-27-website-ui-viz-overhaul]].

### 4b. Website UI Overhaul Part 2 ✅ DONE (2026-04-28)
All 10 items complete. See [[2026-04-28-ui-overhaul-part2]].

Commit 84fa12a pushed → Vercel auto-deploying.

### 4c. Website UI Fixes Part 3 ✅ DONE (2026-04-28)
5 fixes: tier description font size, divergence tolerance (0.005 numeric), viz interactive HTML (cleanUrls:false), GIF loading state, vote storage clarification, model avg output tokens display.
Commit 2f6fdf0 → Vercel + Render auto-deploying.
See [[2026-04-28-ui-fixes-part3]].

### 4d. Website UI Fixes Part 4 ✅ DONE (2026-04-28)
5 fixes: tier text even bigger (17px), model outputs full-width stacked (flex column), interactive HTML + GIF committed to git (root cause: gitignore exclusions), vote info bar removed, vote persistence via Supabase (optional env vars).
See [[2026-04-28-ui-fixes-part4]].
**Supabase setup needed** for persistent votes: create `votes`+`questions` tables, set `SUPABASE_URL`+`SUPABASE_KEY` in Render env vars.

### 4e. Website Session 29e ✅ DONE (2026-04-30)
12 fixes: Möbius Strip hero animation, Key Findings+Radar 2-col layout, footer with author credit, wider sections, description truncation 155→280, filter sidebar alignment, Key Findings title/Radar legend font sizes; R viz: score distributions interactive→ridges, E8 shown in error taxonomy, difficulty→grouped bar heatmap, speed/accuracy text overlap fixed.
Commit ac3c979. See [[2026-04-30-ui-viz-session29e]].

### 4f. Website Session 30b ✅ DONE (2026-04-30)
8 fixes: Neural net hero (HeroNetworkBg canvas), horizontal radar legend, 3 animated electron orbit rings on How It Works circle (145px), filter sidebar alignment (alignSelf:start), 10 CONCEPTUAL task descriptions completed (reference_answer), User Study 2-col layout + inline registration form + AggregatePanel always visible with reason breakdown, backend reason_distribution added, footer cleanup.
Commit c86cb39. See [[2026-04-30-ui-session30b]].

### 4g. Website Session 30c ✅ DONE (2026-04-30)
4 fixes: How It Works container 640→800px, more particles on all orbit rings (3 per ring) + outer rings, center hub text → "Benchmarking", filter sidebar sticky removed (alignSelf:start only — no top:96 offset), page sizes 9/18/36/72 → 16/32/64/All.
See [[2026-04-30-ui-session30c]].

### 4h. Website Session 30d ✅ DONE (2026-04-30)
9 fixes: outer orbit rings faster (32s/20s), remove FIVE RQS header+para, RQ staggered flex layout, Key Findings richer stats, equal height grid stretch, References subtitle/paras removed, header font 10→16px, rounded hover glow (borderRadius:16 on motion.div wrappers).
See [[2026-04-30-ui-session30d]].

---

## Phase 5 — Paper Writing

### 5. Final Report / Paper
Key sections:
- Abstract ← draft from proposal (update with results)
- §2 Methodology ← scoring pipeline, prompting (CoT/PoT/few-shot), LLM-as-Judge
- §3 Results ← RQ1–RQ4 quantitative results (RQ5 calibration pending full analysis)
- §4 Error Analysis ← error taxonomy (done — E1-E9, 143 failures)
- §5 User Study ← interactive web study live; cite vote distribution from production
- §6 Discussion ← implications for LLM reliability in statistics
- References ← [[literature/papers_bibliography.md]] — 5 papers documented

---

## 5-Phase Roadmap Summary (Updated 2026-04-27)

| Phase | Deliverable | Status |
|-------|------------|--------|
| 1 | 855-run results.json (all 5 models) | ✅ Complete |
| 2 | 375 synthetic runs + RQ4 analysis | ✅ Complete |
| 3 | New task types benchmarked | ⏳ Optional |
| 4 | Viz audit + website deployment | ✅ Complete |
| 5 | Error taxonomy + user study + paper | ⏳ In progress (§5 live, paper remaining) |
