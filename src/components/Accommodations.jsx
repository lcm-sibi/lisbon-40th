import { motion } from 'framer-motion'

const AIRBNB = {
  name: "The Alfama Airbnb",
  address: "CC do Correio Velho 8, 1100-534 Lisboa",
  neighborhood: "Alfama",
  description: "Our home base in the oldest and most charming neighborhood in Lisbon. Cobblestone streets, tiled facades, and the sound of fado drifting from nearby restaurants. This is where the magic starts.",
  color: "#E8573A",
  bg: "#FFF0ED",
  emoji: "🏡",
  details: [
    "Historic Alfama neighborhood",
    "Walking distance to São Jorge Castle",
    "Steps from local restaurants & bars",
    "The official group HQ",
  ],
  tapeRot: -2,
}

const HOTEL = {
  name: "Pousada Alfama",
  address: "Alfama, Lisboa",
  neighborhood: "Alfama",
  description: "The group's hotel nestled right in the heart of Alfama — same neighborhood as the Airbnb, so everyone is always just a short walk away from each other.",
  color: "#2B4EFF",
  bg: "#E8F0FF",
  emoji: "🏨",
  details: [
    "Heart of Alfama neighborhood",
    "Steps from the Airbnb",
    "Boutique hotel experience",
    "Easy walkability to all activities",
  ],
  tapeRot: 2.5,
}

// Photo corner triangles — top-left and bottom-right
function PhotoCorners({ color }) {
  const cornerStyle = (pos) => ({
    position: 'absolute',
    width: 18,
    height: 18,
    ...pos,
    background: 'transparent',
    borderColor: color,
    borderStyle: 'solid',
    opacity: 0.5,
  })

  return (
    <>
      {/* top-left */}
      <div style={{ ...cornerStyle({ top: 10, left: 10 }), borderWidth: '2px 0 0 2px' }} />
      {/* top-right */}
      <div style={{ ...cornerStyle({ top: 10, right: 10 }), borderWidth: '2px 2px 0 0' }} />
      {/* bottom-left */}
      <div style={{ ...cornerStyle({ bottom: 10, left: 10 }), borderWidth: '0 0 2px 2px' }} />
      {/* bottom-right */}
      <div style={{ ...cornerStyle({ bottom: 10, right: 10 }), borderWidth: '0 2px 2px 0' }} />
    </>
  )
}

function AccommodationCard({ place, index }) {
  return (
    // Wrapper for tape strip positioning + postcard rotation
    <div style={{
      position: 'relative', paddingTop: 14,
      transform: `rotate(${index === 0 ? -1.2 : 1.4}deg)`,
      transition: 'transform 0.2s',
    }}>
      {/* Tape strip across top */}
      <div style={{
        position: 'absolute',
        top: 4,
        left: 32,
        width: 72,
        height: 22,
        background: 'rgba(255, 243, 180, 0.82)',
        transform: `rotate(${place.tapeRot}deg)`,
        boxShadow: '1px 1px 3px rgba(0,0,0,0.08)',
        zIndex: 2,
        pointerEvents: 'none',
        borderRadius: 1,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 }}
        whileHover={{ y: -6, boxShadow: `8px 8px 0 ${place.color}88, 0 16px 40px rgba(0,0,0,0.12)`, transition: { duration: 0.18 } }}
        style={{
          background: '#fff',
          border: `4px solid ${place.color}`,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: `6px 6px 0 ${place.color}88, 0 8px 28px rgba(0,0,0,0.08)`,
          position: 'relative',
        }}
      >
        <PhotoCorners color={place.color} />

        {/* Color header */}
        <div style={{
          background: place.color, padding: '28px 32px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span style={{ fontSize: '3rem' }}>{place.emoji}</span>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
              {place.name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 4 }}>
              📍 {place.neighborhood}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ fontSize: '0.8rem', color: place.color, fontWeight: 600, marginBottom: 12 }}>
            {place.address}
          </div>
          <p style={{ color: '#0A1628', lineHeight: 1.7, marginBottom: 24, opacity: 0.8 }}>
            {place.description}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {place.details.map((d, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: '#0A1628' }}>
                <span style={{
                  width: 24, height: 24,
                  background: place.bg, border: `2px solid ${place.color}`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0,
                  color: place.color, fontWeight: 700,
                }}>✓</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default function Accommodations() {
  return (
    <section
      id="stay"
      style={{ background: '#F0F4FF', padding: '100px 24px', scrollMarginTop: 64 }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#2B4EFF', marginBottom: 12,
          }}>
            Where We're Staying
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900, color: '#0A1628', margin: 0, lineHeight: 1.1,
          }}>
            Home Base<br />
            <span style={{ color: '#FFD23F', fontStyle: 'italic' }}>in the Heart of Alfama</span>
          </h2>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 40 }}>
          <AccommodationCard place={AIRBNB} index={0} />
          <AccommodationCard place={HOTEL} index={1} />
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: 40, padding: '20px 24px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, color: 'rgba(10,22,40,0.6)',
            fontSize: '0.9rem', lineHeight: 1.6,
          }}
        >
          💡 Both properties are within easy walking distance of each other — no one gets left behind.
        </motion.div>
      </div>
    </section>
  )
}
