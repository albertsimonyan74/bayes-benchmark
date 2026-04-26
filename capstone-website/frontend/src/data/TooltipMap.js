// Structured tooltip definitions for all 71 numeric answer keys across 38 task types (incl. Phase 2).
// Each entry: { label, formula, definition }

export const TOOLTIP_MAP = {

  // ─── Beta-Binomial / Conjugate core ───────────────────────────────────────
  posterior_mean: {
    label: 'Posterior Mean',
    formula: 'E[θ|data] = α_post / (α_post + β_post)',
    definition: 'Expected value of θ under the posterior distribution. For Beta(α,β): mean = α/(α+β). Optimal point estimator under squared error loss.',
  },
  ci_lower: {
    label: 'Credible Interval Lower Bound',
    formula: 'P(θ ≥ ci_lower | data) = 0.975',
    definition: 'Lower bound of the 95% equal-tailed credible interval. There is 97.5% posterior probability that θ exceeds this value.',
  },
  ci_upper: {
    label: 'Credible Interval Upper Bound',
    formula: 'P(θ ≤ ci_upper | data) = 0.975',
    definition: 'Upper bound of the 95% equal-tailed credible interval. There is 97.5% posterior probability that θ is below this value.',
  },
  predictive_pmf_k_m: {
    label: 'Beta-Binomial Predictive PMF',
    formula: 'P(X_new = k | data) = ∫ Binom(k;m,θ) Beta(α,β) dθ',
    definition: 'Posterior predictive probability of k successes in m new trials, marginalised over the posterior Beta distribution.',
  },
  predictive_pmf_y: {
    label: 'Gamma-Poisson Predictive PMF',
    formula: 'P(Y_new = y | data) = NegBin(y; α_post, β_post/(β_post+1))',
    definition: 'Posterior predictive probability of count y under the Negative Binomial (Gamma-Poisson) predictive distribution.',
  },

  // ─── Prior / posterior parameters ─────────────────────────────────────────
  alpha: {
    label: 'Prior Shape α',
    formula: 'Beta(α, β) or Gamma(α, β)',
    definition: 'Shape parameter α of the Beta or Gamma prior distribution. Controls skewness and concentration near 1 (Beta) or large values (Gamma).',
  },
  beta: {
    label: 'Prior Shape/Rate β',
    formula: 'Beta(α, β) or Gamma(α, β)',
    definition: 'Shape parameter β of the Beta prior, or rate parameter β of the Gamma prior. For Beta: controls probability mass near 0.',
  },
  alpha_post: {
    label: 'Posterior α',
    formula: 'α_post = α_prior + successes (or x + 0.5 for Jeffreys)',
    definition: 'Updated posterior shape parameter α after observing data. Posterior is Beta(α_post, β_post) for the Beta-Binomial conjugate model.',
  },
  beta_post: {
    label: 'Posterior β',
    formula: 'β_post = β_prior + failures (or n − x + 0.5 for Jeffreys)',
    definition: 'Updated posterior shape parameter β after observing data. Encodes information from observed failures/non-events.',
  },

  // ─── Normal-Gamma / conjugate Normal ──────────────────────────────────────
  posterior_mean_mu: {
    label: 'Posterior Mean of μ',
    formula: 'μ_n = (κ₀μ₀ + nȳ) / (κ₀ + n)',
    definition: 'Posterior mean of μ in the Normal-Gamma conjugate model. Weighted average of prior mean μ₀ and sample mean ȳ, weighted by pseudo-count κ₀ and sample size n.',
  },
  posterior_mean_tau: {
    label: 'Posterior Mean of Precision τ',
    formula: 'E[τ|data] = α_n / β_n',
    definition: 'Posterior mean of the precision τ = 1/σ² in the Normal-Gamma conjugate model.',
  },
  posterior_median: {
    label: 'Posterior Median',
    formula: 'm : P(θ ≤ m | data) = 0.5',
    definition: 'The value m such that exactly half the posterior probability mass lies below m. Optimal estimator under absolute error loss.',
  },

  // ─── HPD intervals ─────────────────────────────────────────────────────────
  hpd_lower: {
    label: 'HPD Lower Bound',
    formula: 'argmin_{[l,u]: P(l≤θ≤u|data)=0.95} (u − l)',
    definition: 'Lower bound of the Highest Posterior Density (HPD) interval — the shortest interval containing 95% of posterior probability mass.',
  },
  hpd_upper: {
    label: 'HPD Upper Bound',
    formula: '[hpd_lower, hpd_upper] minimises interval length',
    definition: 'Upper bound of the HPD interval. For unimodal symmetric posteriors, HPD equals the equal-tailed interval.',
  },

  // ─── CI vs Credible ────────────────────────────────────────────────────────
  freq_lower: {
    label: 'Frequentist CI Lower',
    formula: 'x̄ − z₀.₀₂₅ · σ/√n',
    definition: 'Lower bound of the frequentist 95% confidence interval. Interpretation: 95% of such intervals (over repeated sampling) contain the true θ.',
  },
  freq_upper: {
    label: 'Frequentist CI Upper',
    formula: 'x̄ + z₀.₀₂₅ · σ/√n',
    definition: 'Upper bound of the frequentist 95% confidence interval.',
  },
  bayes_lower: {
    label: 'Bayesian Credible Interval Lower',
    formula: 'P(θ ≥ bayes_lower | data) = 0.975',
    definition: 'Lower bound of the 95% Bayesian credible interval. There is 95% posterior probability that θ ∈ [bayes_lower, bayes_upper].',
  },
  bayes_upper: {
    label: 'Bayesian Credible Interval Upper',
    formula: 'P(θ ≤ bayes_upper | data) = 0.975',
    definition: 'Upper bound of the 95% Bayesian credible interval.',
  },
  ci_mu_lower: {
    label: 'Credible Interval Lower for μ',
    formula: 'Student-t₂ₐₙ quantile on μ|data',
    definition: 'Lower bound of the 95% marginal credible interval for μ in the Normal-Gamma model, via the Student-t marginal distribution.',
  },
  ci_mu_upper: {
    label: 'Credible Interval Upper for μ',
    formula: 'Student-t₂ₐₙ quantile on μ|data',
    definition: 'Upper bound of the 95% marginal credible interval for μ in the Normal-Gamma model.',
  },

  // ─── Bayes Factor / Log Marginal Likelihood ────────────────────────────────
  log_BF: {
    label: 'Log Bayes Factor',
    formula: 'ln BF₁₂ = log P(data|M₁) − log P(data|M₂)',
    definition: 'Natural log of the Bayes Factor. log BF > 1.1: positive evidence; > 3: strong; > 5: very strong evidence for M₁ over M₂.',
  },
  BF: {
    label: 'Bayes Factor',
    formula: 'BF₁₂ = P(data|M₁) / P(data|M₂)',
    definition: 'Ratio of marginal likelihoods. BF > 10: strong evidence for M₁. BF < 0.1: strong evidence for M₂. BF ≈ 1: no discriminating power.',
  },
  log_ml: {
    label: 'Log Marginal Likelihood',
    formula: 'log P(data|M) = log ∫ P(data|θ) P(θ) dθ',
    definition: 'Log normalising constant of the posterior. For conjugate models, has a closed form. Used to compute Bayes factors and model selection criteria.',
  },

  // ─── MLE / MAP ─────────────────────────────────────────────────────────────
  mle: {
    label: 'Maximum Likelihood Estimate',
    formula: 'θ̂_MLE = argmax_θ P(data|θ)',
    definition: 'Value of θ that maximises the likelihood. For Binomial: MLE = x/n. For Poisson: MLE = x̄.',
  },
  mle_theta: {
    label: 'MLE of θ (Uniform)',
    formula: 'θ̂_MLE = max(X₁, …, Xₙ) = X_(n)',
    definition: 'MLE of the upper bound θ for Uniform(0,θ). Equals the largest order statistic. Biased downward: E[X_(n)] = nθ/(n+1).',
  },
  map: {
    label: 'Maximum A Posteriori Estimate',
    formula: 'θ̂_MAP = argmax_θ P(θ|data)',
    definition: 'Value of θ that maximises the posterior density. For Beta-Binomial: MAP = (α+x−1)/(α+β+n−2). Optimal under 0-1 loss.',
  },
  shrinkage: {
    label: 'Shrinkage',
    formula: 'shrinkage = (MLE − MAP) / (MLE − prior_mean)',
    definition: 'How much the MAP estimate is pulled toward the prior mean relative to the MLE. Values near 1 = strong prior dominance; near 0 = data dominates.',
  },

  // ─── Bayes Risk ────────────────────────────────────────────────────────────
  bayes_risk: {
    label: 'Bayes Risk',
    formula: 'B(δ) = Σᵢ R(δ, θᵢ) · π(θᵢ)',
    definition: 'Prior-weighted expected loss of estimator δ. Minimised by the Bayes estimator. Under squared error loss, Bayes estimator = posterior mean.',
  },

  // ─── Fisher Information / Rao-Cramér ──────────────────────────────────────
  fisher_info: {
    label: 'Fisher Information',
    formula: 'I(θ) = E[(∂/∂θ log f(X;θ))²] = −E[∂²/∂θ² log f]',
    definition: 'Measures how much data X informs us about θ. For Binomial(n,θ): I(θ) = n/[θ(1−θ)]. Appears in Rao-Cramér lower bound.',
  },
  rc_bound: {
    label: 'Rao-Cramér Lower Bound',
    formula: 'Var(θ̂) ≥ (1 + b\'(θ))² / I(θ)',
    definition: 'Minimum achievable variance for any (possibly biased) estimator. For unbiased θ̂: RC = 1/I(θ). An efficient estimator achieves this bound.',
  },
  efficiency_ratio: {
    label: 'Efficiency Ratio',
    formula: 'efficiency = Var(θ̂) / RC_bound',
    definition: 'Ratio of estimator variance to the Rao-Cramér lower bound. Value ≈ 1.0 confirms the estimator is efficient. Values > 1 indicate inefficiency.',
  },
  is_efficient: {
    label: 'Is Efficient?',
    formula: 'is_efficient = 1 iff Var(θ̂) = RC_bound',
    definition: 'Boolean (1/0) indicating whether the estimator achieves the Rao-Cramér lower bound and is thus asymptotically optimal.',
  },

  // ─── Order Statistics ──────────────────────────────────────────────────────
  order_stat_pdf: {
    label: 'Order Statistic Density',
    formula: 'f_(k)(y) = n!/[(k−1)!(n−k)!] F(y)^(k−1) [1−F(y)]^(n−k) f(y)',
    definition: 'Density of the k-th order statistic X_(k). For Uniform[0,1]: X_(k) ~ Beta(k, n−k+1).',
  },
  min_cdf: {
    label: 'Minimum CDF',
    formula: 'F_(1)(x) = 1 − [1 − F(x)]ⁿ',
    definition: 'CDF of the minimum order statistic X_(1). For Uniform[0,1]: F_(1)(x) = 1 − (1−x)ⁿ.',
  },

  // ─── Range Distribution ────────────────────────────────────────────────────
  range_beta_alpha: {
    label: 'Range Distribution α',
    formula: 'R = X_(n) − X_(1) ~ Beta(n−1, 2) for Uniform[0,1]',
    definition: 'α parameter of the Beta distribution of the sample range R. For Uniform[0,1]: α = n−1.',
  },
  range_beta_beta: {
    label: 'Range Distribution β',
    formula: 'R ~ Beta(n−1, 2)',
    definition: 'β parameter of the Beta distribution of the range R. For Uniform[0,1]: β = 2 (constant regardless of n).',
  },

  // ─── OLS Regression ────────────────────────────────────────────────────────
  A_hat: {
    label: 'OLS Intercept Â',
    formula: 'Â = ȳ − B̂ · x̄',
    definition: 'OLS intercept estimate. Predicted y-value when x = 0. Shifts the regression line vertically.',
  },
  B_hat: {
    label: 'OLS Slope B̂',
    formula: 'B̂ = Sxy / Sxx, where Sxy = Σ(xᵢ−x̄)(yᵢ−ȳ)',
    definition: 'OLS slope estimate. Expected change in y per unit increase in x. Minimises sum of squared residuals.',
  },
  s2: {
    label: 'Residual Variance s²',
    formula: 's² = Σ(yᵢ − ŷᵢ)² / (n − 2)',
    definition: 'Unbiased estimate of σ² in OLS. Divides by n−2 (degrees of freedom lost for slope and intercept).',
  },
  intercept_post: {
    label: 'Posterior Intercept (Bayesian Regression)',
    formula: 'E[α | data] under Normal-Inverse-Gamma prior',
    definition: 'Posterior mean of the regression intercept under the Normal-Inverse-Gamma conjugate prior for Bayesian linear regression.',
  },
  slope_post: {
    label: 'Posterior Slope (Bayesian Regression)',
    formula: 'E[β | data] under Normal-Inverse-Gamma prior',
    definition: 'Posterior mean of the regression slope under the Normal-Inverse-Gamma conjugate prior. Shrinks toward prior mean vs OLS estimate.',
  },
  B_lower: {
    label: 'Slope Credible Interval Lower',
    formula: 'P(β ≥ B_lower | data) = 0.975',
    definition: 'Lower bound of the 95% posterior credible interval for regression slope β.',
  },
  B_upper: {
    label: 'Slope Credible Interval Upper',
    formula: 'P(β ≤ B_upper | data) = 0.975',
    definition: 'Upper bound of the 95% posterior credible interval for regression slope β.',
  },

  // ─── Markov Chains ─────────────────────────────────────────────────────────
  pi_0: {
    label: 'Stationary Probability π₀',
    formula: 'π·P = π, Σπᵢ = 1 → solve for π₀',
    definition: 'Long-run fraction of time the chain spends in state 0. Satisfies the balance equations π·P = π.',
  },
  pi_1: {
    label: 'Stationary Probability π₁',
    formula: 'π·P = π, Σπᵢ = 1 → solve for π₁',
    definition: 'Long-run fraction of time the chain spends in state 1.',
  },
  pi_2: {
    label: 'Stationary Probability π₂',
    formula: 'π·P = π, Σπᵢ = 1 → solve for π₂',
    definition: 'Long-run fraction of time the chain spends in state 2.',
  },
  pi_3: {
    label: 'Stationary Probability π₃',
    formula: 'π·P = π, Σπᵢ = 1 → solve for π₃',
    definition: 'Long-run fraction of time the chain spends in state 3.',
  },
  P2_1_2: {
    label: '2-Step Transition P²(1→2)',
    formula: 'P²(1,2) = (P · P)[1][2]',
    definition: 'Two-step transition probability from state 1 to state 2. Computed via matrix multiplication: (P²)₁₂.',
  },

  // ─── Gambler's Ruin ────────────────────────────────────────────────────────
  ruin_prob: {
    label: "Gambler's Ruin Probability",
    formula: 'P(ruin | i) = (M−i)/M for fair game (p = 0.5)',
    definition: "Probability of reaching 0 (ruin) before M, starting at fortune i. For biased game: P(ruin|i) = [1−(q/p)^i] / [1−(q/p)^M].",
  },
  win_prob: {
    label: "Win Probability",
    formula: 'P(win | i) = 1 − ruin_prob(i)',
    definition: "Probability of reaching fortune M before going broke, starting at i. Complement of the ruin probability.",
  },

  // ─── Posterior Predictive Check ────────────────────────────────────────────
  p_value: {
    label: 'Bayesian p-value',
    formula: 'ppp = P(T(y_rep) ≥ T(y_obs) | y_obs)',
    definition: 'Posterior predictive p-value. Values near 0.5 indicate good model fit. Values near 0 or 1 suggest model misspecification.',
  },
  passed: {
    label: 'PPC Passed',
    formula: 'passed = 1 iff p_value ∈ [0.05, 0.95]',
    definition: 'Boolean (1/0) indicating whether the Bayesian p-value falls in the non-extreme range, indicating adequate model fit.',
  },

  // ─── MSE / Bias-Variance ───────────────────────────────────────────────────
  mse_d1: {
    label: 'MSE of δ₁',
    formula: 'MSE(δ₁) = Bias²(δ₁) + Var(δ₁)',
    definition: 'Mean squared error of estimator δ₁, decomposed as bias squared plus variance. Lower is better.',
  },
  mse_d2: {
    label: 'MSE of δ₂',
    formula: 'MSE(δ₂) = Bias²(δ₂) + Var(δ₂)',
    definition: 'Mean squared error of estimator δ₂.',
  },
  mse_dc: {
    label: 'MSE of δ_c (composite)',
    formula: 'MSE(δ_c) = Bias²(δ_c) + Var(δ_c)',
    definition: 'MSE of a combined or composite estimator δ_c, often a shrinkage combination of δ₁ and δ₂.',
  },
  mse_opt: {
    label: 'Optimal MSE (Scaled Uniform)',
    formula: 'MSE_opt = θ² / (n+1)² (achieved by c_opt)',
    definition: 'Minimum achievable MSE for a scaled estimator c·X_(n) of Uniform(0,θ). Achieved by c_opt = (n+2)/(n+1).',
  },
  bias: {
    label: 'Estimator Bias',
    formula: 'Bias(θ̂) = E[θ̂] − θ',
    definition: 'Systematic deviation of the estimator from the true parameter. Positive bias = overestimation; negative = underestimation.',
  },
  var_d2: {
    label: 'Variance of δ₂',
    formula: 'Var(δ₂) = E[(δ₂ − E[δ₂])²]',
    definition: 'Variance of estimator δ₂ across repeated samples. Measures estimation instability.',
  },

  // ─── Optimal Scaled Estimator ──────────────────────────────────────────────
  c_opt: {
    label: 'Optimal Scaling Constant c*',
    formula: 'c* = (n+2) / (n+1)',
    definition: 'Optimal constant c minimising MSE of c·X_(n) for Uniform(0,θ). The estimator c*·X_(n) is inadmissible under certain loss functions but has lower MSE than the MLE.',
  },

  // ─── Minimax ───────────────────────────────────────────────────────────────
  minimax_value: {
    label: 'Minimax Risk',
    formula: 'min_δ max_θ R(θ, δ)',
    definition: 'The minimum over all estimators of the worst-case risk. The minimax estimator achieves this value, providing the best worst-case guarantee.',
  },
  max_risk_hat1: {
    label: 'Max Risk of δ̂₁',
    formula: 'max_θ R(θ, δ̂₁)',
    definition: 'Maximum risk of estimator δ̂₁ over all possible parameter values. Determines if δ̂₁ is minimax.',
  },
  max_risk_hat2: {
    label: 'Max Risk of δ̂₂',
    formula: 'max_θ R(θ, δ̂₂)',
    definition: 'Maximum risk of estimator δ̂₂. Compared to max_risk_hat1 to identify the minimax estimator.',
  },

  // ─── Dirichlet-Multinomial ─────────────────────────────────────────────────
  p1_mean: {
    label: 'Posterior Mean p₁',
    formula: 'E[p₁|data] = (α₁ + n₁) / Σ(αᵢ + nᵢ)',
    definition: 'Posterior mean of category-1 probability in the Dirichlet-Multinomial model. Smoothed estimate combining prior α₁ and observed count n₁.',
  },
  p2_mean: {
    label: 'Posterior Mean p₂',
    formula: 'E[p₂|data] = (α₂ + n₂) / Σ(αᵢ + nᵢ)',
    definition: 'Posterior mean of category-2 probability in the Dirichlet-Multinomial model.',
  },
  p3_mean: {
    label: 'Posterior Mean p₃',
    formula: 'E[p₃|data] = (α₃ + n₃) / Σ(αᵢ + nᵢ)',
    definition: 'Posterior mean of category-3 probability in the Dirichlet-Multinomial model.',
  },
  predictive_pmf_counts: {
    label: 'Dirichlet-Multinomial Predictive PMF',
    formula: 'P(c₁,c₂,c₃ | α_post) via compound Dirichlet',
    definition: 'Probability of observing new counts (c₁,c₂,c₃) under the Dirichlet-Multinomial posterior predictive distribution.',
  },

  // ─── Normal-Gamma auxiliary ────────────────────────────────────────────────
  x1: {
    label: 'Auxiliary Quantity x₁',
    formula: '(context-specific)',
    definition: 'First auxiliary computed quantity. Context-specific; often a posterior parameter, precision, or intermediate normalising value in the Normal-Gamma model.',
  },
  x2: {
    label: 'Auxiliary Quantity x₂',
    formula: '(context-specific)',
    definition: 'Second auxiliary computed quantity. Context-specific; used to verify intermediate steps or secondary posterior parameters.',
  },

  // ─── Box-Muller ────────────────────────────────────────────────────────────
  z1: {
    label: 'Box-Muller Z₁',
    formula: 'Z₁ = √(−2 ln U) · cos(2πV)',
    definition: 'First standard normal sample from the Box-Muller transform, where U, V ~ Uniform(0,1) independently. Z₁ ~ N(0,1).',
  },
  z2: {
    label: 'Box-Muller Z₂',
    formula: 'Z₂ = √(−2 ln U) · sin(2πV)',
    definition: 'Second standard normal sample from Box-Muller. Z₁ and Z₂ are independent N(0,1). One Uniform pair produces two normals.',
  },

  // ─── Jeffreys ──────────────────────────────────────────────────────────────
  verified: {
    label: 'Verification Passed',
    formula: 'verified = 1 iff analytical = numerical',
    definition: 'Boolean (1/0) confirming that the analytical Jeffreys prior result matches the numerical verification (e.g., invariance under reparametrisation).',
  },

  // ─── Extended conjugate posterior parameters ───────────────────────────────
  posterior_alpha: {
    label: 'Posterior Shape α',
    formula: 'α_post = α_prior + Σ successes',
    definition: 'Updated shape parameter α after conjugate update. Encodes total prior pseudo-counts plus observed successes.',
  },
  posterior_beta: {
    label: 'Posterior Rate/Shape β',
    formula: 'β_post = β_prior + Σ failures (or + n for Gamma-Poisson)',
    definition: 'Updated β parameter after conjugate update. For Beta: encodes failures. For Gamma-Poisson: encodes total observation count.',
  },
  posterior_shape: {
    label: 'Posterior Shape',
    formula: 'α_n = α₀ + n (Gamma-Poisson)',
    definition: 'Posterior shape parameter for the Gamma distribution after observing n Poisson counts.',
  },
  posterior_rate: {
    label: 'Posterior Rate',
    formula: 'β_n = β₀ + Σxᵢ (Gamma-Poisson)',
    definition: 'Posterior rate parameter for the Gamma distribution. Accumulates observed count totals.',
  },
  posterior_mu: {
    label: 'Posterior Mean μₙ',
    formula: 'μₙ = (κ₀μ₀ + nȳ) / (κ₀ + n)',
    definition: 'Updated posterior mean for μ in the Normal conjugate model. Precision-weighted average of prior and data.',
  },
  posterior_kappa: {
    label: 'Posterior Precision Multiplier κₙ',
    formula: 'κₙ = κ₀ + n',
    definition: 'Posterior pseudo-sample-count in the Normal-Gamma model. Grows with data, reflecting increased certainty about μ.',
  },
  posterior_alpha_n: {
    label: 'Posterior αₙ (Normal-Gamma)',
    formula: 'αₙ = α₀ + n/2',
    definition: 'Posterior shape for the precision component in the Normal-Gamma conjugate model.',
  },
  posterior_beta_n: {
    label: 'Posterior βₙ (Normal-Gamma)',
    formula: 'βₙ = β₀ + ½Σ(xᵢ−ȳ)² + κ₀n(ȳ−μ₀)²/[2(κ₀+n)]',
    definition: 'Posterior scale for the precision in the Normal-Gamma model. Absorbs both within-sample variance and prior-data disagreement.',
  },
  p4_mean: {
    label: 'Posterior Mean p₄',
    formula: 'E[p₄|data] = (α₄ + n₄) / Σ(αᵢ + nᵢ)',
    definition: 'Posterior mean of category-4 probability in the Dirichlet-Multinomial model.',
  },
  predictive_pmf_k: {
    label: 'Predictive PMF at k',
    formula: 'P(X_new = k | data)',
    definition: 'Posterior predictive probability of exactly k events/successes in a new observation, marginalised over the posterior.',
  },

  // ─── Bayes estimators ──────────────────────────────────────────────────────
  bayes_estimator_squared: {
    label: 'Bayes Estimator (Squared Loss)',
    formula: 'δ* = E[θ|data] (posterior mean)',
    definition: 'Optimal Bayesian point estimate under squared error loss. Equals the posterior mean. Minimises expected squared deviation.',
  },
  bayes_estimator_absolute: {
    label: 'Bayes Estimator (Absolute Loss)',
    formula: 'δ* = median(θ|data)',
    definition: 'Optimal Bayesian point estimate under absolute error loss. Equals the posterior median.',
  },
  bayes_estimator_01: {
    label: 'Bayes Estimator (0-1 Loss)',
    formula: 'δ* = mode(θ|data) = MAP',
    definition: 'Optimal Bayesian point estimate under 0-1 loss. Equals the posterior mode (MAP estimate). Penalises any error equally.',
  },

  // ─── Log marginal likelihood aliases ──────────────────────────────────────
  log_marginal_likelihood: {
    label: 'Log Marginal Likelihood',
    formula: 'log P(data|M) = log ∫ P(data|θ) P(θ|M) dθ',
    definition: 'Log of the normalising constant of the posterior. Used in Bayes factors for model comparison.',
  },
  bayes_factor: {
    label: 'Bayes Factor',
    formula: 'BF = P(data|M₁) / P(data|M₂)',
    definition: 'Ratio of marginal likelihoods. Quantifies relative evidence for M₁ vs M₂ regardless of prior model probabilities.',
  },
  bf_10: {
    label: 'Bayes Factor BF₁₀',
    formula: 'BF₁₀ = P(data|H₁) / P(data|H₀)',
    definition: 'Bayes Factor favouring H₁ over H₀. BF₁₀ > 10 = strong evidence for H₁; BF₁₀ < 0.1 = strong evidence for H₀.',
  },
  bf_01: {
    label: 'Bayes Factor BF₀₁',
    formula: 'BF₀₁ = 1 / BF₁₀',
    definition: 'Bayes Factor favouring H₀ over H₁. Reciprocal of BF₁₀.',
  },
  log_bf: {
    label: 'Log Bayes Factor',
    formula: 'ln BF = log P(data|M₁) − log P(data|M₂)',
    definition: 'Natural log of the Bayes Factor. Positive = evidence for M₁; negative = evidence for M₂.',
  },
  log_ml_h0: {
    label: 'Log Marginal Likelihood H₀',
    formula: 'log P(data|H₀) = log ∫ P(data|θ) P(θ|H₀) dθ',
    definition: 'Log marginal likelihood under the null hypothesis H₀. Used in Bayes factor computation.',
  },
  log_ml_h1: {
    label: 'Log Marginal Likelihood H₁',
    formula: 'log P(data|H₁) = log ∫ P(data|θ) P(θ|H₁) dθ',
    definition: 'Log marginal likelihood under the alternative hypothesis H₁.',
  },

  // ─── HPD width ─────────────────────────────────────────────────────────────
  hpd_width: {
    label: 'HPD Interval Width',
    formula: 'width = hpd_upper − hpd_lower',
    definition: 'Length of the Highest Posterior Density interval. The HPD is the shortest interval of given credibility; smaller width means more concentrated posterior.',
  },

  // ─── Jeffreys parameters ──────────────────────────────────────────────────
  jeffreys_alpha: {
    label: 'Jeffreys Prior α',
    formula: 'p(θ) ∝ √I(θ) → Beta(0.5, 0.5) for Binomial',
    definition: 'Shape α of the Jeffreys prior Beta distribution for a Binomial model. Always 0.5 — the invariant objective prior.',
  },
  jeffreys_beta: {
    label: 'Jeffreys Prior β',
    formula: 'p(θ) ∝ √I(θ) → Beta(0.5, 0.5) for Binomial',
    definition: 'Shape β of the Jeffreys prior Beta distribution. Always 0.5, equal to α, giving a U-shaped symmetric prior.',
  },
  posterior_mode: {
    label: 'Posterior Mode (MAP)',
    formula: 'mode = argmax_θ p(θ|data)',
    definition: 'Value of θ with the highest posterior density. Equivalent to the MAP estimate. For Beta(α,β): mode = (α−1)/(α+β−2) when α,β > 1.',
  },

  // ─── Markov chain aliases ──────────────────────────────────────────────────
  stationary_prob: {
    label: 'Stationary Probability',
    formula: 'π: π·P = π, Σπᵢ = 1',
    definition: 'Long-run limiting probability of a single state in an ergodic Markov chain. Satisfies the global balance equations.',
  },
  stationary_prob_A: {
    label: 'Stationary Probability of State A',
    formula: 'πA satisfying πP = π',
    definition: 'Fraction of time the chain spends in state A in the long run.',
  },
  stationary_prob_B: {
    label: 'Stationary Probability of State B',
    formula: 'πB satisfying πP = π',
    definition: 'Fraction of time the chain spends in state B in the long run.',
  },
  stationary_prob_C: {
    label: 'Stationary Probability of State C',
    formula: 'πC satisfying πP = π',
    definition: 'Fraction of time the chain spends in state C in the long run.',
  },
  absorption_prob: {
    label: 'Absorption Probability',
    formula: 'P(absorbed at state j | start at i)',
    definition: 'Probability of being absorbed by a specific absorbing state, starting from transient state i.',
  },
  gambler_ruin_prob: {
    label: "Gambler's Ruin Probability",
    formula: 'P(ruin | i, M, p)',
    definition: "Probability of reaching 0 before M starting at fortune i with win probability p.",
  },
  expected_steps: {
    label: 'Expected Steps to Absorption',
    formula: 'E[T | start = i] = (I − Q)⁻¹ · 1',
    definition: 'Expected number of steps until absorption, using the fundamental matrix (I − Q)⁻¹ where Q is the transient sub-matrix.',
  },

  // ─── Fisher / estimation theory aliases ───────────────────────────────────
  fisher_information: {
    label: 'Fisher Information',
    formula: 'I(θ) = −E[∂²/∂θ² log f(X;θ)]',
    definition: 'Curvature of the expected log-likelihood. Governs the Rao-Cramér lower bound on estimator variance.',
  },
  cramer_rao_bound: {
    label: 'Cramér-Rao Lower Bound',
    formula: 'Var(θ̂) ≥ 1 / I(θ)',
    definition: 'Minimum variance achievable by any unbiased estimator. Tighter Fisher information = smaller bound = more informative data.',
  },
  asymptotic_variance: {
    label: 'Asymptotic Variance',
    formula: 'AVar(θ̂_MLE) = 1 / I(θ)',
    definition: 'Large-sample variance of the MLE. The MLE is asymptotically efficient: AVar = Cramér-Rao bound.',
  },
  relative_efficiency: {
    label: 'Relative Efficiency',
    formula: 'eff(θ̂) = Var(UMVUE) / Var(θ̂) ≤ 1',
    definition: 'Ratio comparing estimator variance to the UMVUE or RC bound. Value 1.0 = fully efficient.',
  },
  mse: {
    label: 'Mean Squared Error',
    formula: 'MSE(θ̂) = Bias²(θ̂) + Var(θ̂)',
    definition: 'Overall accuracy measure combining squared bias and variance. The fundamental bias-variance trade-off metric.',
  },
  variance: {
    label: 'Estimator Variance',
    formula: 'Var(θ̂) = E[(θ̂ − E[θ̂])²]',
    definition: 'Spread of the estimator around its mean across repeated samples. One component of MSE.',
  },
  bias_squared: {
    label: 'Squared Bias',
    formula: 'Bias²(θ̂) = (E[θ̂] − θ)²',
    definition: 'Square of the systematic error of the estimator. Combined with variance gives MSE.',
  },
  variance_component: {
    label: 'Variance Component',
    formula: 'Var component of MSE decomposition',
    definition: 'The variance portion of the bias-variance decomposition of MSE.',
  },
  mle_efficiency: {
    label: 'MLE Efficiency',
    formula: 'eff = RC_bound / Var(MLE)',
    definition: 'Ratio of Cramér-Rao lower bound to actual MLE variance. Value ≈ 1.0 confirms asymptotic efficiency.',
  },
  asymptotic_efficiency: {
    label: 'Asymptotic Efficiency',
    formula: 'lim_{n→∞} [1/nI(θ)] / Var(√n(θ̂ − θ))',
    definition: 'Large-sample efficiency of the estimator. MLE achieves asymptotic efficiency = 1 under regularity conditions.',
  },

  // ─── Order statistic aliases ───────────────────────────────────────────────
  expected_range: {
    label: 'Expected Range',
    formula: 'E[R] = E[X_(n) − X_(1)] = (n−1)/(n+1) for Uniform[0,1]',
    definition: 'Expected sample range for n i.i.d. Uniform[0,1] variables. Approaches 1 as n → ∞.',
  },
  range_pdf: {
    label: 'Range PDF',
    formula: 'f_R(r) = n(n−1)r^(n−2)(1−r) for Uniform[0,1]',
    definition: 'Density function of the sample range R = X_(n) − X_(1) for Uniform[0,1] samples.',
  },
  range_cdf: {
    label: 'Range CDF',
    formula: 'F_R(r) = nr^(n-1) − (n-1)r^n for Uniform[0,1]',
    definition: 'CDF of the sample range. Probability that the range does not exceed r.',
  },
  order_stat_mean: {
    label: 'Order Statistic Mean',
    formula: 'E[X_(k)] = k/(n+1) for Uniform[0,1]',
    definition: 'Expected value of the k-th order statistic. For Uniform[0,1]: E[X_(k)] = k/(n+1).',
  },
  order_stat_variance: {
    label: 'Order Statistic Variance',
    formula: 'Var[X_(k)] = k(n−k+1) / [(n+1)²(n+2)]',
    definition: 'Variance of the k-th order statistic for Uniform[0,1] samples.',
  },
  order_stat_median: {
    label: 'Order Statistic Median',
    formula: 'median(X_(k)) ≈ (k − 1/3) / (n + 1/3)',
    definition: 'Approximate median of the k-th order statistic using the Hazen formula.',
  },

  // ─── Regression aliases ────────────────────────────────────────────────────
  regression_intercept: {
    label: 'Regression Intercept',
    formula: 'α̂ = ȳ − β̂x̄',
    definition: 'OLS intercept estimate. Predicted response when the predictor is zero.',
  },
  regression_slope: {
    label: 'Regression Slope',
    formula: 'β̂ = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²',
    definition: 'OLS slope estimate. Change in predicted y per unit change in x.',
  },
  regression_sigma_sq: {
    label: 'Regression Residual Variance σ²',
    formula: 'σ̂² = SSE / (n−2)',
    definition: 'Unbiased estimator of residual variance σ². Used to construct confidence and prediction intervals.',
  },

  // ─── Predictive distribution ───────────────────────────────────────────────
  predictive_mean: {
    label: 'Predictive Mean',
    formula: 'E[Ỹ | data] = E[E[Ỹ|θ,data] | data]',
    definition: 'Expected value of a future observation under the posterior predictive distribution.',
  },
  predictive_variance: {
    label: 'Predictive Variance',
    formula: 'Var[Ỹ|data] = E[Var(Ỹ|θ)|data] + Var[E(Ỹ|θ)|data]',
    definition: 'Total uncertainty in a future observation: within-model variance plus parameter uncertainty.',
  },
  predictive_std: {
    label: 'Predictive Standard Deviation',
    formula: 'std = √Var[Ỹ|data]',
    definition: 'Standard deviation of the posterior predictive distribution. Captures both data variability and posterior uncertainty.',
  },
  posterior_predictive_mean: {
    label: 'Posterior Predictive Mean',
    formula: 'E[x_new | x_obs] = E[θ|x_obs]',
    definition: 'Expected value of a new observation, marginalised over the posterior. Equals posterior mean for location families.',
  },
  posterior_predictive_var: {
    label: 'Posterior Predictive Variance',
    formula: 'Var[x_new | x_obs] = E[σ²|x_obs] + Var[θ|x_obs]',
    definition: 'Variance of a new observation accounting for both sampling noise and parameter uncertainty.',
  },

  // ─── Minimax aliases ───────────────────────────────────────────────────────
  minimax_estimator: {
    label: 'Minimax Estimator',
    formula: 'δ* = argmin_δ max_θ R(θ, δ)',
    definition: 'The estimator achieving the minimax risk. Often a Bayes estimator under a least-favourable prior.',
  },
  minimax_risk: {
    label: 'Minimax Risk',
    formula: 'min_δ max_θ R(θ, δ)',
    definition: 'Worst-case risk of the minimax estimator. Provides the best guarantee without knowing the true θ.',
  },

  // ─── Discrete posterior median ─────────────────────────────────────────────
  disc_median: {
    label: 'Discrete Posterior Median',
    formula: 'inf{m : F(m|data) ≥ 0.5}',
    definition: 'Median of a discrete posterior distribution. The smallest value whose cumulative posterior probability is at least 0.5.',
  },
  beta_median: {
    label: 'Beta Posterior Median',
    formula: 'median ≈ (α − 1/3) / (α + β − 2/3)',
    definition: 'Approximate median of Beta(α,β) using the Abramowitz-Stegun formula. Optimal estimator under absolute loss.',
  },

  // ─── Uniform / scale estimators ───────────────────────────────────────────
  uniform_mle: {
    label: 'Uniform MLE',
    formula: 'θ̂_MLE = X_(n) = max(X₁, …, Xₙ)',
    definition: 'MLE for Uniform(0,θ). Biased downward: E[X_(n)] = nθ/(n+1). Consistent but not unbiased.',
  },
  scale_mle: {
    label: 'Scale MLE',
    formula: 'θ̂ = max(Xᵢ)',
    definition: 'MLE of a scale parameter θ in Uniform(0,θ). Same as uniform_mle.',
  },
  rate_mle: {
    label: 'Rate MLE (Exponential)',
    formula: 'λ̂_MLE = n / Σxᵢ = 1/x̄',
    definition: 'MLE of the rate parameter λ in an Exponential(λ) model. Reciprocal of the sample mean.',
  },
  shape_mle: {
    label: 'Shape MLE',
    formula: 'α̂_MLE (distribution-specific)',
    definition: 'MLE of a shape parameter. For Gamma, requires numerical solution to the digamma equation.',
  },

  // ─── Box-Muller aliases ────────────────────────────────────────────────────
  box_muller_z1: {
    label: 'Box-Muller Z₁',
    formula: 'Z₁ = √(−2 ln U) cos(2πV)',
    definition: 'First standard normal variate from Box-Muller. Given U,V ~ Uniform(0,1): Z₁ ~ N(0,1).',
  },
  box_muller_z2: {
    label: 'Box-Muller Z₂',
    formula: 'Z₂ = √(−2 ln U) sin(2πV)',
    definition: 'Second standard normal variate from Box-Muller. Independent of Z₁. One Uniform pair generates two normals.',
  },

  // ─── Optimal scaled estimator ──────────────────────────────────────────────
  opt_scaled_estimate: {
    label: 'Optimal Scaled Estimate',
    formula: 'δ* = c* · X_(n) = (n+2)/(n+1) · max(Xᵢ)',
    definition: 'The estimator c*·X_(n) that minimises MSE among all scaled estimators of θ in Uniform(0,θ).',
  },
  opt_weight: {
    label: 'Optimal Weight',
    formula: 'c* = (n+2)/(n+1)',
    definition: 'Optimal scaling constant for the sufficient statistic X_(n). Slightly above 1 to correct the downward bias of the MLE.',
  },

  // ─── Credible interval width / bounds ─────────────────────────────────────
  rc_lower: {
    label: 'RC Bound Lower',
    formula: 'θ̂ − z_{α/2} · √(1/I(θ))',
    definition: 'Lower bound of an asymptotic confidence interval based on the Rao-Cramér bound.',
  },
  rc_upper: {
    label: 'RC Bound Upper',
    formula: 'θ̂ + z_{α/2} · √(1/I(θ))',
    definition: 'Upper bound of an asymptotic confidence interval based on the Rao-Cramér bound.',
  },
  rc_width: {
    label: 'RC Bound Width',
    formula: '2 · z_{α/2} · √(1/I(θ))',
    definition: 'Width of the RC-based confidence interval. Proportional to 1/√(nI(θ)) — smaller information = wider interval.',
  },

  // ─── PPC aliases ───────────────────────────────────────────────────────────
  ppc_pvalue: {
    label: 'PPC p-value',
    formula: 'P(T(y_rep) ≥ T(y_obs) | y_obs)',
    definition: 'Posterior predictive p-value. Near 0.5 = good fit; near 0 or 1 = possible misspecification.',
  },
  tail_probability: {
    label: 'Tail Probability',
    formula: 'P(θ > c | data)',
    definition: 'Posterior probability that θ exceeds threshold c. Used for one-sided Bayesian hypothesis tests.',
  },
  test_statistic: {
    label: 'Test Statistic',
    formula: 'T(y) — summary of data departure from H₀',
    definition: 'Summary statistic used in the posterior predictive check. Common choices: mean, variance, min, max, or domain-specific quantities.',
  },

  // ── Phase 2 — Computational Bayes answer keys ──────────────────────────────
  posterior_mean_x: {
    label: 'Posterior Mean (X)',
    formula: 'E[X | data]',
    definition: 'Monte Carlo estimate of the marginal posterior mean for X in a bivariate Gibbs sampler.',
  },
  posterior_mean_y: {
    label: 'Posterior Mean (Y)',
    formula: 'E[Y | data]',
    definition: 'Monte Carlo estimate of the marginal posterior mean for Y in a bivariate Gibbs sampler.',
  },
  posterior_var_x: {
    label: 'Posterior Variance (X)',
    formula: 'Var[X | data]',
    definition: 'Monte Carlo estimate of the marginal posterior variance for X. Should converge to σ_x² for a bivariate normal.',
  },
  posterior_mean: {
    label: 'Posterior Mean',
    formula: 'E[θ | data]',
    definition: 'Mean of MCMC posterior samples for θ (after burn-in). Used by MH and HMC samplers.',
  },
  posterior_std: {
    label: 'Posterior Std Dev',
    formula: 'SD[θ | data]',
    definition: 'Standard deviation of MCMC posterior samples. Measures posterior uncertainty.',
  },
  acceptance_rate: {
    label: 'Acceptance Rate',
    formula: '# accepted / # proposed',
    definition: 'Fraction of MH proposals accepted. Typical target: 0.23–0.44 for scalar targets.',
  },
  energy_error: {
    label: 'Mean Energy Error',
    formula: 'E[|H_prop − H_curr|]',
    definition: 'Average absolute change in Hamiltonian across HMC proposals. Near 0 for Gaussian targets (leapfrog is symplectic).',
  },
  posterior_prob_m1: {
    label: 'P(M₁ | data)',
    formula: 'BF · P(M₁) / [BF · P(M₁) + P(M₂)]',
    definition: 'Posterior probability of the single-mean model M1, computed from the Bayes factor.',
  },
  posterior_prob_m2: {
    label: 'P(M₂ | data)',
    formula: '1 − P(M₁ | data)',
    definition: 'Posterior probability of the split-mean model M2. Must satisfy P(M1) + P(M2) = 1.',
  },
  bayes_factor: {
    label: 'Bayes Factor (BF₁₂)',
    formula: 'p(y | M₁) / p(y | M₂)',
    definition: 'Ratio of marginal likelihoods. BF > 1 favors M1; BF < 1 favors M2.',
  },
  variational_mean: {
    label: 'Variational Mean (μ_q)',
    formula: 'μ_q = σ²_q (μ₀/σ²₀ + n·x̄/σ²)',
    definition: 'Mean of the variational posterior q(θ) = N(μ_q, σ²_q) from CAVI. Equals the analytic posterior mean for Normal-Normal model.',
  },
  variational_var: {
    label: 'Variational Variance (σ²_q)',
    formula: 'σ²_q = 1/(1/σ²₀ + n/σ²)',
    definition: 'Variance of the variational posterior. Equals the analytic posterior variance for conjugate Normal-Normal.',
  },
  final_elbo: {
    label: 'ELBO',
    formula: 'E_q[log p(x,θ)] − E_q[log q(θ)]',
    definition: 'Evidence Lower BOund — lower bound on log marginal likelihood. Maximized by CAVI; negative values are normal.',
  },
  abc_posterior_mean: {
    label: 'ABC Posterior Mean',
    formula: 'mean(accepted θ)',
    definition: 'Mean of accepted θ samples from ABC rejection algorithm. Approximates posterior mean under tolerance ε.',
  },
  abc_posterior_std: {
    label: 'ABC Posterior Std',
    formula: 'std(accepted θ)',
    definition: 'Std dev of accepted ABC samples. Wider than analytic posterior due to approximate likelihood.',
  },
  hyperpost_mean: {
    label: 'Hyperprior Posterior Mean',
    formula: 'μ_hyper = σ²_hyper · Σ(y_j / (se²_j + τ²)) + μ₀/σ²₀)',
    definition: 'Posterior mean of the hierarchical hyperparameter μ. Precision-weighted average of group means, shrunk toward prior.',
  },
  hyperpost_var: {
    label: 'Hyperprior Posterior Variance',
    formula: '1 / (Σ 1/(se²_j + τ²) + 1/σ²₀)',
    definition: 'Posterior variance of hyperparameter μ. Decreases as more groups are observed.',
  },
  shrinkage_factor: {
    label: 'Shrinkage Factor',
    formula: 'mean(se²_j / (se²_j + τ²))',
    definition: 'Average fraction by which each group estimate is shrunk toward the grand mean. 0 = no shrinkage, 1 = full pooling.',
  },
}

export default TOOLTIP_MAP
