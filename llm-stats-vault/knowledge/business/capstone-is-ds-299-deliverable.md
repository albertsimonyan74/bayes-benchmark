---
tags: [business, capstone, academic, deliverable, ds299]
date: 2026-04-26
---

# Capstone Is a DS 299 Deliverable

## Context
DS 299 — Data Science Capstone at the university level.  
Primary investigator: Albert Simonyan (albert.simonyan1@icloud.com).

## What Is Being Built
A benchmark for evaluating LLM performance on statistical reasoning, specifically:
- 171 benchmark tasks across 38 statistical task types
- 5 LLMs evaluated: Claude, ChatGPT, DeepSeek, Mistral, Gemini
- 5 research questions (RQ1–RQ5) measuring different aspects of statistical competence
- Academic paper / report as final deliverable

## Current Completion State (~80%)
**Done:**
- All baseline computation modules (Bayesian + frequentist)
- 171 benchmark tasks across Phase 1 + Phase 2
- 4 complete model runs (Claude, ChatGPT, DeepSeek, Mistral)
- Research gap closures: LLM-as-Judge, few-shot CoT, PoT, task validator, bibliography
- Website: React + FastAPI with viz gallery, task browser, leaderboard
- R pipeline: 15 PNGs, 14 interactive HTMLs, master report (9.3 MB)

**Remaining:**
- Gemini completion (62 Phase 1 + 35 Phase 2 tasks)
- RQ4 synthetic benchmark (375 runs)
- results.json population
- New task types (Phase 3)
- Visualization overhaul
- Final R report with all 5 models

## Key Dates
- Gemini quota exhausted: 2026-04-24
- Last session (research gap closures): 2026-04-26
- Project deadline: not specified in known context

## Success Criteria
- [ ] Gemini Phase 1 + Phase 2 complete (171 runs)
- [ ] RQ4 synthetic benchmark complete (375 runs)
- [ ] results.json populated with all 855 runs
- [ ] Open Interactive button works in all browsers
- [ ] Visualizations clearly communicate benchmark findings
- [ ] R master report re-rendered with final complete data
- [ ] Any new task types added and benchmarked

## Related
- [[five-research-questions-define-benchmark-scope]] — what's measured
- [[current-priorities]] — what to do next
