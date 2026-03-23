import { useState, useEffect } from 'react'

const links = [
  { label: 'Itinerary', href: '#itinerary' },
  { label: 'Guests', href: '#guests' },
  { label: 'Stay', href: '#stay' },
  { label: 'Map', href: '#map' },
  { label: 'Vibe', href: '#vibe' },
  { label: 'RSVP', href: '#rsvp' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (href) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? '#0A1628' : 'transparent',
        transition: 'background 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? '0 2px 24px rgba(10,22,40,0.15)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: scrolled ? '#FFF8F0' : '#0A1628',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '-0.5px',
          }}
        >
          40 in Lisboa 🇵🇹
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32 }}>
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: scrolled ? '#FFF8F0' : '#0A1628',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                opacity: 0.85,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.85}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
