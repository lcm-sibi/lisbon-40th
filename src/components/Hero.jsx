import { motion } from 'framer-motion'
import { HeroStickers } from './CollageStickers'

// Decorative scrapbook elements clustered near the title
function PostageStamp() {
  return (
    <div style={{
      position: 'absolute',
      top: -16,
      right: -20,
      width: 66,
      height: 82,
      background: '#FF2D87',
      borderRadius: 3,
      transform: 'rotate(7deg)',
      boxShadow: '2px 3px 8px rgba(0,0,0,0.18)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '3px dashed rgba(255,255,255,0.45)',
      outlineOffset: '-6px',
      zIndex: 4,
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🇵🇹</span>
      <span style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '0.5rem',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginTop: 4,
      }}>Lisboa</span>
    </div>
  )
}

function TapeStrip({ top, left, rotate, width = 80 }) {
  return (
    <div style={{
      position: 'absolute',
      top,
      left,
      width,
      height: 22,
      background: 'rgba(255, 243, 180, 0.78)',
      transform: `rotate(${rotate}deg)`,
      boxShadow: '1px 1px 4px rgba(0,0,0,0.08)',
      zIndex: 4,
      pointerEvents: 'none',
      backdropFilter: 'blur(1px)',
      borderRadius: 1,
    }} />
  )
}

function TornLabel({ text, bottom, left, rotate, color = '#E8573A' }) {
  return (
    <div style={{
      position: 'absolute',
      bottom,
      left,
      background: '#FFF8F0',
      border: `1.5px solid ${color}`,
      padding: '4px 12px',
      transform: `rotate(${rotate}deg)`,
      fontFamily: 'DM Sans, sans-serif',
      fontSize: '0.62rem',
      fontWeight: 700,
      letterSpacing: '2.5px',
      textTransform: 'uppercase',
      color,
      boxShadow: '2px 2px 0 rgba(0,0,0,0.08)',
      zIndex: 4,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    }}>
      {text}
    </div>
  )
}

function CircleSticker({ text, top, right, color = '#2B4EFF' }) {
  return (
    <div style={{
      position: 'absolute',
      top,
      right,
      width: 58,
      height: 58,
      borderRadius: '50%',
      border: `2.5px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'rotate(-12deg)',
      zIndex: 4,
      pointerEvents: 'none',
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(2px)',
    }}>
      <span style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.52rem',
        fontWeight: 900,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color,
        textAlign: 'center',
        lineHeight: 1.35,
      }}>{text}</span>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#FFFAF5',
        position: 'relative',
        // overflow visible so edge stickers can bleed into next section
        overflow: 'visible',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
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

      {/* Collage sticker layer — overflows into next section */}
      <HeroStickers />

      {/* Main content */}
      <div style={{ textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 2 }}>

        {/* Tape across the top of the block */}
        <TapeStrip top={-10} left="38%" rotate={-2} width={100} />

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-block',
            background: '#FF2D87',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '6px 18px',
            borderRadius: 100,
            marginBottom: 24,
          }}
        >
          May 13–17, 2026
        </motion.div>

        {/* "40 in" — with postage stamp tucked top-right */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              fontWeight: 900,
              lineHeight: 1.0,
              color: '#0A1628',
              margin: '0 0 8px',
              letterSpacing: '-2px',
            }}
          >
            40 in
          </motion.h1>
          <PostageStamp />
        </div>

        {/* "Lisboa" — collage image */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <motion.img
            src={`${import.meta.env.BASE_URL}20.png`}
            alt="Lisboa"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              width: 'clamp(260px, 50vw, 580px)',
              height: 'auto',
              margin: '0 auto',
              display: 'block',
              filter: 'drop-shadow(2px 4px 12px rgba(0,0,0,0.12))',
            }}
          />
          <TapeStrip top={8} left="-24px" rotate={-4} width={64} />
          <TornLabel text="Est. 2026" bottom={-4} left="12%" rotate={2} color="#E8573A" />
          <CircleSticker text={"12\nfriends"} top={-20} right={-30} color="#2B4EFF" />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: '1.25rem',
            color: '#0A1628',
            opacity: 0.7,
            maxWidth: 500,
            margin: '24px auto 48px',
            lineHeight: 1.6,
          }}
        >
          12 friends. 5 days. One city.
          <br />A very good reason to celebrate.
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {[
            { label: '12', sub: 'Friends', color: '#2B4EFF' },
            { label: '5', sub: 'Days', color: '#E8573A' },
            { label: '40', sub: 'Years of Lindsey', color: '#FF2D87' },
            { label: '∞', sub: 'Pastéis de Nata', color: '#FFD23F' },
          ].map(({ label, sub, color }) => (
            <div
              key={sub}
              style={{
                background: '#fff',
                border: `3px solid ${color}`,
                borderRadius: 16,
                padding: '16px 24px',
                minWidth: 100,
                boxShadow: `4px 4px 0 ${color}`,
              }}
            >
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 900, color, lineHeight: 1 }}>
                {label}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0A1628', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>
                {sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginTop: 64 }}
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
        background: 'linear-gradient(to right, #2B4EFF, #FF2D87, #FFD23F, #E8573A, #7FAF4E)',
        zIndex: 3,
      }} />
    </section>
  )
}
