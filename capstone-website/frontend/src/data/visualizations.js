// Manifest of all v2 visualizations.
// PNG files served from /visualizations/png/v2/
// Source files referenced relative to repo root (experiments/results_v2/*).

export const VIZ_CATEGORIES = [
  { id: 'rankings',      label: 'The Three Rankings', subtitle: 'Hero — accuracy, robustness, calibration', color: '#00FFE0' },
  { id: 'judge',         label: 'Judge Validation',   subtitle: 'RQ1 PRIMARY · 25% pass-flip · α = 0.55',   color: '#00B4D8' },
  { id: 'robustness',    label: 'Robustness',         subtitle: 'RQ4 · Perturbation analysis',              color: '#4A90D9' },
  { id: 'errors',        label: 'Error Taxonomy',     subtitle: 'RQ3 · 46.9% assumption violations',        color: '#A78BFA' },
  { id: 'calibration',   label: 'Calibration',        subtitle: 'RQ5 · Hedge-heavy vs overconfident',       color: '#7FFFD4' },
  { id: 'tasks',         label: 'Task Breakdown',     subtitle: 'RQ2 · REGRESSION cluster ~0.30',           color: '#FFB347' },
]

export const VISUALIZATIONS = [
  // ── 1. THREE RANKINGS (hero) ──────────────────────────────────
  {
    id: 'three_rankings', category: 'rankings', featured: true,
    title: 'The Three Rankings',
    subtitle: 'Accuracy ≠ Robustness ≠ Calibration',
    caption: 'Side-by-side rankings of all 5 models on three orthogonal lenses — single-metric leaderboards mislead.',
    source: 'experiments/results_v2/bootstrap_ci.json + robustness_v2.json + calibration.json',
    png: '/visualizations/png/v2/three_rankings.png',
  },
  {
    id: 'a6_aggregate_ranking', category: 'rankings',
    title: 'Aggregate Score Ranking',
    subtitle: 'Composite of accuracy + robustness + reasoning',
    caption: 'Composite ranking with bootstrap-derived bars. Top-2 overlap on accuracy.',
    source: 'experiments/results_v2/bootstrap_ci.json',
    png: '/visualizations/png/v2/a6_aggregate_ranking.png',
  },
  {
    id: 'bootstrap_ci', category: 'rankings',
    title: 'Bootstrap CI on Accuracy',
    subtitle: 'Claude 0.679 [0.655, 0.702] · Gemini 0.674 [0.647, 0.700]',
    caption: '10 000 bootstrap resamples per model. Top-2 not statistically separable.',
    source: 'experiments/results_v2/bootstrap_ci.json',
    png: '/visualizations/png/v2/bootstrap_ci.png',
  },

  // ── 2. JUDGE VALIDATION (RQ1 PRIMARY) ─────────────────────────
  {
    id: 'agreement_metrics', category: 'judge', featured: true,
    title: 'Agreement Metrics — Keyword vs External Judge',
    subtitle: 'Krippendorff α = 0.55 · Spearman ρ = 0.59',
    caption: 'Both metrics agree: keyword and Llama judge are not interchangeable raters on assumption_compliance.',
    source: 'experiments/results_v2/krippendorff_agreement.json + keyword_vs_judge_agreement.json',
    png: '/visualizations/png/v2/agreement_metrics_comparison.png',
  },
  {
    id: 'judge_scatter', category: 'judge',
    title: 'Judge vs Keyword — Per-Run Scatter',
    subtitle: '274 / 1094 runs flip pass/fail',
    caption: 'Each point is a single run scored by both raters. Off-diagonal mass = the 25% pass-flip headline.',
    source: 'experiments/results_v2/keyword_vs_judge_agreement.json',
    png: '/visualizations/png/v2/judge_validation_scatter.png',
  },
  {
    id: 'judge_by_model', category: 'judge',
    title: 'Judge vs Keyword — Per Model',
    subtitle: 'Pass-flip rate decomposed by model family',
    caption: 'All 5 models show the keyword overstatement; magnitude varies. Highest disagreement on REGRESSION cluster.',
    source: 'experiments/results_v2/keyword_vs_judge_agreement.json',
    png: '/visualizations/png/v2/judge_validation_by_model.png',
  },

  // ── 3. ROBUSTNESS (RQ4) ───────────────────────────────────────
  {
    id: 'robustness_heatmap', category: 'robustness', featured: true,
    title: 'Robustness Heatmap',
    subtitle: 'Δ (perturbed − base) per model × task type',
    caption: 'Three uniformly-robust types: HIERARCHICAL, RJMCMC, VB. Mistral degrades most.',
    source: 'experiments/results_v2/robustness_v2.json',
    png: '/visualizations/png/v2/robustness_heatmap.png',
  },
  {
    id: 'robustness_perttype', category: 'robustness',
    title: 'Robustness by Perturbation Type',
    subtitle: 'rephrase / numerical / semantic',
    caption: 'Semantic reframings drive the largest score drops, not numerical changes.',
    source: 'experiments/results_v2/robustness_v2.json',
    png: '/visualizations/png/v2/a4_robustness_by_perttype.png',
  },

  // ── 4. ERROR TAXONOMY (RQ3) ──────────────────────────────────
  {
    id: 'taxonomy_sunburst', category: 'errors', featured: true,
    title: 'Error Taxonomy — Hierarchical',
    subtitle: 'L1 buckets × L2 codes · 143 base failures',
    caption: 'ASSUMPTION_VIOLATION 67 · MATHEMATICAL_ERROR 48 · FORMATTING 18 · CONCEPTUAL 10 · HALLUCINATION 0.',
    source: 'experiments/results_v2/error_taxonomy_v2.json',
    png: '/visualizations/png/v2/error_taxonomy_hierarchical.png',
  },
  {
    id: 'failure_by_tasktype', category: 'errors',
    title: 'Failure Rate by Task Type',
    subtitle: 'Where each task type ranks for failure share',
    caption: 'REGRESSION dominates. Markov chain types follow.',
    source: 'experiments/results_v2/error_taxonomy_v2.json',
    png: '/visualizations/png/v2/a1_failure_by_tasktype.png',
  },
  {
    id: 'failure_heatmap', category: 'errors',
    title: 'Failure Heatmap (Model × Task Type)',
    subtitle: 'Where each model misses',
    caption: 'Per-model breakdown — REGRESSION, BAYES_FACTOR, MCMC tasks remain hard for every model.',
    source: 'experiments/results_v2/error_taxonomy_v2.json',
    png: '/visualizations/png/v2/a3_failure_heatmap.png',
  },

  // ── 5. CALIBRATION (RQ5) ─────────────────────────────────────
  {
    id: 'calibration_reliability', category: 'calibration', featured: true,
    title: 'Calibration Reliability — Verbalized',
    subtitle: '3-bucket ECE (0.3 / 0.5 / 0.6) · empty 0.9 bucket',
    caption: 'Hedge-heavy default-to-medium behaviour. No high-confidence records across any model.',
    source: 'experiments/results_v2/calibration.json',
    png: '/visualizations/png/v2/calibration_reliability.png',
  },
  {
    id: 'calibration_a5', category: 'calibration',
    title: 'Calibration — Per-Model Reliability',
    subtitle: 'Per-model ECE breakdown',
    caption: 'All five models cluster around medium-confidence — none escape into well-calibrated high-bucket.',
    source: 'experiments/results_v2/calibration.json',
    png: '/visualizations/png/v2/a5_calibration_reliability.png',
  },
  {
    id: 'self_consistency', category: 'calibration',
    title: 'Self-Consistency Calibration (B3 proxy)',
    subtitle: 'Agreement-rate as confidence — top-failure stratum',
    caption: 'Reveals overconfidence on hard tasks that verbalized extraction missed.',
    source: 'experiments/results_v2/self_consistency_calibration.json',
    png: '/visualizations/png/v2/self_consistency_calibration.png',
  },

  // ── 6. TASK BREAKDOWN (RQ2) ──────────────────────────────────
  {
    id: 'accuracy_by_category', category: 'tasks', featured: true,
    title: 'Accuracy by Bayesian Category',
    subtitle: 'REGRESSION cluster ~0.30 across all 5 models',
    caption: 'Hardest categories: REGRESSION, MCMC, ADVANCED. Easiest: closed-form conjugate models.',
    source: 'experiments/results_v2/bootstrap_ci.json + tasks_all.json',
    png: '/visualizations/png/v2/a2_accuracy_by_category.png',
  },
]

export const FEATURED_IDS = VISUALIZATIONS.filter(v => v.featured).map(v => v.id)
