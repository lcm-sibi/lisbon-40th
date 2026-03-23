import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { itinerary } from '../data/itinerary'

const typeColors = {
  food: '#E8573A',
  sightseeing: '#2B4EFF',
  shopping: '#FF2D87',
  logistics: '#7FAF4E',
}

const typeLabels = {
  food: 'Food & Drink',
  sightseeing: 'Sightseeing',
  shopping: 'Shopping',
  logistics: 'Logistics',
}

// Tiny rotation for staggered event cards — subtle tactile variance
const CARD_ROTS = [0.35, -0.28, 0.42, -0.18, 0.31, -0.38, 0.22]

// Tab rotations — sticker/folder feel
const TAB_ROTS = [-1.4, 0.9, -1.1, 0.7, -0.5]

export default function Itinerary() {
  const [activeDay, setActiveDay] = useState(0)
  const day = itinerary[activeDay]

  return (
    <section
      id="itinerary"
      style={{ background: '#FFF0E8', padding: '100px 24px', scrollMarginTop: 64, position: 'relative', overflow: 'visible' }}
    >
      {/* Small sticker overlapping the section top-right corner */}
      <motion.img
        src={`${import.meta.env.BASE_URL}14.png`}
        initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 22 }}
        viewport={{ once: true }}
        className="float-slow"
        style={{
          position: 'absolute', top: -28, right: 32,
          width: 72, height: 'auto',
          filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.15))',
          pointerEvents: 'none', zIndex: 4,
        }}
      />
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#E8573A', marginBottom: 12,
          }}>
            The Plan
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900, color: '#0A1628', margin: 0, lineHeight: 1.1,
          }}>
            5 Days in<br />
            <span style={{ color: '#E8573A', fontStyle: 'italic' }}>The Most Beautiful City</span>
          </h2>
        </div>

        {/* Day tabs — sticker/folder style */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 0, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {itinerary.map((d, i) => {
            const isActive = activeDay === i
            const rot = TAB_ROTS[i % TAB_ROTS.length]
            return (
              <motion.button
                key={i}
                onClick={() => setActiveDay(i)}
                animate={{ rotate: isActive ? 0 : rot, y: isActive ? 0 : 2 }}
                whileHover={{ rotate: rot * 0.3, y: -1 }}
                transition={{ duration: 0.15 }}
                style={{
                  background: isActive ? d.color : '#fff',
                  color: isActive ? '#fff' : '#0A1628',
                  border: `2.5px solid ${d.color}`,
                  // folder tab shape: square top, no bottom border when active
                  borderRadius: '10px 10px 0 0',
                  borderBottom: isActive ? `2.5px solid ${d.color}` : '2.5px solid transparent',
                  padding: '10px 18px 12px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: isActive ? `2px -2px 0 ${d.color}44` : `2px -1px 4px rgba(0,0,0,0.06)`,
                  transformOrigin: 'bottom center',
                  position: 'relative',
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <span style={{ marginRight: 6 }}>{d.emoji}</span>
                {d.label} {d.date}
              </motion.button>
            )
          })}
        </div>

        {/* Day content — sits on top of tab row */}
        <div style={{
          background: '#fff',
          borderRadius: '0 16px 16px 16px',
          border: `2.5px solid ${day.color}`,
          padding: '32px 28px',
          boxShadow: `4px 4px 0 ${day.color}22`,
          position: 'relative',
          zIndex: 1,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              {/* Day header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32,
                padding: '16px 20px', background: day.color + '12',
                borderRadius: 12, borderLeft: `5px solid ${day.color}`,
              }}>
                <span style={{ fontSize: '2rem' }}>{day.emoji}</span>
                <div>
                  <div style={{ color: day.color, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {day.day}, {day.date}
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#0A1628', fontWeight: 700 }}>
                    {day.theme}
                  </div>
                </div>
              </div>

              {/* Events */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 24, top: 0, bottom: 0,
                  width: 2,
                  background: `linear-gradient(to bottom, ${day.color}, transparent)`,
                  opacity: 0.2,
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 8 }}>
                  {day.events.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, rotate: CARD_ROTS[i % CARD_ROTS.length] }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{
                        y: -4,
                        rotate: 0,
                        boxShadow: `3px 3px 0 ${day.color}44`,
                        transition: { duration: 0.15 },
                      }}
                      style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}
                    >
                      {/* Icon dot */}
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: typeColors[event.type] || '#888',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', flexShrink: 0, zIndex: 1,
                      }}>
                        {event.icon}
                      </div>

                      {/* Content card */}
                      <div style={{
                        flex: 1,
                        background: '#FFFAF5',
                        border: `1px solid rgba(0,0,0,0.06)`,
                        borderRadius: 10,
                        padding: '14px 20px',
                        marginBottom: 4,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: '#0A1628', fontSize: '1rem' }}>{event.title}</span>
                            {event.link && (
                              <a href={event.link} target="_blank" rel="noopener noreferrer" style={{
                                fontSize: '0.65rem', fontWeight: 700, color: day.color,
                                border: `1px solid ${day.color}`, borderRadius: 100,
                                padding: '2px 8px', textDecoration: 'none', letterSpacing: '0.5px',
                                textTransform: 'uppercase', opacity: 0.85,
                              }}>↗ Website</a>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px',
                              textTransform: 'uppercase', color: typeColors[event.type] || '#888',
                              background: `${typeColors[event.type]}18`, padding: '3px 8px', borderRadius: 100,
                            }}>
                              {typeLabels[event.type]}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>
                              {event.time}
                            </span>
                          </div>
                        </div>
                        <p style={{ color: 'rgba(10,22,40,0.6)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
