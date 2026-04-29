import { useEffect, useRef } from 'react'

const PALETTE = [
  [0, 255, 224],   // aqua
  [0, 180, 216],   // blue
  [167, 139, 250], // purple
]

function lerpColor(a, b, t) {
  return [
    (a[0] + (b[0] - a[0]) * t) | 0,
    (a[1] + (b[1] - a[1]) * t) | 0,
    (a[2] + (b[2] - a[2]) * t) | 0,
  ]
}

function pickColor(idx, total) {
  const t = (idx / total) * PALETTE.length
  const i = Math.floor(t) % PALETTE.length
  return lerpColor(PALETTE[i], PALETTE[(i + 1) % PALETTE.length], t - Math.floor(t))
}

export default function HeroNetworkBg({ opacity = 0.55 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    let W = 0, H = 0, animId = null, t = 0

    function resize() {
      W = canvas.width  = Math.round(canvas.offsetWidth  * dpr)
      H = canvas.height = Math.round(canvas.offsetHeight * dpr)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // Build nodes
    const NODE_COUNT = 72
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
      bx: Math.random(),
      by: Math.random(),
      vx: (Math.random() - 0.5) * 0.00012,
      vy: (Math.random() - 0.5) * 0.00012,
      phase: Math.random() * Math.PI * 2,
      r: 1.8 + Math.random() * 2,
      col: pickColor(i, NODE_COUNT),
    }))

    // Current positions (absolute px)
    const pos = nodes.map(() => ({ x: 0, y: 0 }))

    // Edges (static, based on proximity at t=0)
    const THRESH = 0.22
    const edges = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].bx - nodes[j].bx
        const dy = nodes[i].by - nodes[j].by
        if (Math.sqrt(dx * dx + dy * dy) < THRESH) edges.push([i, j])
      }
    }

    // Pulses
    let pulses = []
    let spawnTimer = 0

    function spawnPulse() {
      if (!edges.length) return
      const e = edges[Math.floor(Math.random() * edges.length)]
      pulses.push({ e, p: 0, speed: 0.007 + Math.random() * 0.01, rev: Math.random() > 0.5 })
    }

    function draw() {
      if (!W || !H) { animId = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, W, H)

      // Update positions
      nodes.forEach((n, i) => {
        n.bx += n.vx; n.by += n.vy
        if (n.bx < 0 || n.bx > 1) n.vx *= -1
        if (n.by < 0 || n.by > 1) n.vy *= -1
        pos[i] = { x: n.bx * W, y: n.by * H }
      })

      // Draw edges
      edges.forEach(([a, b]) => {
        const ax = pos[a].x, ay = pos[a].y
        const bx = pos[b].x, by = pos[b].y
        const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
        const maxDist = THRESH * W
        const alpha = Math.max(0, (1 - dist / maxDist) * 0.09)
        if (alpha < 0.005) return
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.strokeStyle = `rgba(0,255,224,${alpha})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      })

      // Pulses
      spawnTimer++
      if (spawnTimer >= 18) { spawnPulse(); spawnTimer = 0 }

      const alive = []
      pulses.forEach(pulse => {
        pulse.p += pulse.speed
        if (pulse.p > 1) return
        alive.push(pulse)
        const [a, b] = pulse.e
        const tp = pulse.rev ? 1 - pulse.p : pulse.p
        const px = pos[a].x + (pos[b].x - pos[a].x) * tp
        const py = pos[a].y + (pos[b].y - pos[a].y) * tp
        const alpha = Math.sin(pulse.p * Math.PI) * 0.85
        const col = nodes[a].col
        ctx.beginPath()
        ctx.arc(px, py, 2.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`
        ctx.shadowColor = `rgb(${col[0]},${col[1]},${col[2]})`
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })
      pulses = alive

      // Nodes
      nodes.forEach((n, i) => {
        const { x, y } = pos[i]
        const pulse = 0.18 + Math.sin(t * 0.002 + n.phase) * 0.09
        const [r, g, b2] = n.col
        ctx.beginPath()
        ctx.arc(x, y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b2},${pulse})`
        ctx.fill()
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}
