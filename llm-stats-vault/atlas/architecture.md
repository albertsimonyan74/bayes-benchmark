---
tags: [atlas, architecture, system-design, components]
date: 2026-04-26
---

# Benchmark System Architecture

## Pipeline Overview

```
Task Generation ──► Benchmark Runner ──► Scoring Pipeline ──► Website
       │                   │                    │                │
  tasks_all.json       runs.jsonl           results.json   React+FastAPI
       │                   │
  perturbations.json  (append-only)
```

## Module Roles

### Task Generation
| File | Output | Count |
|------|--------|-------|
| `baseline/bayesian/build_tasks_bayesian.py` | `data/benchmark_v1/tasks.json` | 136 |
| `baseline/bayesian/build_tasks_advanced.py` | `data/benchmark_v1/tasks_advanced.json` | 35 |
| merge script (manual) | `data/benchmark_v1/tasks_all.json` | 171 |
| `data/synthetic/build_perturbations.py` | `data/synthetic/perturbations.json` | 75 |

**Rule**: Never edit task JSON files manually — always regenerate.

### Benchmark Runner
- `llm_runner/run_all_tasks.py` — CLI: `--models`, `--tasks`, `--synthetic`, `--delay`, `--dry-run`
- `llm_runner/model_clients.py` — 5 API clients via httpx (no vendor SDKs)
- `llm_runner/prompt_builder.py` — `build_prompt(task)` + `parse_answer(response)`
- `llm_runner/prompt_builder_fewshot.py` — few-shot CoT variant (Wei et al. 2022)
- `llm_runner/prompt_builder_pot.py` — Program-of-Thoughts variant (Chen et al. 2022)
- `llm_runner/response_parser.py` — `full_score(raw, task)` — live scoring Path A
- `llm_runner/logger.py` — `log_jsonl()` appends to runs.jsonl

### Scoring Pipeline (post-hoc)
- `experiments/run_benchmark.py` — entry point, `--no-judge` flag
- `evaluation/metrics.py` — `score_all_models(tasks, runs)` — formal scoring Path B
- `evaluation/llm_judge.py` — Claude-as-Judge fallback for failed extraction
- `evaluation/task_validator.py` — automated task quality checking
- `evaluation/task_spec_schema.py` — loads tasks.json → `Dict[str, TaskSpec]`

See [[scoring-pipeline]] for component weights and formulas.

### MCP Server
- `capstone_mcp/server.py` — FastMCP exposing 8 tools
- Tools: `get_task`, `list_tasks`, `score_response`, `get_results`, `get_summary`, `compare_models`, `get_failures`, `run_single_task`
- Tests: `capstone_mcp/test_server.py` — 29 tests, all passing

### Website
- **Backend**: `capstone-website/backend/main.py` — FastAPI, port 8000
- **Frontend**: `capstone-website/frontend/` — React 19 + Vite 8, port 3000
- Key pages: `VizGallery.jsx` (leaderboard + viz gallery), tasks browser
- Data manifests: `visualizations.js` (15 PNGs + 14 HTMLs), `results_summary.json`, `stats.json`, `tasks.json`
- Static assets: `frontend/public/visualizations/png/` + `/interactive/`

See [[react-frontend-uses-vite]] and [[fastapi-backend-serves-runs-data]].

## Key Data Files

| File | Created by | Read by | Rule |
|------|-----------|---------|------|
| `data/benchmark_v1/tasks_all.json` | build scripts | runner, website | never edit manually |
| `experiments/results_v1/runs.jsonl` | run_all_tasks.py | run_benchmark.py | append-only |
| `experiments/results_v1/results.json` | run_benchmark.py | website, scripts | currently empty |
| `capstone-website/frontend/src/data/results_summary.json` | summarize_results.py | website | refresh after runs |

## Critical Cross-Cutting Rules
- [[scoring-weights-must-be-updated-in-two-files]] — response_parser.py AND metrics.py
- [[resume-safe-benchmark-skips-completed-tasks]] — `_load_completed()` at runner startup
- [[runs-jsonl-is-append-only]] — never truncate, handle schema heterogeneity
