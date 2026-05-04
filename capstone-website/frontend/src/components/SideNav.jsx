import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const SECTIONS = [
  { id: 'overview',       label: 'Overview'       },
  { id: 'pipeline',       label: 'Pipeline'       },
  { id: 'models',         label: 'Models'         },
  { id: 'difficulty',     label: 'Difficulty'     },
  { id: 'tasks',          label: 'Tasks'          },
  { id: 'methodology',    label: 'Methodology'    },
  { id: 'research',       label: 'Research'       },
  { id: 'visualizations', label: 'Visualizations' },
  { id: 'limitations',    label: 'Limitations'    },
  { id: 'user-study',     label: 'User Study'     },
  { id: 'references',     label: 'References'     },
]

export default function SideNav() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(SECTIONS[0].id)
  const [expanded, setExpanded] = useState(false)
  const collapseTimerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)

      const TRIGGER = 100
      let activeId = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= TRIGGER) activeId = s.id
      }
      setActive(activeId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }
    }
  }, [])

  const cancelCollapse = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
      collapseTimerRef.current = null
    }
  }

  const triggerCollapseAfterDelay = (delay = 3000) => {
    cancelCollapse()
    collapseTimerRef.current = setTimeout(() => {
      setExpanded(false)
      collapseTimerRef.current = null
    }, delay)
  }

  const handleNavMouseEnter = () => {
    cancelCollapse()
    setExpanded(true)
  }

  const handleNavMouseLeave = () => {
    triggerCollapseAfterDelay(800)
  }

  const handleNavTouchStart = () => {
    cancelCollapse()
    setExpanded(true)
  }

  const handleNavTouchEnd = () => {
    triggerCollapseAfterDelay(3000)
  }

  const handleClick = (id, e) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    triggerCollapseAfterDelay(500)
  }

  const nav = (
    <nav
      className={`sidenav${visible ? ' sidenav--visible' : ''}${expanded ? ' sidenav--expanded' : ''}`}
      aria-label="Section navigation"
      onMouseEnter={handleNavMouseEnter}
      onMouseLeave={handleNavMouseLeave}
      onTouchStart={handleNavTouchStart}
      onTouchEnd={handleNavTouchEnd}
    >
      <div className="sidenav__track" aria-hidden="true" />
      <ul className="sidenav__list">
        {SECTIONS.map(s => (
          <li key={s.id} className="sidenav__item">
            <a
              href={`#${s.id}`}
              className={`sidenav__link${active === s.id ? ' sidenav__link--active' : ''}`}
              onClick={(e) => handleClick(s.id, e)}
            >
              <span className="sidenav__label">{s.label}</span>
              <span className="sidenav__dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )

  if (typeof document === 'undefined') return null
  return createPortal(nav, document.body)
}
