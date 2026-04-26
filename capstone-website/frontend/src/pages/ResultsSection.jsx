import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import summaryData from '../data/results_summary.json'

const MODEL_META = {
  claude:   { name:'Claude Sonnet 4.5', color:'#00CED1', initials:'CL', provider:'Anthropic',    avg_score: 0 },
  chatgpt:  { name:'GPT-4.1',           color:'#7FFFD4', initials:'GP', provider:'OpenAI',       avg_score: 0 },
  mistral:  { name:'Mistral Large',     color:'#A78BFA', initials:'MS', provider:'Mistral AI',   avg_score: 0 },
  deepseek: { name:'DeepSeek Chat',     color:'#4A90D9', initials:'DS', provider:'DeepSeek AI',  avg_score: 0 },
  gemini:   { name:'Gemini 2.5 Flash',  color:'#FF6B6B', initials:'GM', provider:'Google',       avg_score: 0 },
}

// Score → CSS color (dark red → amber → cyan)
const scoreColor = (v) => {
  if (v === undefined || v === null) return 'rgba(255,255,255,0.03)'
  if (v < 0.25) return `rgba(220,53,69,${0.3 + v})`
  if (v < 0.50) return `rgba(255,165,60,${0.3 + v * 0.6})`
  if (v < 0.75) return `rgba(0,180,200,${0.25 + v * 0.5})`
  return `rgba(0,255,224,${0.3 + v * 0.55})`
}
const textColor = (v) => (v > 0.45 ? '#070B14' : '#E8F4F8')

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }} style={style}>
      {children}
    </motion.div>
  )
}

// ─── Leaderboard Card ─────────────────────────────────────────
function ModelCard({ modelId, data, rank, isSelected, onClick }) {
  const meta     = MODEL_META[modelId] || { name: modelId, color: '#8BAFC0', initials: '??' }
  const isPending = !data
  const isPartial = data && data.tasks < 171

  return (
    <motion.div
      onClick={onClick}
      data-hover
      whileHover={{ y: -5, boxShadow: `0 0 32px ${meta.color}44` }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{
        background: isSelected ? `${meta.color}14` : 'rgba(0,255,224,0.03)',
        border: `1px solid ${isSelected ? meta.color : 'rgba(0,255,224,0.12)'}`,
        borderRadius: 16, padding: '24px 20px', cursor: 'pointer', position: 'relative',
        boxShadow: isSelected ? `0 0 20px ${meta.color}33` : 'none',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {/* Rank badge */}
      {!isPending && !isPartial && (
        <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 11, color: 'rgba(139,175,192,0.6)', fontFamily: 'monospace', fontWeight: 700 }}>
          #{rank}
        </div>
      )}

      {/* Logo */}
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${meta.color}18`, border: `2px solid ${meta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
        {meta.initials}
      </div>

      <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{meta.name}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 14 }}>{meta.provider}</div>

      {isPending ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>⏳ Results pending</div>
      ) : isPartial ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 800, color: meta.color, lineHeight: 1, marginBottom: 6 }}>
            {(data.avg_score * 100).toFixed(1)}%
          </div>
          <div style={{ color: '#FF9A3C', fontSize: 11, fontWeight: 700, background: 'rgba(255,154,60,0.12)', padding: '3px 8px', borderRadius: 10, display: 'inline-block' }}>
            PARTIAL · {data.tasks}/171 runs
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 32, fontWeight: 800, color: meta.color, lineHeight: 1, marginBottom: 6 }}>
            {(data.avg_score * 100).toFixed(1)}%
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Pass: <b style={{ color: meta.color }}>{(data.pass_rate * 100).toFixed(0)}%</b></span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Latency: <b style={{ color: 'var(--text-primary)' }}>{(data.avg_latency / 1000).toFixed(1)}s</b></span>
          </div>
          {isSelected && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,255,224,0.15)' }}
            >
              {[
                ['Numeric Accuracy', data.avg_numeric_score],
                ['Method Structure', data.avg_structure_score],
                ['Assumption Check', data.avg_assumption_score],
              ].map(([label, score]) => (
                <div key={label} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{label}</span>
                    <span style={{ color: meta.color, fontSize: 10, fontWeight: 700 }}>{(score * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <motion.div style={{ height: '100%', background: meta.color, borderRadius: 2 }}
                      initial={{ width: 0 }} animate={{ width: `${score * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}

// ─── Task-Type Heatmap ────────────────────────────────────────
function Heatmap({ summary, selectedModel }) {
  const [hoveredCell, setHoveredCell] = useState(null)
  const allModels = ['claude', 'chatgpt', 'mistral', 'deepseek', 'gemini']
  const completeModels = summary.models_complete

  const taskTypes = Object.entries(summary.task_type_stats)
    .sort((a, b) => a[1].avg - b[1].avg)  // hardest at top

  const CELL_H = 28

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12 }}>
      <div style={{ minWidth: 600 }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: `160px repeat(${allModels.length}, 1fr)`, gap: 2, marginBottom: 2 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700, padding: '4px 8px', letterSpacing: '0.1em' }}>TASK TYPE</div>
          {allModels.map(m => {
            const meta = MODEL_META[m]
            const isComplete = completeModels.includes(m)
            return (
              <div key={m} style={{ color: isComplete ? meta.color : 'var(--text-muted)', fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '4px 4px' }}>
                {meta.initials}{!isComplete && ' ⚠'}
              </div>
            )
          })}
        </div>

        {/* Rows */}
        {taskTypes.map(([tt, stats]) => (
          <div key={tt} style={{ display: 'grid', gridTemplateColumns: `160px repeat(${allModels.length}, 1fr)`, gap: 2, marginBottom: 2 }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 10, padding: '0 8px', display: 'flex', alignItems: 'center', height: CELL_H, overflow: 'hidden' }}>
              {tt}
            </div>
            {allModels.map(m => {
              const score = stats.models[m]
              const isComplete = completeModels.includes(m)
              const highlight = selectedModel && selectedModel !== m
              return (
                <motion.div
                  key={m}
                  onMouseEnter={() => setHoveredCell({ tt, m, score })}
                  onMouseLeave={() => setHoveredCell(null)}
                  whileHover={{ scale: 1.04, zIndex: 2 }}
                  style={{
                    background: isComplete ? scoreColor(score) : 'rgba(255,255,255,0.03)',
                    height: CELL_H, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: isComplete ? textColor(score) : 'var(--text-muted)',
                    cursor: 'default', opacity: highlight ? 0.4 : 1, transition: 'opacity 0.2s',
                    border: hoveredCell?.tt === tt && hoveredCell?.m === m ? '1px solid rgba(0,255,224,0.6)' : '1px solid transparent',
                  }}
                >
                  {isComplete && score !== undefined ? score.toFixed(2) : (score !== undefined ? '⚠' : '—')}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Score scale legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>0</span>
        <div style={{ width: 120, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(220,53,69,0.6), rgba(255,165,60,0.7), rgba(0,180,200,0.7), rgba(0,255,224,0.8))' }}/>
        <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>1</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 10, marginLeft: 8 }}>⚠ = quota exhausted</span>
      </div>

      {/* Hover tooltip */}
      {hoveredCell && (
        <div style={{ marginTop: 8, padding: '8px 14px', background: '#0D1426', border: '1px solid rgba(0,255,224,0.2)', borderRadius: 8, display: 'inline-block' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
            <b style={{ color: MODEL_META[hoveredCell.m]?.color }}>{MODEL_META[hoveredCell.m]?.name}</b>
            {' · '}<b style={{ color: 'var(--accent)' }}>{hoveredCell.tt}</b>
            {hoveredCell.score !== undefined && ` · avg score: ${hoveredCell.score.toFixed(3)}`}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Score Distribution Bars ──────────────────────────────────
function ScoreDistribution({ summary }) {
  const completeModels = summary.models_complete
  const BUCKETS = 20
  const bucketSize = 1 / BUCKETS

  const distributions = completeModels.map(m => {
    const scores = summary.by_model[m]?.score_distribution || []
    const buckets = Array(BUCKETS).fill(0)
    scores.forEach(s => {
      const idx = Math.min(BUCKETS - 1, Math.floor(s / bucketSize))
      buckets[idx]++
    })
    const max = Math.max(...buckets)
    return { model: m, buckets, max, color: MODEL_META[m]?.color || '#888' }
  })

  const overallMax = Math.max(...distributions.map(d => d.max))
  const BAR_H = 80

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${completeModels.length}, 1fr)`, gap: 16, minWidth: 500 }}>
        {distributions.map(({ model, buckets, color }) => (
          <div key={model}>
            <div style={{ color, fontSize: 11, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
              {MODEL_META[model]?.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: BAR_H, position: 'relative' }}>
              {/* Pass threshold line at 0.5 */}
              <div style={{
                position: 'absolute', left: '50%', bottom: 0, top: 0,
                width: 1, background: 'rgba(0,255,136,0.5)',
                zIndex: 1,
              }}/>
              {buckets.map((count, i) => {
                const h = overallMax > 0 ? (count / overallMax) * BAR_H : 0
                const isPass = i >= BUCKETS / 2
                return (
                  <motion.div
                    key={i}
                    style={{
                      flex: 1, background: isPass ? `${color}88` : `${color}33`,
                      borderRadius: '2px 2px 0 0', minWidth: 0,
                    }}
                    initial={{ height: 0 }}
                    whileInView={{ height: h }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.02, ease: 'easeOut' }}
                  />
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>0</span>
              <span style={{ color: 'rgba(0,255,136,0.7)', fontSize: 9 }}>0.5</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>1</span>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 10, marginTop: 4 }}>
              Pass: {(summary.by_model[model].pass_rate * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tier Breakdown ───────────────────────────────────────────
function TierBreakdown({ summary }) {
  const completeModels = summary.models_complete
  const TIER_COLORS_MAP = { '1': '#7FFFD4', '2': '#00CED1', '3': '#00BFFF', '4': '#FF6B6B' }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, 1fr)`, gap: 16, minWidth: 500 }}>
        {['1', '2', '3', '4'].map(tier => (
          <div key={tier} style={{ background: 'rgba(0,255,224,0.03)', border: '1px solid rgba(0,255,224,0.1)', borderRadius: 12, padding: '16px 12px' }}>
            <div style={{ color: TIER_COLORS_MAP[tier], fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 12 }}>
              TIER {tier}
            </div>
            {completeModels.map(m => {
              const score = summary.by_model[m]?.by_tier?.[tier] || 0
              return (
                <div key={m} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{MODEL_META[m]?.initials}</span>
                    <span style={{ color: MODEL_META[m]?.color, fontSize: 10, fontWeight: 700 }}>{(score * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <motion.div
                      style={{ height: '100%', background: MODEL_META[m]?.color, borderRadius: 2 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${score * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Best / Worst Task Types ──────────────────────────────────
function BestWorst({ summary }) {
  const taskTypes = Object.entries(summary.task_type_stats)
    .sort((a, b) => a[1].avg - b[1].avg)

  const worst5 = taskTypes.slice(0, 5)
  const best5  = taskTypes.slice(-5).reverse()
  const TIER_COLORS_MAP = { '1': '#7FFFD4', '2': '#00CED1', '3': '#00BFFF', '4': '#FF6B6B' }

  const renderRow = (tt, stats) => (
    <div key={tt} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div style={{ width: 140, color: 'var(--text-secondary)', fontSize: 12, flexShrink: 0 }}>{tt}</div>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, position: 'relative' }}>
        <motion.div
          style={{ height: '100%', background: scoreColor(stats.avg), borderRadius: 3 }}
          initial={{ width: 0 }}
          whileInView={{ width: `${stats.avg * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 700, width: 44, textAlign: 'right', fontFamily: 'monospace' }}>
        {(stats.avg * 100).toFixed(0)}%
      </div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        <div style={{ color: '#FF6B6B', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>HARDEST TASK TYPES</div>
        {worst5.map(([tt, stats]) => renderRow(tt, stats))}
      </div>
      <div>
        <div style={{ color: '#00FFE0', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>EASIEST TASK TYPES</div>
        {best5.map(([tt, stats]) => renderRow(tt, stats))}
      </div>
    </div>
  )
}

// ─── Main ResultsSection ──────────────────────────────────────
export default function ResultsSection() {
  const summary = summaryData
  const [activeTab, setActiveTab] = useState('heatmap')

  const TABS = [
    { id: 'heatmap',  label: 'Score Heatmap'  },
    { id: 'dist',     label: 'Distribution'   },
    { id: 'tier',     label: 'Tier Breakdown' },
    { id: 'bestworst',label: 'Best / Worst'   },
  ]

  return (
    <>
      {/* Tab navigation */}
      <FadeIn delay={100}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <motion.button
              key={tab.id}
              data-hover
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '8px 20px', borderRadius: 8,
                background: activeTab === tab.id ? 'rgba(0,255,224,0.12)' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? 'rgba(0,255,224,0.5)' : 'rgba(0,255,224,0.12)'}`,
                color: activeTab === tab.id ? '#00FFE0' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* Tab content */}
      <FadeIn delay={150}>
        <div style={{ background: 'rgba(0,255,224,0.025)', border: '1px solid rgba(0,255,224,0.1)', borderRadius: 16, padding: '24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'heatmap'   && <Heatmap summary={summary} selectedModel={null} />}
              {activeTab === 'dist'      && <ScoreDistribution summary={summary} />}
              {activeTab === 'tier'      && <TierBreakdown summary={summary} />}
              {activeTab === 'bestworst' && <BestWorst summary={summary} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* Stats footer */}
      <FadeIn delay={200}>
        <div style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: 11 }}>
          <span>Generated: {new Date(summary.generated_at).toLocaleString()}</span>
          <span>Total runs: {summary.total_runs}</span>
          <span>Complete: {summary.models_complete.join(', ')}</span>
          {summary.models_partial.length > 0 && <span>Partial: {summary.models_partial.join(', ')} ({summaryData.by_model[summary.models_partial[0]]?.tasks || 0}/171 runs)</span>}
        </div>
      </FadeIn>
    </>
  )
}
