'use client'
import Image from 'next/image'
import { Player } from '@/lib/types'

const ROLE: Record<string, { icon: string; label: string; color: string }> = {
  batsman:       { icon: '🏏', label: 'Batsman',      color: '#f59e0b' },
  bowler:        { icon: '⚡', label: 'Bowler',        color: '#ef4444' },
  'all-rounder': { icon: '⭐', label: 'All-Rounder',   color: '#10b981' },
  wicketkeeper:  { icon: '🧤', label: 'Wicketkeeper',  color: '#a78bfa' },
}

export default function PlayerCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const role = ROLE[player.type] ?? ROLE['batsman']

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.25s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(16,185,129,0.4)'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 180, background: 'linear-gradient(135deg,#1a3a1a,#0d1a0d)', overflow: 'hidden' }}>
        {player.photo_url ? (
          <Image src={player.photo_url} alt={player.name} fill style={{ objectFit: 'cover' }} sizes="250px" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 900, color: 'rgba(255,255,255,0.08)', fontFamily: 'Bebas Neue, cursive' }}>
            {player.name.charAt(0)}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />

        {/* Role chip */}
        <div style={{ position: 'absolute', top: 10, right: 10, background: role.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase' }}>
          {role.icon} {role.label}
        </div>

        {/* Special badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4 }}>
          {player.is_captain       && <Badge label="C"  bg="#f59e0b" color="#1a1a00" title="Captain" />}
          {player.is_vice_captain  && <Badge label="VC" bg="#6366f1" color="#fff"    title="Vice Captain" />}
          {player.is_wicketkeeper_role && <Badge label="WK" bg="#a78bfa" color="#fff" title="Wicketkeeper" />}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {player.team_name ?? 'No team'}
        </div>
      </div>
    </div>
  )
}

function Badge({ label, bg, color, title }: { label: string; bg: string; color: string; title: string }) {
  return (
    <div title={title} style={{ width: 22, height: 22, borderRadius: 6, background: bg, color, fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {label}
    </div>
  )
}
