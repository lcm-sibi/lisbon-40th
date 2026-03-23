import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Itinerary from './components/Itinerary'
import Guests from './components/Guests'
import Accommodations from './components/Accommodations'
import MapSection from './components/MapSection'
import RSVP from './components/RSVP'
import Vibe from './components/Vibe'
import PasswordGate from './components/PasswordGate'

export default function App() {
  // Sardine cursor
  useEffect(() => {
    const sardineUrl = `${import.meta.env.BASE_URL}ardine-cursor.png`
    document.body.style.cursor = `url('${sardineUrl}') 0 14, auto`
    return () => { document.body.style.cursor = '' }
  }, [])

  return (
    <PasswordGate>
    <div className="min-h-screen" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <Nav />
      <Hero />
      <Itinerary />
      <Guests />
      <Accommodations />
      <MapSection />
      <Vibe />
      <RSVP />
      <footer className="py-8 text-center text-sm" style={{ background: '#0A1628', color: '#FFF8F0' }}>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
          With love, from Lisboa 🇵🇹
        </p>
        <p className="mt-2 opacity-50">May 13–17, 2026</p>
      </footer>

    </div>
    </PasswordGate>
  )
}
