import { useEffect, useRef } from 'react'

/**
 * Persistent animated background globe — rotating wireframe sphere
 * with network nodes/edges. Pure canvas, single rAF loop.
 * Opacity 0.07 — felt more than seen.
 */
export default function GlobeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: false })

    const R = 340  // sphere radius px
    let W, H

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Build sphere geometry ─────────────────────────────────
    // Lat/lon grid lines: every 20° lat, every 30° lon
    const LAT_STEP = 20, LON_STEP = 30
    const SEG = 72  // segments per line

    // Sphere nodes (lat/lon in degrees)
    const nodes3D = []
    for (let i = 0; i < 32; i++) {
      const lat = (Math.random() * 160 - 80) * Math.PI / 180
      const lon = Math.random() * 2 * Math.PI
      nodes3D.push({ lat, lon, phase: Math.random() * Math.PI * 2, bright: false, brightT: 0 })
    }

    // Edges between nearby nodes
    const edges = []
    const ARC_THRESH = 0.85 // radians
    for (let i = 0; i < nodes3D.length; i++) {
      for (let j = i + 1; j < nodes3D.length; j++) {
        const a = nodes3D[i], b = nodes3D[j]
        // Great-circle distance
        const d = Math.acos(
          Math.max(-1, Math.min(1,
            Math.sin(a.lat) * Math.sin(b.lat) +
            Math.cos(a.lat) * Math.cos(b.lat) * Math.cos(a.lon - b.lon)
          ))
        )
        if (d < ARC_THRESH) edges.push([i, j])
      }
    }

    let angle = 0       // current Y-rotation
    let frame = 0
    let raf

    // Project 3D point (x,y,z on unit sphere) to canvas 2D with Y-rotation
    const project = (lat, lon, yRot) => {
      const lo = lon + yRot
      const x  = Math.cos(lat) * Math.sin(lo)
      const y  = Math.sin(lat)
      const z  = Math.cos(lat) * Math.cos(lo)
      const cx = W * 0.72
      const cy = H * 0.5
      return { sx: cx + x * R, sy: cy - y * R, z, vis: z > -0.15 }
    }

    // Draw a great-circle arc between two lat/lon points (spherical lerp)
    const drawArc = (a, b, yRot, alpha) => {
      const la1 = a.lat, lo1 = a.lon
      const la2 = b.lat, lo2 = b.lon
      ctx.beginPath()
      let moved = false
      for (let s = 0; s <= SEG / 4; s++) {
        const t  = s / (SEG / 4)
        const la = la1 + (la2 - la1) * t
        const lo = lo1 + (lo2 - lo1) * t
        const p  = project(la, lo, yRot)
        if (!p.vis) { moved = false; continue }
        const fade = Math.max(0, (p.z + 0.15) / 1.15)
        if (!moved) { ctx.moveTo(p.sx, p.sy); moved = true }
        else ctx.lineTo(p.sx, p.sy)
      }
      ctx.strokeStyle = `rgba(0,255,224,${alpha})`
      ctx.lineWidth = 0.4
      ctx.stroke()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Random node pulses
      if (frame % 120 === 0) {
        const idx = Math.floor(Math.random() * nodes3D.length)
        nodes3D[idx].bright  = true
        nodes3D[idx].brightT = 60
      }
      nodes3D.forEach(n => { if (n.brightT > 0) n.brightT-- ; if (n.brightT <= 0) n.bright = false })

      // Lat lines
      for (let lat = -80; lat <= 80; lat += LAT_STEP) {
        const laR = lat * Math.PI / 180
        ctx.beginPath()
        let moved = false
        for (let s = 0; s <= SEG; s++) {
          const lon = (s / SEG) * 2 * Math.PI
          const p = project(laR, lon, angle)
          if (!p.vis) { moved = false; continue }
          const fade = Math.max(0, (p.z + 0.15) / 1.15) * 0.12
          if (!moved) { ctx.moveTo(p.sx, p.sy); moved = true }
          else ctx.lineTo(p.sx, p.sy)
        }
        ctx.strokeStyle = 'rgba(0,255,224,0.07)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Lon lines
      for (let lon = 0; lon < 360; lon += LON_STEP) {
        const loR = lon * Math.PI / 180
        ctx.beginPath()
        let moved = false
        for (let s = 0; s <= SEG; s++) {
          const lat = ((s / SEG) * 180 - 90) * Math.PI / 180
          const p = project(lat, loR, angle)
          if (!p.vis) { moved = false; continue }
          if (!moved) { ctx.moveTo(p.sx, p.sy); moved = true }
          else ctx.lineTo(p.sx, p.sy)
        }
        ctx.strokeStyle = 'rgba(0,255,224,0.06)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Network edges
      edges.forEach(([i, j]) => {
        drawArc(nodes3D[i], nodes3D[j], angle, 0.09)
      })

      // Network nodes
      nodes3D.forEach(n => {
        const p = project(n.lat, n.lon, angle)
        if (!p.vis) return
        const fade = Math.max(0, (p.z + 0.15) / 1.15)
        const brightMul = n.bright ? 1 + (n.brightT / 60) * 3 : 1
        const alpha = fade * 0.25 * brightMul
        const r = n.bright ? 4 : 2.5

        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,255,224,${Math.min(1, alpha)})`
        if (n.bright) {
          ctx.shadowColor = '#00FFE0'
          ctx.shadowBlur  = 12
        }
        ctx.fill()
        ctx.shadowBlur = 0
      })

      angle += 0.0003   // full revolution ~5.8 min
      frame++
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.75,   // canvas itself draws at ~0.07 alpha → net ~0.07
      }}
    />
  )
}
