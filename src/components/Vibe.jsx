import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Vibe() {
  useEffect(() => {
    // Re-trigger Pinterest widget if pinit.js already ran before this component mounted
    if (window.PinUtils) {
      window.PinUtils.build()
    }
  }, [])

  return (
    <section
      id="vibe"
      style={{ background: '#FAF6EF', padding: '100px 24px', scrollMarginTop: 64, position: 'relative', overflow: 'visible' }}
    >
      {/* Decorative sticker overlapping top edge */}
      <motion.img
        src={`${import.meta.env.BASE_URL}19.png`}
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
        viewport={{ once: true }}
        className="float-slow"
        style={{
          position: 'absolute', top: -32, left: 48,
          width: 80, height: 'auto',
          filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.14))',
          pointerEvents: 'none', zIndex: 4,
        }}
      />

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#E8573A', marginBottom: 12,
          }}>
            Outfit Inspo
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900, color: '#0A1628', margin: '0 0 10px', lineHeight: 1.1,
          }}>
            Dress the Part
          </h2>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic', color: '#E8573A',
            fontSize: '1.1rem', margin: 0,
          }}>
            What to wear in the most beautiful city
          </p>
        </div>

        {/* Pinterest embed — rotated, washi-taped */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            transform: 'rotate(-0.8deg)',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.10)',
            borderRadius: 4,
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          {/* Washi tape */}
          <div style={{
            position: 'absolute', top: -10, left: '50%',
            transform: 'translateX(-50%)',
            width: 88, height: 20,
            background: 'rgba(255, 220, 100, 0.68)',
            zIndex: 10, borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }} />

          <div style={{ borderRadius: 4, overflow: 'hidden', lineHeight: 0 }}>
            <a
              data-pin-do="embedBoard"
              data-pin-board-width="800"
              data-pin-scale-height="500"
              data-pin-scale-width="115"
              href="https://www.pinterest.com/lynzimartin/bom-dia-birthday-outfits/"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            textAlign: 'center', marginTop: 32,
            fontSize: '0.8rem', color: '#0A1628', opacity: 0.45,
            letterSpacing: '0.5px',
          }}
        >
          Saved to Pinterest by Lindsey · tap any image to explore
        </motion.p>
      </div>
    </section>
  )
}
