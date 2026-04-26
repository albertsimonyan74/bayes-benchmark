# Bayesian Benchmark Scope (Updated)

The benchmark covers two phases: Phase 1 (analytical conjugate models, closed-form posteriors) and Phase 2 (computational Bayesian methods). Both phases are formally included in the core benchmark as of April 2026.

## Core Benchmark Scope (Phase 1 + Phase 2)

### Phase 1 — 136 tasks, 31 task types (Complete)

## Core Bayesian Inference (Closed-Form Conjugate Models)

### 1) Beta–Binomial Model
- Prior: Beta(α, β)
- Likelihood: Binomial(n, p)
- Posterior: Beta(α + x, β + n − x)
- Evaluation:
  - Posterior mean/variance
  - 95% credible interval
  - Posterior predictive probability

### 2) Gamma–Poisson Model
- Prior: Gamma(α, β)
- Likelihood: Poisson(λ)
- Posterior: Gamma(α + Σx, β + n)
- Evaluation:
  - Posterior mean
  - Credible interval
  - Posterior predictive distribution

### 3) Normal Mean (Known Variance)
- Prior: Normal(μ₀, τ₀²)
- Likelihood: Normal(μ, σ² known)
- Posterior: Normal(μₙ, τₙ²)
- Evaluation:
  - Posterior mean/variance
  - 95% credible interval
  - Sequential updating behavior

### 4) Normal Mean and Variance (Unknown σ²)
- Prior: Normal–Inverse-Gamma (conjugate)
- Likelihood: Normal
- Posterior: Normal–Inverse-Gamma
- Evaluation:
  - Marginal posterior for mean
  - Marginal posterior for variance
  - Credible intervals

### 5) Dirichlet–Multinomial Model
- Prior: Dirichlet(α₁, …, α_K)
- Likelihood: Multinomial(n, p₁,…,p_K)
- Posterior: Dirichlet(α₁ + x₁, …, α_K + x_K)
- Evaluation:
  - Posterior mean vector
  - Posterior concentration interpretation
  - Predictive probabilities (where applicable)

### 6) Bayesian Linear Regression (Closed Form)
- Prior: Normal prior on coefficients
- Likelihood: Gaussian linear model
- Posterior:
  - Posterior mean of coefficients
  - Posterior covariance matrix
- Evaluation:
  - Posterior predictive mean
  - Interpretation of coefficient uncertainty

## Bayesian Decision Theory (Included)
A limited set of tasks evaluates:
- Bayes estimators under loss functions:
  - Quadratic loss → posterior mean
  - Absolute loss → posterior median (when tractable)
  - 0–1 loss (limit) → posterior mode
- Risk/MSE comparison of competing estimators
- Optimal estimator constants derived by minimizing risk

## Prior Sensitivity and Improper Priors (Included)
A limited set of tasks evaluates:
- Prior influence on posterior (sensitivity)
- Validity conditions for improper priors (conceptual + correctness)
- Correct posterior derivation under “flat” priors where appropriate

## Simulation-Based Stress Tests (Included, Limited)
A small set of stress-test tasks evaluates correct reasoning for simulation methods such as:
- Uniform → Normal via Box–Muller
- Uniform → Exponential via inverse transform
These tasks are not part of core Bayesian inference scoring and are treated as stress tests.

---

### Phase 2 — 35 tasks, 7 task types (Extended Computational Methods)

Formally included in the core benchmark as of April 2026.

| Task Type    | Method                           | Tasks | Tolerance |
|--------------|----------------------------------|-------|-----------|
| GIBBS        | Gibbs Sampling                   | 5     | 0.05      |
| MH           | Metropolis–Hastings              | 5     | 0.05      |
| HMC          | Hamiltonian Monte Carlo          | 5     | 0.05      |
| RJMCMC       | Reversible Jump MCMC             | 5     | 0.05      |
| VB           | Variational Bayes                | 5     | 0.10      |
| ABC          | Approximate Bayesian Computation | 5     | 0.10      |
| HIERARCHICAL | Hierarchical Bayesian Models     | 5     | 0.05      |

Total benchmark: 171 tasks across 38 task types.
Stochastic methods use wider tolerances (0.05–0.10) vs deterministic (1e-6–0.05).
All Phase 2 ground truth values computed with `numpy` random seed 42.