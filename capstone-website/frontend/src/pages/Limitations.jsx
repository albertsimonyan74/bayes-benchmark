import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const CAVEATS = [
  {
    title: 'Empty HALLUCINATION bucket',
    body: `The error taxonomy returned zero HALLUCINATION classifications across all 143 audited
    failures. This is a real signal, not a missing case: every benchmark task has a closed-form
    or seeded ground truth, so models fail by skipping required assumptions or miscomputing —
    not by fabricating priors, distributions, or data. Llama 3.3 70B may still under-surface
    hallucination on well-constrained tasks (E5/E8/E9 are flagged "use only if nothing else
    fits"), so the 0% rate is partly methodology artifact and partly a property of bounded
    numerical Bayesian problems.`,
  },
  {
    title: 'Empty high-confidence bucket',
    body: `All five models produced 0 responses classified as high-confidence (claimed p ≥ 0.85)
    by our keyword-based extractor, leaving the 0.9 ECE bucket empty. Reported ECE values are
    weighted MAEs over three populated buckets (0.3 / 0.5 / 0.6) — they capture calibration
    across the low-to-moderate confidence range only. The consistency-based proxy (Group B3)
    reveals overconfidence on hard tasks that verbalized extraction missed. True probabilistic
    calibration requires token-level logprobs, not uniformly available across the 5 vendor APIs.`,
  },
  {
    title: 'Top-2 not statistically separable',
    body: `Accuracy: Claude 0.679 [0.655, 0.702] and Gemini 0.674 [0.647, 0.700] overlap on the
    bootstrap 95% CI. Robustness: ChatGPT Δ = −0.0007 and DeepSeek Δ = +0.0006 sit well inside
    one SE of zero (SE ≈ 0.012 over 473 perturbations × 5 models). Cite Statistical Fragility
    (2025): single-question swaps shift Pass@1 by ≥ 3 pp. Point estimates reported for
    completeness; "X is more robust than Y" is unsupported at this sample size for the top
    two of each ranking.`,
  },
  {
    title: 'Single-judge limitation',
    body: `The 25.0% pass-flip headline rests on a single external judge — Llama 3.3 70B Instruct
    via Together AI. Cross-provider agreement (Groq vs Together) was verified and strictness
    spot-checks were run on borderline cases; true cross-judge validation against an independent
    family (e.g. GPT-4 class or Claude Opus as judge) is paper-scope future work. Cite Yamauchi
    et al. (2025) "LLM-as-Judge empirical study" and Feuer et al. (2025) "Judgment Becomes
    Noise" — single-judge benchmarks introduce systematic noise. Future work: multi-judge
    ensemble.`,
  },
  {
    title: 'B3 stratification caveat',
    body: `The self-consistency proxy (Group B3) was run on top-failure tasks, not a random
    sample of the 171-task corpus. The hedge-heavy-vs-overconfident contrast with FermiEval
    therefore depends on the stratification: on globally-hard Bayesian tasks, our models
    default to medium-confidence; on FermiEval's estimation domain, the same models present
    overconfidently. The behavioural shift is real, but the magnitude is not directly
    comparable until we re-run B3 on a uniform random sample.`,
  },
]

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

export default function Limitations() {
  return (
    <section id="limitations" style={{ padding: '96px 24px 80px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ color: 'rgba(255,184,71,0.65)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 8 }}>
            // HONEST DISCLOSURES · NOT FAILURES
          </div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>
            Limitations
          </h2>
          <div style={{ width: 64, height: 3, background: 'linear-gradient(90deg,#FFB347,#FF9A3C)', borderRadius: 2, marginBottom: 32 }} />
          <p style={{ color: 'rgba(232,244,248,0.7)', fontSize: 14, lineHeight: 1.75, maxWidth: 800, marginBottom: 28 }}>
            Five caveats the methodology requires us to disclose. Each is a property of the design,
            not a bug. Read them as the boundary of what the headline numbers can and cannot
            claim.
          </p>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {CAVEATS.map((c, i) => (
            <FadeIn key={i} delay={60 * i}>
              <div style={{
                background: 'rgba(255,184,71,0.04)',
                border: '1px solid rgba(255,184,71,0.25)',
                borderLeft: '4px solid #FFB347',
                borderRadius: 10,
                padding: '20px 26px',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
                  <span style={{
                    color: '#FFB347', fontFamily: 'monospace', fontSize: 14, fontWeight: 800,
                  }}>L{i + 1}</span>
                  <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{c.title}</span>
                </div>
                <p style={{ color: 'rgba(232,244,248,0.78)', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                  {c.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
