import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HeroStickers } from './CollageStickers'
import HeroEditor from './HeroEditor'
import { useMobile } from '../hooks/useMobile'

const editMode = new URLSearchParams(window.location.search).has('edit')


// ── Paste your copied offsets here to save positions permanently ──
const CONTENT_OFFSETS = {
  fortin:  { x: 161, y: -493 },
  lisboa:  { x: 0, y: 0 },
  content: { x: 0, y: 0 },
}

export default function Hero() {
  const isMobile = useMobile()
  const [positions, setPositions] = useState(CONTENT_OFFSETS)
  const [copied, setCopied] = useState(null)
  const activeDrag = useRef(null)

  const startDrag = useCallback((key, e) => {
    e.stopPropagation()
    activeDrag.current = {
      key,
      startMX: e.clientX,
      startMY: e.clientY,
      startX: positions[key].x,
      startY: positions[key].y,
    }
  }, [positions])

  const onMouseMove = useCallback((e) => {
    if (!activeDrag.current) return
    const { key, startMX, startMY, startX, startY } = activeDrag.current
    setPositions(prev => ({
      ...prev,
      [key]: { x: startX + e.clientX - startMX, y: startY + e.clientY - startMY },
    }))
  }, [])

  const onMouseUp = useCallback(() => { activeDrag.current = null }, [])

  const copyPos = (key) => {
    const { fortin, lisboa, content } = positions
    const all = `// Paste this into CONTENT_OFFSETS in Hero.jsx\nconst CONTENT_OFFSETS = {\n  fortin:  { x: ${Math.round(fortin.x)}, y: ${Math.round(fortin.y)} },\n  lisboa:  { x: ${Math.round(lisboa.x)}, y: ${Math.round(lisboa.y)} },\n  content: { x: ${Math.round(content.x)}, y: ${Math.round(content.y)} },\n}`
    navigator.clipboard.writeText(all)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const dragStyle = (key, extraOutlineColor = '#FF2D87') => ({
    cursor: 'grab',
    transform: `translate(${positions[key].x}px, ${positions[key].y}px)`,
    outline: `2px dashed ${extraOutlineColor}`,
    outlineOffset: 10,
    borderRadius: 8,
    display: 'inline-block',
    position: 'relative',
  })

  const CopyBtn = ({ k, color }) => (
    <button
      onMouseDown={e => e.stopPropagation()}
      onClick={() => copyPos(k)}
      style={{
        display: 'block',
        margin: '6px auto 0',
        background: copied === k ? '#7FAF4E' : color,
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '4px 12px',
        fontSize: '0.65rem',
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {copied === k ? '✓ Copied!' : `📋 (${Math.round(positions[k].x)}, ${Math.round(positions[k].y)})`}
    </button>
  )

  return (
    <section
      style={{
        minHeight: isMobile ? '100svh' : '100vh',
        background: '#FFFAF5',
        position: 'relative',
        // overflow visible so edge stickers can bleed into next section
        overflow: 'visible',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseMove={editMode ? onMouseMove : undefined}
      onMouseUp={editMode ? onMouseUp : undefined}
      onMouseLeave={editMode ? onMouseUp : undefined}
    >
      {/* Clipped background layer */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 18% 60%, rgba(232,87,58,0.08) 0%, transparent 55%), radial-gradient(ellipse at 82% 25%, rgba(43,78,255,0.06) 0%, transparent 50%)',
        }} />
        {/* Extra hero grain for paper warmth */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }} />
      </div>

      {/* Collage sticker layer */}
      {editMode ? <HeroEditor /> : <HeroStickers />}

      {/* Main content */}
      <div style={isMobile ? {
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        zIndex: 2, padding: '120px 24px 52px',
        pointerEvents: 'none',
      } : {
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2, width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: isMobile ? 'clamp(2rem, 9vw, 3rem)' : 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            color: '#FF1A1A',
            margin: 0,
            letterSpacing: '-2px',
            textShadow: 'none',
            textAlign: 'center',
          }}
        >
          Emma's Bachelorette<br />in Lisboa
        </motion.h1>

        {/* Tag line + subtitle + pills — draggable in edit mode */}
        <div
          style={editMode ? { ...dragStyle('content', '#FF2D87'), display: 'block' } : isMobile ? {
            background: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          } : {
            background: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 20,
          }}
          onMouseDown={editMode ? (e) => startDrag('content', e) : undefined}
        >
        {!editMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'block',
              width: 'fit-content',
              margin: isMobile ? '0 auto 12px' : '0 0 12px',
              background: '#FF2D87',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '6px 18px',
              borderRadius: 100,
            }}
          >
            September 18–21, 2026
          </motion.div>
        )}

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'flex',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? 8 : 20,
            justifyContent: 'center',
            margin: isMobile ? '140px auto 0' : '24px 0 0',
          }}
        >
          {[
            { label: '11', sub: 'Girls', color: '#00FF6A' },
            { label: '4', sub: 'Days', color: '#FF5500' },
            { label: '1', sub: 'Bride', color: '#FF2D87' },
            { label: '∞', sub: 'Pastéis de Nata', color: '#FFD23F' },
          ].map(({ label, sub, color }) => (
            <div
              key={sub}
              style={{
                background: '#fff',
                border: `3px solid ${color}`,
                borderRadius: 16,
                padding: isMobile ? '8px 10px' : '16px 24px',
                maxWidth: isMobile ? 110 : undefined,
                minWidth: isMobile ? undefined : 100,
                boxShadow: `4px 4px 0 ${color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? '18px' : '2rem', fontWeight: 900, color, lineHeight: 1 }}>
                {label}
              </div>
              <div style={{ fontSize: isMobile ? '9px' : '0.75rem', fontWeight: 600, color: '#0A1628', opacity: 0.6, textTransform: 'uppercase', letterSpacing: isMobile ? '0.06em' : '0.5px', marginTop: 4 }}>
                {sub}
              </div>
            </div>
          ))}
        </motion.div>

        {editMode && <CopyBtn k="content" color="#FF2D87" />}
        </div>{/* end content group */}

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginTop: isMobile ? 64 : 32 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '1.5rem', cursor: 'pointer' }}
            onClick={() => document.querySelector('#itinerary')?.scrollIntoView({ behavior: 'smooth' })}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom color band */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        background: 'linear-gradient(to right, #FF2D87, #FF2D87, #FFD23F, #FF5500, #7FAF4E)',
        zIndex: 3,
      }} />
    </section>
  )
}
