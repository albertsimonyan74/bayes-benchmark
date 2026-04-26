# Data Directory

## runs.jsonl
Contains all benchmark run records. Excluded from version control due to size.

### Schema
Each line is a JSON object with the following fields:
- `task_id` — unique task identifier (e.g. BAYES_RISK_001)
- `task_type` — statistical category (e.g. BAYES_RISK, FISHER_INFO)
- `model` — model name (claude / chatgpt / mistral / deepseek / gemini)
- `score` — composite score 0.0–1.0 (weighted N+M+A+C+R, each 0.20)
- `numerical_score` — RQ1: numerical accuracy
- `method_score` — RQ2: method selection correctness
- `assumption_score` — RQ3: assumption compliance
- `confidence_score` — RQ5: confidence calibration
- `reasoning_score` — reasoning quality
- `input_tokens` — tokens sent to model
- `output_tokens` — tokens received from model
- `timestamp` — ISO 8601 UTC timestamp
- `error` — error message if API call failed (e.g. 429 Too Many Requests)

### Statistics (as of April 2026)

**Phase 1 (136 tasks × 5 models):**
- Claude: 136/136 — avg score 0.701 — pass rate 88%
- Mistral: 136/136 — avg score 0.646 — pass rate 81%
- DeepSeek: 136/136 — avg score 0.621 — pass rate 74%
- ChatGPT: 136/136 — avg score 0.620 — pass rate 74%
- Gemini: 68/136 — in progress (quota interruptions)

**Phase 2 (35 tasks × 5 models — computational Bayes):**
- Claude: 35/35 — avg score 0.613 — pass rate 100%
- DeepSeek: 35/35 — avg score 0.642 — pass rate 100%
- Mistral: 35/35 — avg score 0.637 — pass rate 100%
- ChatGPT: 35/35 — avg score 0.627 — pass rate 100%
- Gemini: 0/35 — pending

**Total:** 752 runs / 855 (171 tasks × 5 models)
- Synthetic (RQ4): 0/375 — in progress

### Reproducing runs
```bash
python -m llm_runner.run_all_tasks --models claude chatgpt deepseek mistral
python -m llm_runner.run_all_tasks --models gemini --delay 5
python -m llm_runner.run_all_tasks --models claude chatgpt deepseek mistral --synthetic
```
