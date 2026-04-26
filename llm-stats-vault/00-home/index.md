---
tags: [home, index, dashboard]
date: 2026-04-26
---

# LLM Statistical Reasoning Benchmark — Knowledge Base

> DS 299 Capstone: Benchmarking 5 LLMs on inferential and Bayesian statistical reasoning across 171 tasks.

## Run Status Snapshot (2026-04-26)

| Model | Phase 1 (136) | Phase 2 (35) | Synthetic (75) |
|-------|--------------|-------------|----------------|
| claude | ✅ 136/136 (86% pass) | ✅ 35/35 | ❌ 0/75 |
| chatgpt | ✅ 136/136 (72% pass) | ✅ 35/35 | ❌ 0/75 |
| deepseek | ✅ 136/136 (74% pass) | ✅ 35/35 | ❌ 0/75 |
| mistral | ✅ 136/136 (81% pass) | ✅ 35/35 | ❌ 0/75 |
| gemini | ❌ 74/136 (quota hit) | ❌ 0/35 | ❌ 0/75 |

**results.json**: EMPTY — `run_benchmark.py` never completed successfully  
**RQ4 synthetic**: 0/375 runs done

## Navigation

### Atlas (System Architecture)
- [[architecture]] — component map, module roles, data flow
- [[stack]] — Python 3.11, React 19, FastAPI, R 4.3.2, MCP
- [[scoring-pipeline]] — dual paths, weight reconciliation, LLM-as-Judge
- [[data-flow]] — task spec → runs.jsonl → results.json → website

### Active Priorities
- [[current-priorities]] — what blocks progress right now

### Key Knowledge
- [[five-research-questions-define-benchmark-scope]] — RQ1–RQ5
- [[all-scoring-weights-are-equal-at-0.20]] — why N=M=A=C=R=0.20
- [[gemini-daily-quota-exhausted-on-2026-04-24]] — why Gemini is incomplete
- [[adding-a-new-task-type-requires-4-changes]] — contribution checklist
- [[scoring-weights-must-be-updated-in-two-files]] — critical sync rule
- [[obsidian-vault-is-persistent-session-memory]] — vault + CLAUDE.md division of responsibility

### Sessions
- [[2026-04-26-vault-creation-and-workflow-setup]] — vault built, session workflow established
- [[2026-04-26-research-gap-closures-and-roadmap]] — LLM-as-Judge, PoT, few-shot, bibliography

## Quick Commands

```bash
source .venv/bin/activate

# Resume Gemini Phase 1 (62 tasks missing)
python -m llm_runner.run_all_tasks --models gemini

# Resume Gemini Phase 2 (35 tasks)
python -m llm_runner.run_all_tasks --models gemini \
  --tasks data/benchmark_v1/tasks_advanced.json --delay 5

# Run scoring pipeline after Gemini completes
python -m experiments.run_benchmark
python scripts/summarize_results.py

# Run RQ4 synthetic (all 4 complete models)
python -m llm_runner.run_all_tasks \
  --models claude chatgpt deepseek mistral --synthetic

# Start website
cd capstone-website && uvicorn backend.main:app --reload
cd capstone-website/frontend && npm run dev

# Run tests
pytest baseline/frequentist/test_frequentist.py capstone_mcp/test_server.py -v
```
