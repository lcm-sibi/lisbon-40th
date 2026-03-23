import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PASSWORD = 'lisboa2026'

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(() => localStorage.getItem('lisbon_authed') === 'true')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  if (authed) return children

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.toLowerCase().trim() === PASSWORD) {
      localStorage.setItem('lisbon_authed', 'true')
      setAuthed(true)
    } else {
      setError(true)
      setShaking(true)
      setInput('')
      setTimeout(() => { setError(false); setShaking(false) }, 2000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFAF5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      padding: '24px',
    }}>
      <motion.div
        animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          textAlign: 'center',
          padding: '48px 40px',
          background: '#fff',
          borderRadius: 24,
          border: `3px solid ${error ? '#FF2D87' : '#0A1628'}`,
          boxShadow: `6px 6px 0 ${error ? '#FF2D87' : '#0A1628'}`,
          maxWidth: 400,
          width: '100%',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🇵🇹</div>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2rem',
          fontWeight: 900,
          color: '#0A1628',
          margin: '0 0 8px',
        }}>
          40 in Lisboa
        </h1>
        <p style={{ color: 'rgba(10,22,40,0.5)', marginBottom: 32, fontSize: '0.95rem', margin: '0 0 32px' }}>
          Enter the password to continue
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '1rem',
              border: `2px solid ${error ? '#FF2D87' : 'rgba(0,0,0,0.15)'}`,
              borderRadius: 12,
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
              marginBottom: error ? 8 : 16,
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              background: '#FFFAF5',
            }}
          />
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#FF2D87', fontSize: '0.85rem', marginBottom: 12, marginTop: 0 }}
              >
                Wrong password — try again!
              </motion.p>
            )}
          </AnimatePresence>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#2B4EFF',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: '3px 3px 0 #1a35cc',
              transition: 'transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translate(2px,2px)'}
            onMouseUp={e => e.currentTarget.style.transform = ''}
          >
            Let me in ✈️
          </button>
        </form>
      </motion.div>
    </div>
  )
}
