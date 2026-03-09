'use client'
import Image from 'next/image'
import { Player } from '@/lib/types'

const ROLE: Record<string, { icon: string; label: string; color: string }> = {
  batsman:       { icon: '🏏', label: 'Batsman',     color: '#f59e0b' },
  bowler:        { icon: '⚡', label: 'Bowler',       color: '#ef4444' },
  'all-rounder': { icon: '⭐', label: 'All-Rounder',  color: '#10b981' },
  wicketkeeper:  { icon: '🧤', label: 'Wicketkeeper', color: '#a78bfa' },
}

interface Props {
  player: Player
  onClose: () => void
  onDelete: (id: number) => void
}

export default function PlayerModal({ player, onClose, onDelete }: Props) {
  const role = ROLE[player.type] ?? ROLE['batsman']

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        className="modal-in"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 420, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#162516' }}
      >
        {/* Photo */}
        <div style={{ position: 'relative', height: 240, background: 'linear-gradient(135deg,#1a3a1a,#0d1a0d)' }}>
          {player.photo_url ? (
            <Image src={player.photo_url} alt={player.name} fill style={{ objectFit: 'cover' }} sizes="420px" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.07)', fontFamily: 'Bebas Neue, cursive' }}>
              {player.name.charAt(0)}
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #162516 0%, transparent 60%)' }} />
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 34, color: '#fff', lineHeight: 1 }}>{player.name}</h2>
            <div style={{ background: role.color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999, flexShrink: 0, marginTop: 4 }}>
              {role.icon} {role.label}
            </div>
          </div>

          {/* Special roles */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {player.is_captain          && <span style={{ padding: '4px 12px', borderRadius: 8, background: '#f59e0b', color: '#1a1a00', fontSize: 12, fontWeight: 800 }}>C  Captain</span>}
            {player.is_vice_captain     && <span style={{ padding: '4px 12px', borderRadius: 8, background: '#6366f1', color: '#fff',    fontSize: 12, fontWeight: 800 }}>VC  Vice Captain</span>}
            {player.is_wicketkeeper_role && <span style={{ padding: '4px 12px', borderRadius: 8, background: '#a78bfa', color: '#fff',   fontSize: 12, fontWeight: 800 }}>WK  Wicketkeeper</span>}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Row icon="👥" label="Current Team"  value={player.team_name ?? 'Unassigned'} />
            {player.previous_team && <Row icon="📋" label="Previous Team" value={player.previous_team} />}
            {player.phone         && <Row icon="📞" label="Phone"         value={player.phone} />}
            <Row icon="📅" label="Registered" value={new Date(player.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
          </div>

          {/* Delete */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { if (confirm(`Remove ${player.name}?`)) onDelete(player.id) }}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              🗑 Remove Player
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.3)', marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{value}</div>
      </div>
    </div>
  )
}
