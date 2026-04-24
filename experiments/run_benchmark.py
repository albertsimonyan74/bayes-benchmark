"""
Runner skeleton:
- loads TaskSpecs from JSON
- loads TaskRuns from a JSONL file (produced by your LLM runner)
- scores tasks + aggregates models
- writes results to experiments/results_v1/results.json

This runner assumes you've already created TaskRun logs (JSONL).
"""

from __future__ import annotations
import json
import os
from typing import Dict, List

from evaluation.task_spec_schema import load_tasks_from_json
from evaluation.metrics import TaskRun, score_all_models
from llm_runner.logger import log_jsonl


def load_runs_jsonl(path: str) -> List[TaskRun]:
    runs: List[TaskRun] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            obj = json.loads(line)

            runs.append(
                TaskRun(
                    model_name=obj["model_name"],
                    task_id=obj["task_id"],
                    run_id=obj.get("run_id", "base"),
                    perturbation_group=obj.get("perturbation_group"),
                    output_text=obj.get("output_text", ""),
                    extracted_numbers=obj.get("extracted_numbers", {}),
                    structure_flags=obj.get("structure_flags", {}),
                    assumption_flags=obj.get("assumption_flags", {}),
                    conceptual_rubric_score_0to2=obj.get("conceptual_rubric_score_0to2"),
                    confidence=obj.get("confidence"),
                )
            )
    return runs


def main() -> None:
    tasks_path = "data/benchmark_v1/tasks.json"
    runs_path = "experiments/results_v1/runs.jsonl"
    out_path = "experiments/results_v1/results.json"

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    tasks = load_tasks_from_json(tasks_path)
    runs = load_runs_jsonl(runs_path)

    task_scores, model_aggs = score_all_models(tasks, runs)

    out = {
        "model_aggregates": [
            {
                "model_name": m.model_name,
                "normalized_score": m.normalized_score,
                "by_tier": m.by_tier,
                "by_difficulty": m.by_difficulty,
            }
            for m in model_aggs
        ],
        "task_scores": [
            {
                "task_id": ts.task_id,
                "model_name": ts.model_name,
                "tier": ts.tier,
                "difficulty": ts.difficulty,
                "components": ts.component_scores.__dict__,
                "base_score": ts.base_score,
                "multiplier": ts.multiplier,
                "final_weighted_score": ts.final_weighted_score,
                "per_run_base_scores": ts.per_run_base_scores,
            }
            for ts in task_scores
        ],
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"Saved results -> {out_path}")


if __name__ == "__main__":
    main()