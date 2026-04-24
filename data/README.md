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
- Total runs: 620 / 680
- Claude: 136/136 — avg score 0.696 — pass rate 86%
- Mistral: 136/136 — avg score 0.635 — pass rate 81%
- DeepSeek: 136/136 — avg score 0.615 — pass rate 74%
- ChatGPT: 136/136 — avg score 0.612 — pass rate 72%
- Gemini: 74/136 — avg score TBD (quota interruptions) — in progress
- Synthetic (RQ4): 0/375 — in progress

### Reproducing runs
```bash
python -m llm_runner.run_all_tasks --models claude chatgpt deepseek mistral
python -m llm_runner.run_all_tasks --models gemini --delay 5
python -m llm_runner.run_all_tasks --models claude chatgpt deepseek mistral --synthetic
```
