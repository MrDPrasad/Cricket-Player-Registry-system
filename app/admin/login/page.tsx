'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Invalid username or password')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Icon + heading */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 32 }}>
            🛡️
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 44, color: '#fff', lineHeight: 1, marginBottom: 6 }}>Admin Login</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Cricket Registry · Restricted Access</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <Label text="Username" />
              <input
                className="field"
                type="text"
                placeholder="rsb@sullia"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div>
              <Label text="Password" />
              <input
                className="field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', color: '#f87171', fontSize: 13, fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#059669' : '#10b981', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer', marginTop: 4, transition: 'background 0.2s', boxShadow: '0 4px 16px rgba(16,185,129,0.25)' }}
            >
              {loading ? 'Signing in...' : '🔐 Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.12)', fontSize: 12, marginTop: 20 }}>
          Only authorised admin can access this page
        </p>
      </div>
    </div>
  )
}

function Label({ text }: { text: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>{text}</div>
}
