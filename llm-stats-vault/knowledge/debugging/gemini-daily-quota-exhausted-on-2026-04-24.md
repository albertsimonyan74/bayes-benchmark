---
tags: [debugging, gemini, quota, rate-limit, incident]
date: 2026-04-26
---

# Gemini Daily Quota Exhausted on 2026-04-24

## What Happened
Gemini Phase 1 run started normally, completed 74/136 tasks, then hit daily RPD (requests per day) quota at approximately 09:41 UTC on 2026-04-24.

Remaining 62 tasks were skipped. 58 error records with `score=0` and `error` field set were logged to `runs.jsonl` from earlier 429 rate-limit responses before full exhaustion.

## Two Distinct Failure Modes (Critical Distinction)

| Mode | Type | Fix |
|------|------|-----|
| RPM (requests per minute) exceeded | 429 — temporary | `--delay 5` + retry waits [10, 20, 40, 80, 160]s |
| RPD (daily quota) exhausted | 429 — hard limit | Wait until midnight Pacific, then resume |

**RPD exhaustion cannot be fixed by retrying** — quota resets at midnight Pacific only.  
Free tier: ~250 RPD for `gemini-2.5-flash`.

## Affected Tasks (62 missing)
`BAYES_FACTOR×5, BAYES_REG×5, CI_CREDIBLE×5, CONCEPTUAL×10, GAMBLER×3, HPD×5, JEFFREYS×5, LOG_ML×5, MLE_EFFICIENCY×3, MLE_MAP×5, PPC×5, RANGE_DIST×3, STATIONARY×3`

## Error Records in runs.jsonl
58 records with `error` field set and `final_score=0` remain in `runs.jsonl`.  
These depress Gemini's reported average (0.236) — true performance on completed tasks is higher.

## Fix
Resume after quota resets:
```bash
python -m llm_runner.run_all_tasks --models gemini
```
Resume logic: `_load_completed()` loads existing `(model_family, task_id)` pairs at startup.  
**Caveat**: error records may be counted as "completed" by `_load_completed()` — verify behavior before resuming to ensure errored tasks are retried.

## Related
- [[gemini-api-has-free-tier-rate-limits]] — quota details
- [[resume-safe-benchmark-skips-completed-tasks]] — how resume works
- [[runs-jsonl-is-append-only]] — why the error records persist
