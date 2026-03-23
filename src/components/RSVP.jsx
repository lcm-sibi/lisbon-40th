import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { ACTIVITIES, GUESTS } from '../data/activities'

const VENMO_HANDLE = 'lindseymartin'

// Group activities by day
const DAYS = [...new Set(ACTIVITIES.map(a => a.day))]

function buildDefaultChecked() {
  const out = {}
  ACTIVITIES.forEach(a => { out[a.id] = a.required })
  return out
}

function ActivityRow({ activity, checked, onChange }) {
  const isRequired = activity.required
  return (
    <motion.label
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '16px 20px',
        background: checked ? '#FFFAF5' : '#fff',
        border: `2px solid ${checked ? '#2B4EFF' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 14,
        cursor: isRequired ? 'default' : 'pointer',
        transition: 'all 0.15s',
        boxShadow: checked ? '3px 3px 0 #2B4EFF22' : 'none',
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `2.5px solid ${isRequired ? '#E8573A' : checked ? '#2B4EFF' : 'rgba(0,0,0,0.2)'}`,
        background: checked ? (isRequired ? '#E8573A' : '#2B4EFF') : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
        transition: 'all 0.15s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 900, lineHeight: 1 }}>✓</span>}
        <input
          type="checkbox"
          checked={checked}
          onChange={() => !isRequired && onChange(activity.id)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>{activity.icon}</span>
            <span style={{ fontWeight: 700, color: '#0A1628', fontSize: '0.95rem' }}>{activity.title}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            {isRequired && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                color: '#E8573A', background: '#FFF0ED', padding: '2px 8px', borderRadius: 100,
                border: '1.5px solid #E8573A',
              }}>Required</span>
            )}
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#0A1628', fontSize: '1rem' }}>
              ${activity.cost}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(10,22,40,0.5)', marginTop: 4 }}>
          {activity.time} · {activity.description}
        </div>
      </div>
    </motion.label>
  )
}

function Headcounts({ allRsvps }) {
  return (
    <div style={{ marginTop: 64 }}>
      <div style={{
        fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px',
        textTransform: 'uppercase', color: '#E8573A', marginBottom: 12,
      }}>Who's In</div>
      <h3 style={{
        fontFamily: 'Playfair Display, serif', fontSize: '1.8rem',
        fontWeight: 900, color: '#0A1628', margin: '0 0 32px',
      }}>Activity Headcounts</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ACTIVITIES.map(activity => {
          const signedUp = allRsvps.filter(r => r.activity_id === activity.id).map(r => r.guest_name)
          return (
            <div key={activity.id} style={{
              background: '#fff',
              border: '2px solid rgba(0,0,0,0.08)',
              borderRadius: 14,
              padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: signedUp.length ? 10 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.1rem' }}>{activity.icon}</span>
                  <span style={{ fontWeight: 700, color: '#0A1628', fontSize: '0.95rem' }}>{activity.title}</span>
                </div>
                <span style={{
                  fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.2rem',
                  color: signedUp.length >= 10 ? '#7FAF4E' : '#2B4EFF',
                }}>
                  {signedUp.length}/12
                </span>
              </div>
              {signedUp.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {signedUp.map(name => (
                    <span key={name} style={{
                      fontSize: '0.75rem', fontWeight: 600, color: '#0A1628',
                      background: '#F0F4FF', border: '1px solid #2B4EFF33',
                      borderRadius: 100, padding: '3px 10px',
                    }}>{name.split(' ')[0]}</span>
                  ))}
                </div>
              )}
              {signedUp.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: 'rgba(10,22,40,0.4)' }}>No sign-ups yet</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function RSVP() {
  const [guest, setGuest] = useState('')
  const [checked, setChecked] = useState(buildDefaultChecked())
  const [allRsvps, setAllRsvps] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dbError, setDbError] = useState(false)

  useEffect(() => {
    loadAllRsvps()
  }, [])

  // When guest changes, load their existing RSVPs
  useEffect(() => {
    if (!guest) return
    setSaved(false)
    const base = buildDefaultChecked()
    if (supabase) {
      supabase.from('rsvps').select('activity_id').eq('guest_name', guest).then(({ data }) => {
        if (data) data.forEach(r => { base[r.activity_id] = true })
        setChecked({ ...base })
      })
    } else {
      setChecked(base)
    }
  }, [guest])

  async function loadAllRsvps() {
    if (!supabase) return
    const { data } = await supabase.from('rsvps').select('guest_name, activity_id')
    if (data) setAllRsvps(data)
  }

  const total = useMemo(() =>
    ACTIVITIES.filter(a => checked[a.id]).reduce((sum, a) => sum + a.cost, 0),
    [checked]
  )

  const requiredTotal = ACTIVITIES.filter(a => a.required).reduce((sum, a) => sum + a.cost, 0)
  const optionalTotal = total - requiredTotal

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const handleSubmit = async () => {
    if (!guest) return
    setSaving(true)

    const selectedIds = Object.entries(checked).filter(([, v]) => v).map(([k]) => k)

    if (supabase) {
      // Delete existing RSVPs for this guest then re-insert
      await supabase.from('rsvps').delete().eq('guest_name', guest)
      const rows = selectedIds.map(activity_id => ({ guest_name: guest, activity_id }))
      const { error } = await supabase.from('rsvps').insert(rows)
      if (error) { setDbError(true); setSaving(false); return }
      await loadAllRsvps()
    } else {
      setDbError(true)
    }

    setSaving(false)
    setSaved(true)

    // Open Venmo
    const note = encodeURIComponent(`Lisbon 40th 🇵🇹 - ${ACTIVITIES.filter(a => checked[a.id]).map(a => a.title).join(', ')}`)
    const venmoDeepLink = `venmo://paycharge?txn=pay&recipients=${VENMO_HANDLE}&amount=${total}&note=${note}`
    window.location.href = venmoDeepLink
    setTimeout(() => {
      window.open(`https://venmo.com/u/${VENMO_HANDLE}`, '_blank')
    }, 300)
  }

  return (
    <section
      id="rsvp"
      style={{ background: '#FFF8F0', padding: '100px 24px', scrollMarginTop: 64 }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#FF2D87', marginBottom: 12,
          }}>
            Sign Up & Pay
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            fontWeight: 900, color: '#0A1628', margin: '0 0 12px', lineHeight: 1.1,
          }}>
            RSVP for<br />
            <span style={{ color: '#FF2D87', fontStyle: 'italic' }}>Activities</span>
          </h2>
          <p style={{ color: 'rgba(10,22,40,0.6)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            Select your name, choose your activities, and pay via Venmo. Required events are pre-selected.
          </p>
        </div>

        {/* Step 1: Name */}
        <div style={{ marginBottom: 40 }}>
          <label style={{
            display: 'block', fontWeight: 700, fontSize: '0.85rem',
            letterSpacing: '1px', textTransform: 'uppercase', color: '#0A1628',
            marginBottom: 10, opacity: 0.6,
          }}>
            1 · Who are you?
          </label>
          <select
            value={guest}
            onChange={e => setGuest(e.target.value)}
            style={{
              width: '100%', padding: '14px 18px', fontSize: '1rem',
              border: '2px solid rgba(0,0,0,0.12)', borderRadius: 12,
              outline: 'none', fontFamily: 'DM Sans, sans-serif',
              background: '#fff', cursor: 'pointer', appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230A1628' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 18px center',
              paddingRight: 44,
            }}
          >
            <option value="">Select your name...</option>
            {GUESTS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Step 2: Activities */}
        <AnimatePresence>
          {guest && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 40 }}
            >
              <div style={{
                fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px',
                textTransform: 'uppercase', color: '#0A1628', marginBottom: 20, opacity: 0.6,
              }}>
                2 · What are you joining?
              </div>

              {DAYS.map(day => (
                <div key={day} style={{ marginBottom: 28 }}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px',
                    textTransform: 'uppercase', color: '#E8573A',
                    marginBottom: 10, paddingBottom: 8,
                    borderBottom: '2px solid #E8573A22',
                  }}>
                    {day}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ACTIVITIES.filter(a => a.day === day).map((activity, i) => (
                      <ActivityRow
                        key={activity.id}
                        activity={activity}
                        checked={checked[activity.id]}
                        onChange={toggle}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Total + Submit */}
        <AnimatePresence>
          {guest && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Total breakdown */}
              <div style={{
                background: '#fff',
                border: '3px solid #0A1628',
                borderRadius: 16,
                padding: '24px 28px',
                marginBottom: 16,
                boxShadow: '5px 5px 0 #0A1628',
              }}>
                <div style={{
                  fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px',
                  textTransform: 'uppercase', color: '#0A1628', marginBottom: 16, opacity: 0.5,
                }}>
                  3 · Your Total
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'rgba(10,22,40,0.6)' }}>
                    <span>Required events (Lumi + Rosamar + Frou Frou)</span>
                    <span>${requiredTotal}</span>
                  </div>
                  {optionalTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'rgba(10,22,40,0.6)' }}>
                      <span>Optional add-ons</span>
                      <span>+ ${optionalTotal}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: 12, borderTop: '2px solid rgba(0,0,0,0.08)', marginTop: 4,
                  }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 900, color: '#0A1628' }}>
                      Total to Venmo
                    </span>
                    <span style={{
                      fontFamily: 'Playfair Display, serif', fontSize: '2rem',
                      fontWeight: 900, color: '#FF2D87',
                    }}>
                      ${total}
                    </span>
                  </div>
                </div>
              </div>

              {dbError && (
                <div style={{
                  background: '#FFF0ED', border: '2px solid #E8573A', borderRadius: 12,
                  padding: '12px 16px', marginBottom: 12, fontSize: '0.85rem', color: '#E8573A',
                }}>
                  ⚠️ Database not connected yet — your RSVP wasn't saved. Contact Lindsey to confirm your spot.
                </div>
              )}

              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: '#F0FFF4',
                      border: '3px solid #7FAF4E',
                      borderRadius: 16,
                      padding: '24px',
                      textAlign: 'center',
                      boxShadow: '4px 4px 0 #7FAF4E',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 900, color: '#0A1628', marginBottom: 6 }}>
                      You're in, {guest.split(' ')[0]}!
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(10,22,40,0.6)', marginBottom: 16 }}>
                      RSVP saved. Venmo should be opening — send <strong style={{ color: '#FF2D87' }}>${total}</strong> to <strong>@{VENMO_HANDLE}</strong>.
                    </div>
                    <a
                      href={`https://venmo.com/u/${VENMO_HANDLE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block', padding: '12px 28px',
                        background: '#008CFF', color: '#fff', borderRadius: 12,
                        fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                        boxShadow: '3px 3px 0 #005ab3',
                      }}
                    >
                      Open Venmo → Pay ${total}
                    </a>
                    <div style={{ marginTop: 12 }}>
                      <button
                        onClick={() => setSaved(false)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'rgba(10,22,40,0.4)', fontSize: '0.85rem', textDecoration: 'underline',
                        }}
                      >
                        Update my RSVP
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    onClick={handleSubmit}
                    disabled={saving}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '18px',
                      background: saving ? 'rgba(10,22,40,0.4)' : '#0A1628',
                      color: '#fff', border: 'none', borderRadius: 14,
                      fontSize: '1.05rem', fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      boxShadow: saving ? 'none' : '5px 5px 0 #FF2D87',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}
                  >
                    {saving ? 'Saving...' : `Confirm & Pay $${total} via Venmo →`}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Headcounts */}
        <Headcounts allRsvps={allRsvps} />
      </div>
    </section>
  )
}
