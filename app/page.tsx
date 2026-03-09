'use client'
import { useState, useRef, useEffect, FormEvent } from 'react'
import Image from 'next/image'
import { ToastProvider, useToast } from '@/components/Toast'

function RegisterPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [teams, setTeams] = useState<string[]>([])
  const [stats, setStats] = useState<{ total_players: number; total_teams: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    fetch('/api/init', { method: 'POST' }).catch(() => {})
    fetch('/api/teams')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setTeams(d.map((t: any) => t.name)) })
      .catch(() => {})
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d && !d.error) setStats(d) })
      .catch(() => {})
  }, [])

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData(formRef.current!)
      const res = await fetch('/api/players', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`${data.name} registered successfully!`)
      formRef.current?.reset()
      setPreview(null)
      fetch('/api/stats').then(r => r.json()).then(d => { if (d && !d.error) setStats(d) }).catch(() => {})
      fetch('/api/teams').then(r => r.json()).then(d => { if (Array.isArray(d)) setTeams(d.map((t: any) => t.name)) }).catch(() => {})
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const types = [
    { value: 'batsman',      icon: '🏏', label: 'Batsman',     desc: 'Top/middle order' },
    { value: 'bowler',       icon: '⚡', label: 'Bowler',      desc: 'Pace or spin' },
    { value: 'all-rounder',  icon: '⭐', label: 'All-Rounder', desc: 'Bat & bowl' },
    { value: 'wicketkeeper', icon: '🧤', label: 'Keeper',      desc: 'Behind stumps' },
  ]

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 16px' }}>

      {/* Hero text */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', padding: '6px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#10b981', marginBottom: 16 }}>
          <div className="dot-live" /> Registration Open
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 64, color: '#fff', lineHeight: 1, marginBottom: 10 }}>
          <span className="grad">Register</span><br />Your Player
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16 }}>Add cricketers with full profile details</p>
      </div>

      {/* Stats pills */}
      {stats && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          <Pill value={stats.total_players} label="Players" color="#10b981" />
          <Pill value={stats.total_teams}   label="Teams"   color="#f59e0b" />
        </div>
      )}

      {/* Form */}
      <div className="card" style={{ padding: '28px 28px 32px' }}>
        <form ref={formRef} onSubmit={handleSubmit}>

          {/* Photo */}
          <div style={{ marginBottom: 24 }}>
            <Label text="Player Photo" />
            <input ref={fileRef} type="file" name="photo" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${preview ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 16, cursor: 'pointer',
                overflow: 'hidden',
                height: preview ? 200 : 130,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 10,
                background: preview ? 'transparent' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s', position: 'relative',
              }}
            >
              {preview ? (
                <>
                  <Image src={preview} alt="Preview" fill style={{ objectFit: 'cover' }} sizes="600px" />
                  <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 999, backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}>
                    Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28 }}>📷</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600 }}>Click to upload photo</div>
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 2 }}>JPG, PNG up to 5MB</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Name + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <Label text="Full Name *" />
              <input name="name" required className="field" placeholder="e.g. Virat Kohli" />
            </div>
            <div>
              <Label text="Phone Number" />
              <input name="phone" type="tel" className="field" placeholder="+91 98765 43210" />
            </div>
          </div>

          {/* Previous Team */}
          <div style={{ marginBottom: 14 }}>
            <Label text="Previous Team" />
            <input name="previous_team" className="field" placeholder="Previous club or team" list="prevTeams" />
            <datalist id="prevTeams">{teams.map(t => <option key={t} value={t} />)}</datalist>
          </div>

          {/* Current Team */}
          <div style={{ marginBottom: 22 }}>
            <Label text="Register to Team" />
            <input name="team_name" className="field" placeholder="Type team name — new teams are auto-created" list="teamsList" autoComplete="off" />
            <datalist id="teamsList">{teams.map(t => <option key={t} value={t} />)}</datalist>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>New team names are automatically added to the registry</div>
          </div>

          {/* Player Type */}
          <div style={{ marginBottom: 28 }}>
            <Label text="Player Type *" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {types.map(({ value, icon, label, desc }) => (
                <div key={value}>
                  <input type="radio" name="type" id={`t-${value}`} value={value} style={{ display: 'none' }} required />
                  <label
                    htmlFor={`t-${value}`}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.4)' }}
                    onMouseLeave={e => {
                      const input = document.getElementById(`t-${value}`) as HTMLInputElement
                      if (!input?.checked) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'
                    }}
                  >
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{desc}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, background: loading ? '#059669' : '#10b981', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s', boxShadow: '0 6px 20px rgba(16,185,129,0.25)' }}
            >
              {loading ? 'Registering...' : '✓ Register Player'}
            </button>
            <button
              type="reset"
              onClick={() => setPreview(null)}
              style={{ padding: '15px 22px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600 }}
            >
              Reset
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

function Pill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '6px 16px', borderRadius: 999, fontSize: 13 }}>
      <span style={{ fontWeight: 700, color }}>{value}</span>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
    </div>
  )
}

function Label({ text }: { text: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>{text}</div>
}

export default function Home() {
  return (
    <ToastProvider>
      <RegisterPage />
    </ToastProvider>
  )
}
