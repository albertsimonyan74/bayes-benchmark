---
tags: [priorities, planning, roadmap]
date: 2026-04-26
---

# Current Priorities

## Phase 1 — Gemini Completion + Results Pipeline (CRITICAL)

### 1. Resume Gemini Phase 1
62 tasks missing — daily RPD quota hit on 2026-04-24 after ~74 tasks.
```bash
python -m llm_runner.run_all_tasks --models gemini
```
Resume is safe — `_load_completed()` skips already-done tasks.  
See [[gemini-daily-quota-exhausted-on-2026-04-24]].

### 2. Resume Gemini Phase 2
35 advanced tasks not started yet.
```bash
python -m llm_runner.run_all_tasks --models gemini \
  --tasks data/benchmark_v1/tasks_advanced.json --delay 5
```

### 3. Populate results.json
After Gemini completes, run the scoring pipeline:
```bash
python -m experiments.run_benchmark
python scripts/summarize_results.py
```
`results.json` is currently EMPTY. Website LiveResults panel reads `results_summary.json`.  
See [[dual-scoring-paths-exist-for-separation-of-concerns]].

### 4. Run RQ4 Synthetic Benchmark
375 runs (75 perturbation tasks × 5 models) — 0/375 done.
```bash
# 4 complete models first
python -m llm_runner.run_all_tasks \
  --models claude chatgpt deepseek mistral --synthetic

# Gemini after quota allows
python -m llm_runner.run_all_tasks --models gemini --synthetic --delay 5
```
Data already exists: `data/synthetic/perturbations.json` (75 tasks).  
See [[perturbation-types-test-three-robustness-axes]].

---

## Phase 3 — New Benchmark Concepts (IMPORTANT for paper)

### 5. Add Missing Statistical Task Types
Current: 31 Phase 1 types + 7 Phase 2 types = 38 total.  
Candidates: Kalman filter, EM algorithm, Laplace approximation, copulas, extreme value theory.  
Pattern: [[adding-a-new-task-type-requires-4-changes]].

---

## Phase 4 — Visualization Overhaul

### 6. Verify Open Interactive Button Works
Button calls `window.open(viz.interactive, '_blank')` for all non-GIF viz.  
Safari was blocking cross-origin iframes — see [[safari-blocks-cross-origin-iframes]].  
Test in Safari + Chrome + Firefox.

### 7. Replace Unclear Visualizations
15 existing PNGs mapped in `capstone-website/frontend/src/data/visualizations.js`.  
Replace lowest-value charts with RQ-aligned alternatives.

---

## Phase 5 — Final Report

### 8. Re-render R Master Report
After all 5 models complete:
```bash
cd report_materials/r_analysis && Rscript run_all.R
```
Update `08_master_report.Rmd`: replace "4 complete models" → "5 models".

---

## 5-Phase Roadmap Summary

| Phase | Deliverable | Status |
|-------|------------|--------|
| 1 | 855-run results.json | ❌ Gemini incomplete |
| 2 | 375 synthetic runs + RQ4 analysis | ❌ Not started |
| 3 | New task types benchmarked | ❌ Not started |
| 4 | Fixed viz + clearer charts | ❌ Open Interactive unverified |
| 5 | Final report with all 5 models | ❌ Blocked by Phase 1 |
