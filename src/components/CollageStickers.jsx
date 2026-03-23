import { motion } from 'framer-motion'

function PhotoSticker({ src, width, rotate = 0, x, y, zIndex = 2, delay = 0, float = false, sway = false }) {
  const wrapClass = [float ? 'float-slow' : '', sway ? 'sway' : ''].filter(Boolean).join(' ') || undefined
  return (
    <div
      className={wrapClass}
      style={{ position: 'absolute', left: x, top: y, zIndex, pointerEvents: 'auto' }}
    >
      <motion.img
        src={src}
        initial={{ opacity: 0, scale: 0.6, rotate: rotate - 15 }}
        animate={{ opacity: 1, scale: 1, rotate }}
        transition={{ duration: 0.5, delay, type: 'spring', stiffness: 160, damping: 14 }}
        whileHover={{ scale: 1.08, rotate: rotate + (rotate > 0 ? 3 : -3) }}
        style={{
          width,
          height: 'auto',
          filter: 'drop-shadow(3px 6px 10px rgba(0,0,0,0.18))',
          userSelect: 'none',
          cursor: 'grab',
          display: 'block',
        }}
      />
    </div>
  )
}

function TextStamp({ text, color = '#E8573A', rotate = -8, x, y, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, type: 'spring', stiffness: 180 }}
      style={{
        position: 'absolute', left: x, top: y,
        fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: '0.75rem',
        color, border: `2.5px solid ${color}`, padding: '4px 10px',
        letterSpacing: '3px', textTransform: 'uppercase',
        transform: `rotate(${rotate}deg)`, display: 'inline-block',
        opacity: 0.9, whiteSpace: 'nowrap',
        boxShadow: `2px 2px 0 ${color}44`,
        background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(2px)', zIndex: 3,
      }}
    >
      {text}
    </motion.div>
  )
}

const BASE = import.meta.env.BASE_URL

export const HERO_PHOTO_STICKERS = [
  // ── BEHIND CONTENT zIndex: 1 — mid-layer pieces behind the title ──
  { src: `${BASE}5.png`,  width: 105, rotate: -5,  x: '20%',  y: '26%', zIndex: 1, delay: 0.15 }, // blue azulejo — behind "40 in"
  { src: `${BASE}16.png`, width: 88,  rotate: 11,  x: '64%',  y: '45%', zIndex: 1, delay: 0.2  }, // mouth/eye — behind subtitle
  { src: `${BASE}18.png`, width: 80,  rotate: -9,  x: '38%',  y: '62%', zIndex: 1, delay: 0.22 }, // lips — behind stat pills

  // ── EDGE & CORNER stickers (zIndex: 2) ──
  { src: `${BASE}1.png`,  width: 240, rotate: -6,  x: '-4%',  y: '50%', zIndex: 2, delay: 0.3,  },            // tram — bleeds left
  { src: `${BASE}2.png`,  width: 280, rotate: 7,   x: '68%',  y: '28%', zIndex: 2, delay: 0.35 },              // bridge
  { src: `${BASE}3.png`,  width: 160, rotate: -12, x: '71%',  y: '70%', zIndex: 2, delay: 0.5,  sway: true  }, // sardine — sways
  { src: `${BASE}6.png`,  width: 180, rotate: 8,   x: '76%',  y: '5%',  zIndex: 2, delay: 0.4  },              // pastéis
  { src: `${BASE}4.png`,  width: 140, rotate: -10, x: '1%',   y: '10%', zIndex: 2, delay: 0.45 },              // yellow azulejo
  { src: `${BASE}19.png`, width: 140, rotate: 15,  x: '3%',   y: '1%',  zIndex: 2, delay: 0.8,  float: true }, // flower — floats
  { src: `${BASE}14.png`, width: 90,  rotate: -8,  x: '88%',  y: '12%', zIndex: 2, delay: 0.85, float: true }, // heart — floats
  { src: `${BASE}17.png`, width: 160, rotate: -14, x: '84%',  y: '80%', zIndex: 2, delay: 0.9,  sway: true  }, // dancing woman — sways

  // ── FRUIT PEOPLE ──
  { src: `${BASE}8.png`,  width: 190, rotate: 8,   x: '58%',  y: '68%', zIndex: 2, delay: 0.6,  float: true }, // cherry
  { src: `${BASE}9.png`,  width: 180, rotate: -7,  x: '3%',   y: '75%', zIndex: 1, delay: 0.65, float: true }, // lime — bleeds into next section
  { src: `${BASE}10.png`, width: 170, rotate: 12,  x: '60%',  y: '2%',  zIndex: 2, delay: 0.55 },              // lemon
  { src: `${BASE}12.png`, width: 160, rotate: -9,  x: '1%',   y: '32%', zIndex: 2, delay: 0.7  },              // strawberry
  { src: `${BASE}7.png`,  width: 140, rotate: 14,  x: '86%',  y: '60%', zIndex: 2, delay: 0.75 },              // blueberry
  { src: `${BASE}11.png`, width: 150, rotate: -5,  x: '97%',  y: '38%', zIndex: 1, delay: 0.5  },              // pear — mostly off-screen right
  { src: `${BASE}15.png`, width: 110, rotate: -5,  x: '42%',  y: '78%', zIndex: 1, delay: 1.0  },              // laughing face — bottom center

  // ── OVERLAPPING TITLE (zIndex: 3) ──
  { src: `${BASE}13.png`, width: 220, rotate: 8,   x: '13%',  y: '27%', zIndex: 3, delay: 0.95 }, // cloud — overlaps "40 in" heading
]

export const HERO_TEXT_STAMPS = [
  { text: 'Bom Dia!',  color: '#E8573A', rotate: -11, x: '22%', y: '88%', delay: 1.0  },
  { text: 'Lisboa ✈', color: '#2B4EFF', rotate: 5,   x: '34%', y: '5%',  delay: 1.05 },
  { text: 'Mai 2026', color: '#7FAF4E', rotate: 9,   x: '1%',  y: '67%', delay: 1.1  },
]

export function HeroStickers() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {HERO_PHOTO_STICKERS.map((s, i) => (
        <PhotoSticker key={i} {...s} />
      ))}
      {HERO_TEXT_STAMPS.map((s, i) => (
        <TextStamp key={i} {...s} />
      ))}
    </div>
  )
}

export function SectionSticker({ src, width = 80, rotate = 0, style = {} }) {
  return (
    <motion.img
      src={src}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      style={{
        width, height: 'auto',
        transform: `rotate(${rotate}deg)`,
        filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.15))',
        userSelect: 'none', pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
