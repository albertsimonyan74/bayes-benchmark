import { useRef, useState } from 'react'
import { TOOLTIP_MAP } from '../data/TooltipMap'
import { TooltipPortal } from './Tooltip/TooltipPortal'

export function ParamTooltip({ paramKey, value }) {
  const [show, setShow] = useState(false)
  const anchorRef = useRef(null)
  const info = TOOLTIP_MAP[paramKey]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid rgba(0,255,224,0.08)',
      }}
    >
      <div
        ref={anchorRef}
        data-hover="true"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'none',
          position: 'relative',
        }}
      >
        <span style={{
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#00FFE0',
          borderBottom: info
            ? '1px dashed rgba(0,255,224,0.35)'
            : 'none',
          paddingBottom: 1,
        }}>
          {paramKey}
        </span>
        {info && (
          <span style={{
            fontSize: 10,
            color: 'rgba(0,255,224,0.45)',
            border: '1px solid rgba(0,255,224,0.25)',
            borderRadius: 3,
            padding: '0 4px',
            lineHeight: '16px',
          }}>
            ?
          </span>
        )}
        <TooltipPortal
          anchorRef={anchorRef}
          show={show}
          info={info}
        />
      </div>

      <span style={{
        fontFamily: 'monospace',
        fontSize: 14,
        fontWeight: 600,
        color: '#ffffff',
      }}>
        {typeof value === 'number' ? value.toFixed(6) : String(value)}
      </span>
    </div>
  )
}
