import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const SCORE_DIMS = [
  { dim: 'N', name: 'Numerical Accuracy',     color: '#00FFE0', desc: 'Extracted from required ANSWER: line. Tolerance per task type. Linear partial credit between full-credit and zero-credit thresholds.' },
  { dim: 'M', name: 'Method Selection',       color: '#00B4D8', desc: 'Required structure checks (e.g. states_prior, applies_bayes_theorem). Keyword + judge cross-validated.' },
  { dim: 'A', name: 'Assumption Compliance',  color: '#7FFFD4', desc: 'Required assumption checks (prior_specified, iid_stated). Dominant failure mode (46.9% of failures).' },
  { dim: 'C', name: 'Confidence Calibration', color: '#4A90D9', desc: 'Verbalized hedges + percentages. Overconfident-on-wrong penalized 1.5×. Upgrade path: consistency-based proxy.' },
  { dim: 'R', name: 'Reasoning Quality',      color: '#A78BFA', desc: 'Four sub-criteria × 0.25: shows work, identifies model, states formula, interprets result. Mean = 0.962 across 1229 judge records.' },
]

const LIT_TABLE = {
  cols: ['Dimension', 'StatEval (Lu 2025)', 'MathEval (Liu 2025)', 'ReasonBench (2025)', 'BrittleBench (2026)', 'Ice-Cream (Du 2025)', 'FermiEval (2025)', 'Nagarkar (2026)', 'THIS WORK'],
  rows: [
    ['Domain',           'Statistics (descriptive + freq.)', 'General math', 'General reasoning', 'General reasoning', 'Causal inference', 'Fermi estimation', 'Statistical reasoning', 'Bayesian inference'],
    ['# tasks',          '~500 (frequentist)', '17 datasets unified', 'multi-domain', 'multi-bench', '~30 pitfalls', 'Fermi-style', 'unspecified', '171 (136 P1 + 35 P2)'],
    ['Ground truth',     'Hand-crafted MC keys', 'Mixed', 'Mixed', 'Mixed', 'Hand-crafted', 'Closed-form bounds', 'Mixed', 'Closed-form + seeded MC'],
    ['Format',           'Multiple-choice', 'Mixed', 'Free-response', 'Free-response', 'Free-response', 'Numeric interval', 'Free-response', 'Free-response, 5-dim rubric'],
    ['External judge',   '✗', '✓ rubric', 'partial', '✗', '✗', '✗', '✗', '✓ Llama 3.3 70B (Together AI)'],
    ['Perturbations',    '✗', '✗', '✓ variance', '✓ 3 types', '✗', '✗', '✗', '✓ 398 v2 perturbations'],
    ['Statistical rigor','Single-point', 'Multi-dim aggregate', 'Variance-as-1st-class', 'Bootstrap recommended', 'Single-point', 'CI calibration', 'Single-point', 'Bootstrap CI + Krippendorff α'],
    ['Calibration',      '✗', '✗', '✗', '✗', '✗', '✓ verbalised CI', 'partial', '✓ keyword + future consistency'],
    ['Error taxonomy',   '✗', 'partial', '✗', '✗', '✓ assumption', '✗', 'partial (hallucination)', '✓ 4-L1 / 9-L2 hierarchical'],
    ['Open data',        '✓', '✓', 'partial', '✓', '✓', '✓', 'partial', '✓ All artefacts open'],
  ],
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  )
}

function Subhead({ children }) {
  return (
    <div style={{
      color: '#00FFE0', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.18em', marginBottom: 12, textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function Card({ children, accent = 'rgba(0,255,224,0.18)' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${accent}`,
      borderRadius: 14,
      padding: '24px 28px',
      marginBottom: 20,
    }}>
      {children}
    </div>
  )
}

export default function Methodology() {
  return (
    <section id="methodology" style={{ padding: '96px 24px 80px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ color: 'rgba(0,255,224,0.55)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 8 }}>
            // METHODOLOGY · CONTINUITY · LITERATURE
          </div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>
            Methodology
          </h2>
          <div style={{ width: 64, height: 3, background: 'linear-gradient(90deg,#00FFE0,#00B4D8)', borderRadius: 2, marginBottom: 36 }} />
        </FadeIn>

        {/* 1 — Continuity statement */}
        <FadeIn delay={50}>
          <Subhead>1 · Continuity Statement</Subhead>
          <Card>
            <p style={{ color: 'rgba(232,244,248,0.85)', fontSize: 14, lineHeight: 1.85, margin: 0 }}>
              This benchmark extends StatEval (Lu et al., 2025) from descriptive and hypothesis-testing
              statistics to Bayesian inference. Where StatEval uses multiple-choice format, we adopt
              free-response with a 5-dimensional rubric (N·M·A·C·R) following the multi-dimensional
              convention of MathEval (Liu et al., 2025). Our prompting baseline follows zero-shot
              chain-of-thought (Wei et al., 2022), with Program-of-Thoughts (Chen et al., 2022)
              considered and deferred because Bayesian closed-form derivations rely on symbolic
              manipulation more than arithmetic. Methodology rigour combines external-judge validation
              via Llama 3.3 70B (Park et al., 2025), bootstrap-CI separability motivated by Statistical
              Fragility (2025) and Longjohn et al. (2025), perturbation robustness adapted from
              BrittleBench (2026), and the variance-as-first-class framing of ReasonBench (2025).
              Calibration concerns are raised by Nagarkar et al. (2026) and contrast with FermiEval's
              (2025) overconfidence finding — our Bayesian-task setting produces hedge-heavy behaviour
              instead. Limitations around single-judge bias are framed by Judgment-Becomes-Noise (2025);
              future work toward multi-judge ensembling and consistency-based confidence (Multi-Answer
              Confidence, 2026) is explicitly scoped.
            </p>
          </Card>
        </FadeIn>

        {/* 2 — N·M·A·C·R Rubric */}
        <FadeIn delay={100}>
          <Subhead>2 · N·M·A·C·R Rubric</Subhead>
          <Card>
            <p style={{ color: 'rgba(232,244,248,0.7)', fontSize: 13, lineHeight: 1.7, margin: '0 0 18px' }}>
              Five equal-weight dimensions (0.20 each), pass threshold 0.50. CONCEPTUAL tasks score on
              rubric only; numeric+rubric tasks blend 0.6·numeric + 0.4·rubric.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {SCORE_DIMS.map(d => (
                <div key={d.dim} style={{
                  border: `1px solid ${d.color}33`,
                  borderTop: `3px solid ${d.color}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  background: `${d.color}08`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                    <span style={{ color: d.color, fontSize: 22, fontWeight: 800, fontFamily: 'monospace' }}>{d.dim}</span>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{d.name}</span>
                  </div>
                  <div style={{ color: 'rgba(232,244,248,0.65)', fontSize: 11, lineHeight: 1.55 }}>
                    {d.desc}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>

        {/* 3 — Llama judge */}
        <FadeIn delay={150}>
          <Subhead>3 · External Llama Judge</Subhead>
          <Card>
            <p style={{ color: 'rgba(232,244,248,0.85)', fontSize: 14, lineHeight: 1.8, margin: '0 0 12px' }}>
              <strong style={{ color: '#fff' }}>Why Llama 3.3 70B Instruct (via Together AI).</strong>{' '}
              The judge is a sixth model, deliberately external to the five benchmarked
              (Claude / GPT-4.1 / Gemini / DeepSeek / Mistral). Using one of the benchmarked
              models as judge would introduce self-preference bias (cf. Park et al., 2025).
              Cross-provider agreement was spot-checked against Groq's Llama endpoint.
            </p>
            <p style={{ color: 'rgba(232,244,248,0.7)', fontSize: 13, lineHeight: 1.75, margin: 0 }}>
              The judge produces a 4-dimensional rubric per response (numerical, method,
              assumption, reasoning quality + completeness). We compute Krippendorff α between
              keyword and judge on assumption_compliance — α = 0.55 (95% CI [0.51, 0.59]),
              questionable under Park et al. (2025) thresholds. Pass-flip rate: 25.0% (274/1094 runs).
            </p>
          </Card>
        </FadeIn>

        {/* 4 — Statistical validation */}
        <FadeIn delay={200}>
          <Subhead>4 · Statistical Validation</Subhead>
          <Card>
            <div style={{ marginBottom: 14 }}>
              <strong style={{ color: '#00FFE0', fontSize: 13 }}>Bootstrap CI separability.</strong>
              <p style={{ color: 'rgba(232,244,248,0.75)', fontSize: 13, lineHeight: 1.75, margin: '4px 0 0' }}>
                10 000 bootstrap resamples per model; per-task aggregation at task-id level. Reports
                95% CI on accuracy and on robustness Δ. Top-2 accuracy (Claude 0.679 [0.655, 0.702],
                Gemini 0.674 [0.647, 0.700]) overlap — not statistically separable. Motivates the
                three-rankings framing (Statistical Fragility, 2025).
              </p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <strong style={{ color: '#00FFE0', fontSize: 13 }}>Krippendorff α inter-rater reliability.</strong>
              <p style={{ color: 'rgba(232,244,248,0.75)', fontSize: 13, lineHeight: 1.75, margin: '4px 0 0' }}>
                Adopted over Spearman ρ on the recommendation of Park et al. (2025): α handles
                missing data, multiple raters, and ordinal-vs-nominal scales correctly. Thresholds
                used: α &gt; 0.8 strong, ≥ 0.667 acceptable, &lt; 0.667 questionable.
              </p>
            </div>
            <div>
              <strong style={{ color: '#00FFE0', fontSize: 13 }}>Tolerance sensitivity.</strong>
              <p style={{ color: 'rgba(232,244,248,0.75)', fontSize: 13, lineHeight: 1.75, margin: '4px 0 0' }}>
                Accuracy at task-specified tolerances vs ±10% / ±20% sweeps. Ranking stable across
                sweeps; Bayesian closed-form tasks are not numerically fragile.
              </p>
            </div>
          </Card>
        </FadeIn>

        {/* 5 — Literature comparison table */}
        <FadeIn delay={250}>
          <Subhead>5 · Literature Comparison</Subhead>
          <Card>
            <p style={{ color: 'rgba(232,244,248,0.7)', fontSize: 12, lineHeight: 1.7, margin: '0 0 16px' }}>
              7 prior systems × 10 dimensions. The <span style={{ color: '#00FFE0', fontWeight: 700 }}>THIS WORK</span> column is highlighted.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>
                    {LIT_TABLE.cols.map((c, i) => (
                      <th key={i} style={{
                        textAlign: 'left',
                        padding: '8px 10px',
                        borderBottom: '1px solid rgba(0,255,224,0.25)',
                        color: i === LIT_TABLE.cols.length - 1 ? '#00FFE0' : 'rgba(232,244,248,0.55)',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        background: i === LIT_TABLE.cols.length - 1 ? 'rgba(0,255,224,0.07)' : 'transparent',
                      }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LIT_TABLE.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => {
                        const isLast = ci === row.length - 1
                        const isFirst = ci === 0
                        return (
                          <td key={ci} style={{
                            padding: '7px 10px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            color: isLast ? '#00FFE0' : isFirst ? 'rgba(232,244,248,0.85)' : 'rgba(232,244,248,0.6)',
                            fontWeight: isLast || isFirst ? 600 : 400,
                            background: isLast ? 'rgba(0,255,224,0.05)' : 'transparent',
                            whiteSpace: 'nowrap',
                          }}>{cell}</td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </FadeIn>
      </div>
    </section>
  )
}
