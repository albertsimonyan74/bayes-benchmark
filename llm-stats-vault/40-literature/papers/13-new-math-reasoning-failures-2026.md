# Large Language Models and Mathematical Reasoning Failures

## Metadata
- Authors: Johan Boye, Birger Moell
- Year: 2026 (February)
- Venue: arXiv preprint
- arXiv ID: 2502.11574
- URL: https://arxiv.org/abs/2502.11574
- Date added to vault: 2026-05-01
- Source category: NEW_DAY3_DISCOVERY

## One-line summary
Catalogs LLM failure modes on mathematical reasoning, emphasizing unwarranted assumptions and intuition-translation gaps.

## Key findings
- "Unwarranted assumptions" is a top failure mode across math domains.
- Models struggle to translate physical/intuitive reasoning into mathematical steps.
- Failures cluster on derivation correctness, not arithmetic.
- Multi-dimensional rubrics expose more failures than answer-correctness alone.

## How it grounds this project
Validates the N·M·A·C·R rubric design. The "unwarranted assumptions" failure mode is exactly what our assumption_compliance dimension measures (51.5% zeros in judge scores). Maps to evaluation/llm_judge_rubric.py and the assumption_compliance result.

## Citation in poster
(Math Reasoning Failures, 2026)

## Citation in paper
Recent work (2026) identifies unwarranted assumptions and intuition-translation gaps as core LLM math-reasoning failures; our N·M·A·C·R rubric explicitly captures these dimensions.

## Bibtex key
mathfail2026

## Project artifacts that cite this
- evaluation/llm_judge_rubric.py
- evaluation/metrics.py (rubric weights)
- RQ3 failure taxonomy panel
- Methodology section (rubric design)

## Tags
#rubric-design #failure-modes #math-reasoning #assumption-violation
