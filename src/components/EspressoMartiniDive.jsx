import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

// Martini glass SVG
function MartiniGlass() {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100">
      {/* glass bowl */}
      <path d="M5,8 L40,58 L75,8 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* liquid fill */}
      <path d="M14,22 L40,58 L66,22 Z" fill="#3A1A5C" opacity="0.85"/>
      {/* espresso layer */}
      <path d="M14,22 L66,22 L60,30 L20,30 Z" fill="#6B3A1F" opacity="0.7"/>
      {/* crema */}
      <ellipse cx="40" cy="22" rx="26" ry="4" fill="#C8832A" opacity="0.6"/>
      {/* glass stem */}
      <line x1="40" y1="58" x2="40" y2="82" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"/>
      {/* base */}
      <line x1="20" y1="82" x2="60" y2="82" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
      {/* olive on pick -->*/}
      <line x1="26" y1="16" x2="52" y2="28" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
      <circle cx="26" cy="15" r="5" fill="#6B8F3A"/>
      <circle cx="26" cy="15" r="2" fill="#C84B32"/>
      {/* rim shine */}
      <path d="M5,8 L75,8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
    </svg>
  )
}

// Stick figure diver
function Diver({ progress }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      {/* head */}
      <circle cx="14" cy="5" r="4" fill="#FFD23F"/>
      {/* body - angled based on progress */}
      <line x1="14" y1="9" x2="14" y2="18" stroke="#FFD23F" strokeWidth="2.5" strokeLinecap="round"/>
      {/* arms - spread wide */}
      <line x1="6" y1="12" x2="22" y2="12" stroke="#FFD23F" strokeWidth="2.5" strokeLinecap="round"/>
      {/* legs - together pointing down */}
      <line x1="14" y1="18" x2="10" y2="26" stroke="#FFD23F" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="18" x2="18" y2="26" stroke="#FFD23F" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

// Splash droplets
function Splash({ visible }) {
  return (
    <motion.g
      initial={{ opacity: 0, scaleY: 0 }}
      animate={visible ? { opacity: [0, 1, 0], scaleY: [0, 1, 0.5] } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {[[-12, -14], [0, -18], [12, -14], [-20, -8], [20, -8]].map(([x, y], i) => (
        <motion.ellipse
          key={i}
          cx={40 + x}
          cy={22 + y}
          rx="3"
          ry="5"
          fill="#8B6FD4"
          opacity="0.7"
          animate={visible ? {
            cy: [22 + y, 22 + y - 8, 22 + y],
            opacity: [0.7, 0.9, 0],
          } : {}}
          transition={{ duration: 0.5, delay: i * 0.05 }}
        />
      ))}
    </motion.g>
  )
}

export default function EspressoMartiniDive() {
  const controls = useAnimation()
  const [showSplash, setShowSplash] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | diving | splash | reset

  const runAnimation = async () => {
    setPhase('diving')
    setShowSplash(false)
    await controls.start({
      x: [70, 55, 38, 30, 28],
      y: [10, 25, 42, 58, 65],
      rotate: [0, 25, 60, 100, 130],
      transition: { duration: 1.4, ease: [0.2, 0, 0.8, 1] },
    })
    setShowSplash(true)
    setPhase('splash')
    await new Promise(r => setTimeout(r, 700))
    setShowSplash(false)
    await controls.start({
      opacity: 0,
      transition: { duration: 0.2 },
    })
    await new Promise(r => setTimeout(r, 300))
    controls.set({ x: 70, y: 10, rotate: 0, opacity: 1 })
    setPhase('idle')
  }

  useEffect(() => {
    const loop = async () => {
      await new Promise(r => setTimeout(r, 2000))
      while (true) {
        await runAnimation()
        await new Promise(r => setTimeout(r, 3500))
      }
    }
    loop()
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: 28,
        zIndex: 500,
        width: 140,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Label */}
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontStyle: 'italic',
        fontSize: '0.7rem',
        color: 'rgba(10,22,40,0.5)',
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: '0.3px',
      }}>
        it's espresso martini o'clock
      </div>

      {/* Stage */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1052 60%, #0d1b3a 100%)',
        borderRadius: 20,
        padding: '12px 8px 16px',
        border: '2px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(10,22,40,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
        height: 140,
      }}>
        {/* Stars */}
        {[[15,12],[90,20],[110,15],[35,45],[120,50],[20,80],[100,75]].map(([x,y], i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 2,
              height: 2,
              borderRadius: '50%',
              background: 'white',
            }}
          />
        ))}

        {/* Martini glass */}
        <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>
          <MartiniGlass />
        </div>

        {/* Diver */}
        <motion.div
          animate={controls}
          initial={{ x: 70, y: 10, rotate: 0 }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Diver />
        </motion.div>

        {/* Splash overlay as SVG */}
        {showSplash && (
          <div style={{ position: 'absolute', bottom: 52, left: '50%', transform: 'translateX(-50%)' }}>
            <svg width="80" height="40" viewBox="0 0 80 40">
              {[
                [30, 30, -10, -20], [40, 30, 0, -25], [50, 30, 10, -20],
                [20, 30, -20, -12], [60, 30, 20, -12],
              ].map(([x, y, tx, ty], i) => (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="#9B7FE8"
                  initial={{ cx: x, cy: y, opacity: 0.9, r: 3 }}
                  animate={{ cx: x + tx * 0.5, cy: y + ty, opacity: 0, r: 5 }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                />
              ))}
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
