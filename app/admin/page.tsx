'use client'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import PlayerCard from '@/components/PlayerCard'
import PlayerModal from '@/components/PlayerModal'
import TeamModal from '@/components/TeamModal'
import { ToastProvider, useToast } from '@/components/Toast'
import { Player, Team, Stats } from '@/lib/types'

function AdminDashboard() {
  const router = useRouter()
  const { showToast } = useToast()

  const [players,  setPlayers]  = useState<Player[]>([])
  const [teams,    setTeams]    = useState<Team[]>([])
  const [stats,    setStats]    = useState<Stats | null>(null)
  const [loading,  setLoading]  = useState(true)

  // Filters
  const [teamFilter, setTeamFilter] = useState<number | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [search,     setSearch]     = useState('')

  // Modals
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [teamModalData,  setTeamModalData]  = useState<Team | null | undefined>(undefined)

  // Moderator panel: players selected to feature / moderate
  const [moderated, setModerated] = useState<Set<number>>(new Set())

  const loadAll = async () => {
    try {
      const [t, p, s] = await Promise.all([
        fetch('/api/teams').then(r => r.json()),
        fetch('/api/players').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
      ])
      if (Array.isArray(t)) setTeams(t)
      if (Array.isArray(p)) setPlayers(p)
      if (s && !s.error)   setStats(s)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  // Filtered view
  const filtered = useMemo(() => {
    return players.filter(p => {
      if (teamFilter && p.team_id !== teamFilter) return false
      if (typeFilter && p.type !== typeFilter)     return false
      if (search) {
        const q = search.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !(p.team_name ?? '').toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [players, teamFilter, typeFilter, search])

  const handleDeletePlayer = async (id: number) => {
    try {
      const res = await fetch(`/api/players/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setPlayers(prev => prev.filter(p => p.id !== id))
      setModerated(prev => { const n = new Set(prev); n.delete(id); return n })
      setSelectedPlayer(null)
      showToast('Player removed')
      loadAll()
    } catch {
      showToast('Delete failed', 'error')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const toggleModerate = (id: number) => {
    setModerated(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const chipCls = (active: boolean): React.CSSProperties => ({
    padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
    background: active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
    color: active ? '#6ee7b7' : 'rgba(255,255,255,0.45)',
    borderWidth: 1, borderStyle: 'solid',
    borderColor: active ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.07)',
    transition: 'all 0.18s',
  })

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#10b981', marginBottom: 10 }}>
            🛡️ Admin Dashboard
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 52, color: '#fff', lineHeight: 1 }}>Team Management</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setTeamModalData(null)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.25)' }}>
            + Add Team
          </button>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Log Out
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { val: stats.total_players, label: 'Players',      color: '#10b981' },
            { val: stats.total_teams,   label: 'Teams',        color: '#f59e0b' },
            { val: stats.batsmen,       label: '🏏 Batsmen',   color: '#fbbf24' },
            { val: stats.bowlers,       label: '⚡ Bowlers',    color: '#ef4444' },
            { val: stats.allrounders,   label: '⭐ All-Round', color: '#10b981' },
            { val: stats.wicketkeepers, label: '🧤 Keepers',   color: '#a78bfa' },
          ].map(({ val, label, color }) => (
            <div key={label} className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color }}>{val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Teams overview */}
      {teams.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 26, color: '#fff', marginBottom: 14 }}>Teams Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {teams.map(team => (
              <div key={team.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 22, color: '#fff', lineHeight: 1 }}>{team.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setTeamModalData(team)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', borderRadius: 8, width: 28, height: 28, fontSize: 13 }}>✏️</button>
                  </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {team.captain_name       && <RoleBadge label="C"  name={team.captain_name}       bg="#f59e0b" color="#1a1a00" />}
                  {team.vice_captain_name  && <RoleBadge label="VC" name={team.vice_captain_name}  bg="#6366f1" color="#fff" />}
                  {team.wicketkeeper_name  && <RoleBadge label="WK" name={team.wicketkeeper_name}  bg="#a78bfa" color="#fff" />}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                  {team.player_count} players
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PLAYERS SECTION ===== */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 30, color: '#fff' }}>
          All Players <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 22 }}>({filtered.length})</span>
        </h2>
        <input
          className="field"
          style={{ width: 220, padding: '9px 14px', fontSize: 13 }}
          placeholder="🔍  Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Team filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <button style={chipCls(teamFilter === null)} onClick={() => setTeamFilter(null)}>All Teams</button>
        {teams.map(t => (
          <button key={t.id} style={chipCls(teamFilter === t.id)} onClick={() => setTeamFilter(teamFilter === t.id ? null : t.id)}>
            {t.name} ({t.player_count})
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {[['', 'All Types'], ['batsman', '🏏 Batsman'], ['bowler', '⚡ Bowler'], ['all-rounder', '⭐ All-Rounder'], ['wicketkeeper', '🧤 Keeper']].map(([val, label]) => (
          <button key={val} style={chipCls(typeFilter === val)} onClick={() => setTypeFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      {/* Moderated set notice */}
      {moderated.size > 0 && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '12px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ color: '#6ee7b7', fontWeight: 600, fontSize: 14 }}>⭐ {moderated.size} player{moderated.size > 1 ? 's' : ''} marked as featured / moderated</span>
          <button onClick={() => setModerated(new Set())} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13 }}>Clear all</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🏏</div>
          <p style={{ fontSize: 18, fontWeight: 600 }}>No players found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ position: 'relative' }}>
              <PlayerCard player={p} onClick={() => setSelectedPlayer(p)} />
              {/* Moderate toggle */}
              <button
                onClick={() => toggleModerate(p.id)}
                title={moderated.has(p.id) ? 'Remove from featured' : 'Mark as featured'}
                style={{
                  position: 'absolute', top: 8, left: 8,
                  width: 26, height: 26, borderRadius: 8, border: 'none', cursor: 'pointer', zIndex: 10,
                  background: moderated.has(p.id) ? '#f59e0b' : 'rgba(0,0,0,0.5)',
                  color: moderated.has(p.id) ? '#1a1a00' : 'rgba(255,255,255,0.5)',
                  fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.18s',
                }}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Featured / Moderated Players section */}
      {moderated.size > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 28, color: '#f59e0b', marginBottom: 16 }}>⭐ Featured Players</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {players.filter(p => moderated.has(p.id)).map(p => (
              <FeaturedRow key={p.id} player={p} onRemove={() => toggleModerate(p.id)} onClick={() => setSelectedPlayer(p)} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} onDelete={handleDeletePlayer} />
      )}
      {teamModalData !== undefined && (
        <TeamModal team={teamModalData} players={players} onClose={() => setTeamModalData(undefined)} onSaved={loadAll} />
      )}
    </div>
  )
}

function RoleBadge({ label, name, bg, color }: { label: string; name: string; bg: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${bg}18`, border: `1px solid ${bg}30`, padding: '3px 8px', borderRadius: 8, fontSize: 11 }}>
      <span style={{ width: 16, height: 16, borderRadius: 4, background: bg, color, fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{name}</span>
    </div>
  )
}

function FeaturedRow({ player, onRemove, onClick }: { player: Player; onRemove: () => void; onClick: () => void }) {
  const ROLE: Record<string, string> = { batsman: '🏏', bowler: '⚡', 'all-rounder': '⭐', wicketkeeper: '🧤' }
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ position: 'relative', width: 52, height: 52, borderRadius: 12, overflow: 'hidden', background: '#1a2e1a', flexShrink: 0 }}>
        {player.photo_url
          ? <Image src={player.photo_url} alt={player.name} fill style={{ objectFit: 'cover' }} sizes="52px" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: 'rgba(255,255,255,0.1)' }}>{player.name.charAt(0)}</div>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{ROLE[player.type]} {player.type} · {player.team_name ?? 'No team'}</div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onRemove() }}
        style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}
        title="Remove from featured"
      >
        ★
      </button>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminDashboard />
    </ToastProvider>
  )
}
