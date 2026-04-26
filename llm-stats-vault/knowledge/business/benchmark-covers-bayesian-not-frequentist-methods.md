---
tags: [business, scope, bayesian, frequentist, benchmark]
date: 2026-04-26
---

# Benchmark Covers Bayesian Reasoning, Not Frequentist Methods

## Scope
The benchmark focuses on **Bayesian inferential reasoning**: posterior computation, conjugate models, credible intervals, Bayes factors, decision theory under uncertainty, and advanced computational Bayes methods.

## In Scope (171 tasks)

### Phase 1 — Closed-Form Bayesian (136 tasks, 31 types)
- Conjugate model posteriors: Beta-Binomial, Gamma-Poisson, Normal-Normal, Normal-Gamma, Dirichlet-Multinomial
- Bayesian estimators: MAP, Bayes risk, MMSE, Minimax
- Credible intervals (equal-tail + HPD)
- Bayes factors and log marginal likelihood
- Decision theory: asymmetric loss, minimax
- Calibration tasks: confidence calibration (RQ5)
- Conceptual understanding tasks (rubric-scored)

### Phase 2 — Computational Bayes (35 tasks, 7 types)
- GIBBS, MH, HMC, RJMCMC, VB, ABC, HIERARCHICAL
- MCMC methods used as **ground-truth solvers**, not as what LLMs implement

### Frequentist Concepts (included as supporting content)
- Fisher information, Rao-Cramér bound, MLE efficiency
- Order statistics, regression basics
- Box-Müller sampling, Markov chains
- These appear in Phase 1 as complementary task types — NOT primary focus

## Out of Scope
- LLMs running actual MCMC chains (can't execute code in text benchmark)
- Neural network statistical methods
- Nonparametric inference (beyond basic order statistics)

## Source of Truth
`bayesian_scope.md` in project root — authoritative scope document.

## Task Type Breakdown
- **38 total task types** (31 Phase 1 + 7 Phase 2)
- **171 total tasks**: 126 numeric, 10 conceptual, 35 computational Bayes

## Related
- [[five-research-questions-define-benchmark-scope]] — what's measured
- [[mcmc-is-baseline-solver-not-benchmark-target]] — the MCMC boundary
- [[adding-a-new-task-type-requires-4-changes]] — expanding scope
