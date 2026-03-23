import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { categories, CENTER, AIRBNB, HOTEL } from '../data/locations'

function createIcon(color, emoji, size = 36) {
  return L.divIcon({
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:3px solid #fff;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:${size * 0.44}px;
        box-shadow:0 3px 10px rgba(0,0,0,0.3);
        cursor:pointer;
      ">${emoji}</div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  })
}

const homeIcon = createIcon('#0A1628', '🏡', 40)
const hotelIcon = createIcon('#0A1628', '🏨', 40)

function FlyTo({ coords }) {
  const map = useMap()
  map.flyTo(coords, 15, { duration: 1 })
  return null
}

// Push-pin SVG above the map
function PushPin({ color = '#E8573A' }) {
  return (
    <div style={{
      position: 'absolute',
      top: -14,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
      pointerEvents: 'none',
    }}>
      <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="10" r="10" fill={color} />
        <circle cx="12" cy="10" r="5" fill="rgba(255,255,255,0.35)" />
        <line x1="12" y1="20" x2="12" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function MapSection() {
  const [activeCategory, setActiveCategory] = useState('food')
  const [flyTo, setFlyTo] = useState(null)

  const catKeys = Object.keys(categories)
  const cat = categories[activeCategory]

  const handlePlaceClick = (place) => {
    setFlyTo([place.lat, place.lng])
    setTimeout(() => setFlyTo(null), 100)
  }

  return (
    <section
      id="map"
      className="journal-bg"
      style={{ padding: '100px 24px', scrollMarginTop: 64 }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#2B4EFF', marginBottom: 12,
          }}>
            Explore Lisboa
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900, color: '#0A1628', margin: 0, lineHeight: 1.1,
          }}>
            The Best of the City —<br />
            <span style={{ color: '#2B4EFF', fontStyle: 'italic' }}>Curated for Us</span>
          </h2>
        </div>

        {/* Category toggle */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
          {catKeys.map((key) => {
            const c = categories[key]
            const isActive = activeCategory === key
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  background: isActive ? c.color : '#fff',
                  color: isActive ? '#fff' : '#0A1628',
                  border: `2px solid ${c.color}`,
                  borderRadius: 100,
                  padding: '10px 22px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? `3px 3px 0 ${c.color}88` : 'none',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {c.emoji} {c.label}
              </button>
            )
          })}
        </div>

        {/* Map + list layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          {/* Map — pinned into the page */}
          <div style={{ position: 'relative' }}>
            <PushPin color={cat.color} />
            {/* Slightly rotated wrapper for pinned feel */}
            <div style={{
              transform: 'rotate(-0.4deg)',
              transformOrigin: 'top center',
              borderRadius: 22,
              boxShadow: `6px 6px 0 ${cat.color}55, 0 12px 40px rgba(0,0,0,0.12)`,
              border: `3px solid ${cat.color}`,
              overflow: 'hidden',
              height: 520,
            }}>
              <MapContainer
                center={CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                {flyTo && <FlyTo coords={flyTo} />}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <Marker position={[AIRBNB.lat, AIRBNB.lng]} icon={homeIcon}>
                  <Popup>
                    <strong>🏡 {AIRBNB.name}</strong><br />
                    <small>{AIRBNB.address}</small>
                  </Popup>
                </Marker>
                <Marker position={[HOTEL.lat, HOTEL.lng]} icon={hotelIcon}>
                  <Popup>
                    <strong>🏨 {HOTEL.name}</strong><br />
                    <small>{HOTEL.address}</small>
                  </Popup>
                </Marker>
                {cat.places.map((place) => (
                  <Marker
                    key={place.name}
                    position={[place.lat, place.lng]}
                    icon={createIcon(cat.markerColor, cat.emoji, 34)}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', minWidth: 180 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{place.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: 6 }}>{place.address}</div>
                        <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{place.description}</p>
                        {place.tags && (
                          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {place.tags.map(t => (
                              <span key={t} style={{
                                background: `${cat.color}22`, color: cat.color,
                                padding: '2px 8px', borderRadius: 100,
                                fontSize: '0.7rem', fontWeight: 600,
                              }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Place list — stacked paper notes */}
          {(() => {
            const noteColors = ['#FFFAF5', '#FFF5F0', '#F5F8FF', '#FDFFF5', '#FFF8EE']
            const noteRots   = [1.1, -0.8, 1.4, -0.5, 0.9, -1.2, 0.6]
            return (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                maxHeight: 520, overflowY: 'auto', paddingRight: 4, paddingLeft: 4, paddingTop: 4,
              }}>
                {cat.places.map((place, idx) => {
                  const rot = noteRots[idx % noteRots.length]
                  const bg  = noteColors[idx % noteColors.length]
                  return (
                    <button
                      key={place.name}
                      onClick={() => handlePlaceClick(place)}
                      style={{
                        background: bg,
                        border: `1.5px solid rgba(0,0,0,0.08)`,
                        borderRadius: 6,
                        padding: '13px 16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif',
                        transform: `rotate(${rot}deg)`,
                        boxShadow: '2px 3px 10px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'rotate(0deg) translateY(-4px)'
                        e.currentTarget.style.boxShadow = `3px 5px 16px rgba(0,0,0,0.13), 3px 3px 0 ${cat.color}66`
                        e.currentTarget.style.zIndex = '5'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = `rotate(${rot}deg)`
                        e.currentTarget.style.boxShadow = '2px 3px 10px rgba(0,0,0,0.08)'
                        e.currentTarget.style.zIndex = ''
                      }}
                    >
                      {/* Subtle ruled line at top */}
                      <div style={{
                        position: 'absolute', top: 0, left: 16, right: 16, height: 1,
                        background: `${cat.color}22`,
                      }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{
                          width: 24, height: 24, background: cat.color, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', flexShrink: 0,
                        }}>{cat.emoji}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A1628' }}>{place.name}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#0A1628', opacity: 0.58, margin: 0, lineHeight: 1.5 }}>
                        {place.description.slice(0, 80)}…
                      </p>
                      {place.tags?.includes('must do') && (
                        <span style={{
                          display: 'inline-block', marginTop: 6,
                          background: '#FFD23F', color: '#0A1628',
                          padding: '2px 8px', borderRadius: 100,
                          fontSize: '0.62rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '1px',
                        }}>⭐ Must Do</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })()}

        </div>

        {/* Legend */}
        <div style={{
          marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap',
          fontSize: '0.8rem', color: '#0A1628', opacity: 0.6, alignItems: 'center',
        }}>
          <span>🏡 Airbnb</span>
          <span>🏨 Hotel</span>
          <span>Click a place in the list to zoom in on the map.</span>
        </div>
      </div>
    </section>
  )
}
