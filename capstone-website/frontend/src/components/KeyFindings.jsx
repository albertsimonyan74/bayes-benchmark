import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const API = import.meta.env.VITE_API_URL || ''

const STATIC_FALLBACK = [
  { big: '25.0%',   label: 'Pass-flip',           desc: 'Runs that pass keyword rubric but fail external Llama judge' },
  { big: 'α = 0.55',label: 'Krippendorff α',      desc: 'Assumption-compliance agreement — questionable per Park 2025' },
  { big: '46.9%',   label: 'Assumption violations', desc: 'Failures classified as assumption violations, not math errors' },
  { big: '2,365 / 0', label: 'Perturbation runs',  desc: 'Total perturbation runs / errors after retry' },
  { big: '3 ≠',     label: 'Distinct rankings',   desc: 'Accuracy ≠ robustness ≠ calibration' },
  { big: 'Top 2 tied', label: 'Bootstrap CI',     desc: 'Claude and Gemini accuracy not statistically separable' },
]

const COLORS = ['#00FFE0', '#7FFFD4', '#A78BFA', '#00B4D8', '#4A90D9', '#FFB347']

function buildCards(d) {
  const flipPct = (d.pass_flip_rate * 100).toFixed(1)
  const alpha = d.krippendorff_alpha_assumption?.toFixed(2)
  const dom = `${(d.dominant_failure_pct * 100).toFixed(1)}%`
  const totalRuns = d.n_runs?.toLocaleString?.() || d.n_runs
  const acc = d.rankings?.accuracy || []
  const top1 = acc[0]
  const top2 = acc[1]
  const top1Lo = top1?.ci?.[0]?.toFixed(3)
  const top1Hi = top1?.ci?.[1]?.toFixed(3)
  const top2Lo = top2?.ci?.[0]?.toFixed(3)
  const top2Hi = top2?.ci?.[1]?.toFixed(3)
  const overlap = top1 && top2 && top1Lo && top2Hi && Number(top1Lo) <= Number(top2Hi)

  return [
    { big: `${flipPct}%`, label: 'Pass-flip',
      desc: `${d.pass_flip_n}/${d.pass_flip_total} runs pass keyword rubric but fail external Llama judge.` },
    { big: `α = ${alpha}`, label: 'Krippendorff α',
      desc: `Assumption_compliance agreement — ${d.krippendorff_interpretation} (Park et al. 2025 thresholds).` },
    { big: dom, label: d.dominant_failure_mode?.replace(/_/g, ' ').toLowerCase() || 'dominant failure',
      desc: `${d.dominant_failure_n}/${d.dominant_failure_total} failures — assumption violations dominate, not math errors.` },
    { big: `${totalRuns} / 0`, label: 'Perturbation runs',
      desc: `${d.n_perturbations} unique perturbations × 5 models. Zero error records after retry.` },
    { big: '3 ≠', label: 'Distinct rankings',
      desc: 'Accuracy ≠ robustness ≠ calibration. Single-metric leaderboards mislead.' },
    { big: overlap ? 'Top-2 tied' : 'Separable',
      label: 'Bootstrap CI',
      desc: top1 && top2
        ? `${top1.model} ${top1.score?.toFixed(3)} [${top1Lo}, ${top1Hi}] vs ${top2.model} ${top2.score?.toFixed(3)} [${top2Lo}, ${top2Hi}].`
        : 'Top-2 accuracy CIs overlap on the bootstrap.' },
  ]
}

export default function KeyFindings() {
  const [cards, setCards] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/v2/headline_numbers`)
      .then(r => {
        if (!r.ok) throw new Error('http ' + r.status)
        return r.json()
      })
      .then(d => { setCards(buildCards(d)); setLoading(false) })
      .catch(() => { setCards(STATIC_FALLBACK); setLoading(false) })
  }, [])

  const list = cards || STATIC_FALLBACK

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14,
      maxWidth: 1300, margin: '0 auto 32px',
    }}>
      {list.map((c, i) => {
        const color = COLORS[i % COLORS.length]
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.45 }}
            style={{
              border: `1px solid ${color}33`,
              borderTop: `3px solid ${color}`,
              borderRadius: 12,
              padding: '18px 18px 16px',
              background: `${color}08`,
              opacity: loading && !cards ? 0.55 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            <div style={{
              fontFamily: 'monospace', color: color,
              fontSize: 26, fontWeight: 800, lineHeight: 1.05, marginBottom: 6,
            }}>
              {c.big}
            </div>
            <div style={{
              color: 'rgba(232,244,248,0.5)', fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              {c.label}
            </div>
            <div style={{ color: 'rgba(232,244,248,0.78)', fontSize: 11.5, lineHeight: 1.55 }}>
              {c.desc}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
