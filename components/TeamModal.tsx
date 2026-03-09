'use client'
import { useState, useEffect, FormEvent } from 'react'
import { Team, Player } from '@/lib/types'
import { useToast } from './Toast'

interface Props {
  team: Team | null
  players: Player[]
  onClose: () => void
  onSaved: () => void
}

export default function TeamModal({ team, players, onClose, onSaved }: Props) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [captainId, setCaptainId] = useState('')
  const [vcId, setVcId] = useState('')
  const [wkId, setWkId] = useState('')

  useEffect(() => {
    if (team) {
      setName(team.name)
      setCaptainId(team.captain_id ? String(team.captain_id) : '')
      setVcId(team.vice_captain_id ? String(team.vice_captain_id) : '')
      setWkId(team.wicketkeeper_id ? String(team.wicketkeeper_id) : '')
    }
  }, [team])

  const teamPlayers = team ? players.filter(p => p.team_id === team.id) : players

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const body = {
        name: name.trim(),
        captain_id:      captainId ? Number(captainId) : null,
        vice_captain_id: vcId      ? Number(vcId)      : null,
        wicketkeeper_id: wkId      ? Number(wkId)      : null,
      }
      const url = team ? `/api/teams/${team.id}` : '/api/teams'
      const method = team ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      showToast(team ? 'Team updated!' : 'Team created!')
      onSaved()
      onClose()
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const sel = (value: string, onChange: (v: string) => void, placeholder: string) => (
    <select className="field" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {teamPlayers.map(p => (
        <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
      ))}
    </select>
  )

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="modal-in" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, borderRadius: 24, background: '#162516', border: '1px solid rgba(255,255,255,0.09)', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 30, color: '#fff' }}>{team ? 'Edit Team' : 'New Team'}</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff', cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', fontSize: 16 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Label text="Team Name *" />
            <input className="field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mumbai Warriors" required />
          </div>

          <div>
            <Label text="🟡 Captain" />
            {sel(captainId, setCaptainId, '— Select Captain —')}
          </div>

          <div>
            <Label text="🟣 Vice Captain" />
            {sel(vcId, setVcId, '— Select Vice Captain —')}
          </div>

          <div>
            <Label text="🟤 Wicketkeeper" />
            {sel(wkId, setWkId, '— Select Wicketkeeper —')}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, background: loading ? '#059669' : '#10b981', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s' }}>
              {loading ? 'Saving...' : '✓ Save Team'}
            </button>
            <button type="button" onClick={onClose} style={{ padding: '14px 22px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 600 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Label({ text }: { text: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>{text}</div>
}
