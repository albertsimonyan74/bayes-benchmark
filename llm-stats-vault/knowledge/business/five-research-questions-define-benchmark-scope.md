---
tags: [business, research-questions, scope, rq]
date: 2026-04-26
---

# Five Research Questions Define Benchmark Scope

## Overview
The benchmark is organized around 5 research questions (RQ1–RQ5), each measuring a different aspect of LLM statistical reasoning capability.

## Research Questions

### RQ1 — Numerical Accuracy
**Question**: How accurately do LLMs compute Bayesian numerical answers?  
**Metric**: N score (0.20 weight) — predicted values vs ground truth within tolerance  
**Status**: Implemented — `numeric_score` in runner, `numerical_score()` in metrics.py  
**Finding**: Claude leads (63.1% avg numeric accuracy)

### RQ2 — Method Selection
**Question**: Do LLMs select and apply the correct statistical methods?  
**Metric**: M score (0.20 weight) — required reasoning steps present in response  
**Status**: Implemented — `structure_score` in runner, `method_structure_score()` in metrics.py  
**Finding**: ChatGPT leads on method compliance (93.6% structure score)

### RQ3 — Assumption Compliance
**Question**: Do LLMs explicitly state required statistical assumptions?  
**Metric**: A score (0.20 weight) — required assumptions mentioned  
**Status**: Implemented — `assumption_score` in runner, `assumption_compliance_score()` in metrics.py  
**Finding**: Claude leads (65.6% assumption compliance)

### RQ4 — Robustness to Prompt Variations
**Question**: Does performance degrade when the same problem is presented differently?  
**Metric**: Comparison across rephrase / numerical / semantic perturbations  
**Status**: Data ready (`perturbations.json`, 75 tasks, `--synthetic` flag) — but 0/375 runs done  
**See**: [[perturbation-types-test-three-robustness-axes]]

### RQ5 — Confidence Calibration
**Question**: Are LLMs well-calibrated (confident when correct, uncertain when wrong)?  
**Metric**: C score (0.20 weight) — `extract_confidence()` + `confidence_calibration_score()`  
**Status**: Implemented — `confidence_calibration_score()` in `response_parser.py`; C=0.20 active  
**Finding**: Overconfidence is penalized 1.5×, underconfidence 0.8×

## Score-to-RQ Mapping

| Score | RQ | Weight |
|-------|-----|--------|
| N (Numerical) | RQ1 | 0.20 |
| M (Method/Structure) | RQ2 | 0.20 |
| A (Assumption) | RQ3 | 0.20 |
| C (Confidence) | RQ5 | 0.20 |
| R (Reasoning) | RQ2 support | 0.20 |

## Related
- [[scoring-pipeline]] — how each RQ is measured
- [[all-scoring-weights-are-equal-at-0.20]] — weight justification
- [[benchmark-covers-bayesian-not-frequentist-methods]] — what's in scope
