import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { guests } from '../data/guests'

// Deterministic rotation from name — looks random, stays stable
const ROTATIONS = [-1.8, 1.2, -0.7, 2.1, -1.5, 0.8, -2.0, 1.7, -0.5, 1.3, -1.9, 0.6]
function nameRot(name) {
  const h = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return ROTATIONS[h % ROTATIONS.length]
}

function Avatar({ guest, size = 72, fontSize = '1.4rem' }) {
  const [fallback, setFallback] = useState(0)
  const src = `${import.meta.env.BASE_URL}${guest.photo}`

  if (fallback === 0) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `3px solid ${guest.color}`,
        background: guest.bg,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <img
          src={src}
          alt={guest.name}
          onError={() => setFallback(1)}
          style={guest.zoomPhoto ? {
            position: 'absolute',
            width: '160%',
            height: '160%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            objectFit: 'cover',
          } : {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
        />
      </div>
    )
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: guest.bg,
      border: `3px solid ${guest.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Playfair Display, serif',
      fontWeight: 900,
      fontSize,
      color: guest.color,
      flexShrink: 0,
    }}>
      {guest.initials}
    </div>
  )
}

function GuestCard({ guest, onClick }) {
  const rot = nameRot(guest.name)
  const hoverRot = rot + (rot >= 0 ? 1.4 : -1.4)

  return (
    <motion.div
      initial={{ rotate: rot }}
      whileHover={{
        y: -6,
        rotate: hoverRot,
        boxShadow: `8px 8px 0 ${guest.color}88, 0 12px 32px rgba(0,0,0,0.12)`,
        transition: { duration: 0.18 },
      }}
      onClick={() => onClick(guest)}
      style={{
        background: '#fff',
        border: `3px solid ${guest.color}`,
        borderRadius: 20,
        padding: '20px',
        cursor: 'pointer',
        boxShadow: `4px 4px 0 ${guest.color}44, 0 4px 18px rgba(0,0,0,0.07)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Top row: photo + name/role */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <Avatar guest={guest} size={100} fontSize="1.6rem" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#0A1628', marginBottom: 2, lineHeight: 1.2 }}>
            {guest.name}
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: guest.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {guest.role}
          </div>
        </div>
      </div>

      {/* Location + IG */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', color: '#0A1628', opacity: 0.45 }}>
          📍 {guest.location}
        </span>
        <a
          href={`https://instagram.com/${guest.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ fontSize: '0.72rem', color: guest.color, textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}
        >
          @{guest.instagram}
        </a>
      </div>

      {/* Bio preview */}
      <p style={{ fontSize: '0.82rem', color: '#0A1628', opacity: 0.65, lineHeight: 1.6, margin: 0 }}>
        {guest.bio.slice(0, 120)}…
      </p>
    </motion.div>
  )
}

function GuestModal({ guest, onClose }) {
  if (!guest) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,22,40,0.75)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFF8F0',
          border: `4px solid ${guest.color}`,
          borderRadius: 24,
          padding: '40px',
          maxWidth: 560,
          width: '100%',
          boxShadow: `8px 8px 0 ${guest.color}`,
          position: 'relative',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: guest.color, color: '#fff',
            border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer',
            fontSize: '1rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <Avatar guest={guest} size={88} fontSize="1.7rem" />
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.7rem', fontWeight: 900, color: '#0A1628', marginBottom: 4 }}>
              {guest.name}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: guest.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6 }}>
              {guest.role}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#0A1628', opacity: 0.5, marginBottom: 4 }}>
              📍 {guest.location}
            </div>
            <a
              href={`https://instagram.com/${guest.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.82rem', color: guest.color, textDecoration: 'none', fontWeight: 600 }}
            >
              @{guest.instagram}
            </a>
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: '#0A1628', lineHeight: 1.75, marginBottom: 24 }}>
          {guest.bio}
        </p>

        <div style={{
          background: guest.bg, border: `2px solid ${guest.color}`,
          borderRadius: 12, padding: '14px 18px',
          fontSize: '0.85rem', color: guest.color, fontWeight: 600,
        }}>
          💬 {guest.ask}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Guests() {
  const [selected, setSelected] = useState(null)

  return (
    <section
      id="guests"
      className="dot-bg"
      style={{ padding: '100px 24px', scrollMarginTop: 64 }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#FF2D87', marginBottom: 12,
          }}>
            The Crew
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900, color: '#0A1628', margin: 0, lineHeight: 1.1,
          }}>
            12 Friends.<br />
            <span style={{ color: '#FF2D87', fontStyle: 'italic' }}>Infinite Stories.</span>
          </h2>
          <p style={{ color: '#0A1628', opacity: 0.6, marginTop: 16, fontSize: '1rem' }}>
            Click any card to learn more.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 18,
        }}>
          {guests.map((guest, i) => (
            // Every 3rd card drops 14px; slight horizontal nudge on alternates creates overlap feel
            <div key={guest.name} style={{
              marginTop: i % 3 === 2 ? 14 : 0,
              transform: i % 2 === 1 ? 'translateX(-4px)' : 'translateX(4px)',
            }}>
              <GuestCard guest={guest} onClick={setSelected} />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <GuestModal guest={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
