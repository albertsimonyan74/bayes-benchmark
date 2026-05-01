import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || ''

const HEADLINE_CARDS = [
  {
    big: '25%',
    label: 'pass-flip',
    desc: 'Runs that pass keyword rubric but fail external Llama judge on assumption_compliance (274 / 1094 runs).',
    color: '#00FFE0',
  },
  {
    big: 'α = 0.55',
    label: 'Krippendorff α',
    desc: 'Inter-rater agreement on assumption_compliance — questionable per Park et al. (2025) thresholds.',
    color: '#7FFFD4',
  },
  {
    big: '46.9%',
    label: 'assumption violations',
    desc: 'Failures classified as assumption violations vs math errors (67/143). Externally validated against Wang et al. 2025.',
    color: '#A78BFA',
  },
  {
    big: '3 ≠',
    label: 'distinct rankings',
    desc: 'Accuracy ≠ robustness ≠ calibration. Single-metric leaderboards mislead.',
    color: '#00B4D8',
  },
]

const QUICK_LINKS = [
  { href: '/#methodology',    label: 'Full Methodology'   },
  { href: '/#visualizations', label: 'All Visualizations' },
  { href: '/#limitations',    label: 'Limitations'        },
  { href: '/#references',     label: 'References'         },
  { href: '/',                label: 'Live Site'          },
]

export default function PosterCompanion() {
  const [healthDate, setHealthDate] = useState(null)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/v2/health`)
      .then(r => r.json())
      .then(d => {
        const ok = d?.ok
        const today = new Date().toISOString().slice(0, 10)
        setHealthDate(ok ? today : 'unavailable')
      })
      .catch(() => setHealthDate('unavailable'))
  }, [])

  return (
    <div style={{
      background: '#050a16',
      minHeight: '100vh',
      color: '#E8F4F8',
      padding: '32px 16px 64px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid rgba(0,255,224,0.18)' }}>
          <div style={{ color: 'rgba(0,255,224,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 10 }}>
            DS 299 CAPSTONE · LIVE BENCHMARK
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5.5vw, 30px)', fontWeight: 700, lineHeight: 1.25, margin: '0 0 12px' }}>
            Beyond Right Answers:{' '}
            <span style={{ color: '#00FFE0' }}>External-Judge Validation</span>{' '}
            of LLM Bayesian Reasoning
          </h1>
          <div style={{ fontSize: 13, color: 'rgba(232,244,248,0.65)', lineHeight: 1.6 }}>
            Albert Simonyan · American University of Armenia · Supervised by Dr. Vahe Movsisyan
          </div>
        </header>

        {/* Three Rankings hero */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: '#00FFE0', fontWeight: 700, letterSpacing: '0.16em', marginBottom: 12 }}>
            THREE RANKINGS
          </div>
          <button
            onClick={() => setZoom(true)}
            style={{
              display: 'block', width: '100%',
              border: '1px solid rgba(0,255,224,0.25)',
              borderRadius: 10, overflow: 'hidden',
              background: '#fff', padding: 0, cursor: 'pointer',
              minHeight: 48,
            }}
            aria-label="Open full-size three rankings figure"
          >
            <img
              src="/visualizations/png/v2/three_rankings.png"
              alt="Three rankings: accuracy, robustness, calibration"
              style={{ display: 'block', width: '100%', height: 'auto' }}
              loading="eager"
            />
          </button>
          <div style={{ fontSize: 12, color: 'rgba(232,244,248,0.55)', marginTop: 8, lineHeight: 1.55 }}>
            Accuracy ≠ robustness ≠ calibration. Tap to zoom.
          </div>
        </section>

        {/* Headline cards */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: '#00FFE0', fontWeight: 700, letterSpacing: '0.16em', marginBottom: 16 }}>
            HEADLINE NUMBERS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {HEADLINE_CARDS.map((c, i) => (
              <div key={i} style={{
                border: `1px solid ${c.color}33`,
                borderLeft: `4px solid ${c.color}`,
                background: `${c.color}0A`,
                borderRadius: 10,
                padding: '16px 18px',
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: c.color, lineHeight: 1.05, fontFamily: 'monospace' }}>
                  {c.big}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(232,244,248,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 0 8px' }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(232,244,248,0.85)', lineHeight: 1.5 }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: '#00FFE0', fontWeight: 700, letterSpacing: '0.16em', marginBottom: 16 }}>
            QUICK LINKS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {QUICK_LINKS.map((l, i) => (
              l.href.startsWith('/#') ? (
                <a key={i} href={l.href} style={linkStyle}>
                  {l.label} <span style={{ color: '#00FFE0' }}>→</span>
                </a>
              ) : (
                <Link key={i} to={l.href} style={linkStyle}>
                  {l.label} <span style={{ color: '#00FFE0' }}>→</span>
                </Link>
              )
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(0,255,224,0.12)', paddingTop: 20, fontSize: 12, color: 'rgba(232,244,248,0.45)', lineHeight: 1.7 }}>
          <div>Last updated: {healthDate || 'loading…'}</div>
          <div style={{ marginTop: 4 }}>171 tasks · 5 models · 2,365 perturbation runs · external Llama 3.3 70B judge</div>
        </footer>
      </div>

      {/* Zoom overlay */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.94)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <button
            onClick={() => setZoom(false)}
            aria-label="Close"
            style={{
              position: 'fixed', top: 16, right: 16,
              width: 48, height: 48, borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(0,0,0,0.6)', color: '#fff',
              fontSize: 20, cursor: 'pointer',
            }}
          >✕</button>
          <img
            src="/visualizations/png/v2/three_rankings.png"
            alt="Three rankings"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '96vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  )
}

const linkStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 16px',
  minHeight: 48,
  borderRadius: 10,
  border: '1px solid rgba(0,255,224,0.22)',
  background: 'rgba(0,255,224,0.05)',
  color: '#E8F4F8',
  fontSize: 16,
  fontWeight: 600,
  textDecoration: 'none',
}
