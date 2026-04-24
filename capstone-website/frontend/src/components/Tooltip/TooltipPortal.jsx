import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function TooltipPortal({ anchorRef, show, info }) {
  const [pos, setPos] = useState({ x: 0, y: 0, placement: 'above' })
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (!show || !anchorRef.current) return

    const rect = anchorRef.current.getBoundingClientRect()
    const tooltipW = 300
    const tooltipH = 120
    const pad = 12

    // X: center on anchor, clamp to viewport
    let x = rect.left + rect.width / 2 - tooltipW / 2
    x = Math.max(pad, Math.min(x, window.innerWidth - tooltipW - pad))

    // Y: prefer above, fall back to below
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom
    let y, placement
    if (spaceAbove >= tooltipH + pad) {
      y = rect.top - tooltipH - pad
      placement = 'above'
    } else {
      y = rect.bottom + pad
      placement = 'below'
    }

    setPos({ x, y, placement })
  }, [show, anchorRef])

  if (!show || !info) return null

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 300,
        zIndex: 999999,
        pointerEvents: 'none',
        animation: 'tooltipFadeIn 0.15s ease forwards',
      }}
    >
      <div style={{
        background: 'rgba(6, 12, 26, 0.98)',
        border: '1px solid rgba(0, 255, 224, 0.4)',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: '0 0 30px rgba(0,255,224,0.15), 0 8px 32px rgba(0,0,0,0.6)',
      }}>
        {/* Arrow indicator */}
        <div style={{
          position: 'absolute',
          [pos.placement === 'above' ? 'bottom' : 'top']: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 10,
          height: 6,
          background: 'rgba(6,12,26,0.98)',
          clipPath: pos.placement === 'above'
            ? 'polygon(0 0, 100% 0, 50% 100%)'
            : 'polygon(50% 0, 0 100%, 100% 100%)',
        }} />

        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#00FFE0',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          {info.label}
        </div>

        {info.formula && (
          <div style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: 'rgba(0,255,224,0.65)',
            background: 'rgba(0,255,224,0.06)',
            borderRadius: 4,
            padding: '3px 8px',
            marginBottom: 8,
            letterSpacing: '0.02em',
          }}>
            {info.formula}
          </div>
        )}

        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.55,
        }}>
          {info.definition}
        </div>
      </div>
    </div>,
    document.body
  )
}
