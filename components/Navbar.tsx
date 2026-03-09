'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()

  const isAdmin = path.startsWith('/admin') && path !== '/admin/login'

  return (
    <nav style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            🏏
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 22, color: '#fff', letterSpacing: 3, lineHeight: 1 }}>
              CRICKET<span style={{ color: '#f59e0b' }}>.</span>REG
            </div>
            <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700, letterSpacing: 2 }}>PLAYER REGISTRY</div>
          </div>
        </Link>

        {/* Nav links — only register visible to public */}
        <div className="flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.06)' }}>
          <NavLink href="/" active={path === '/'} label="Register" />
          <NavLink href="/admin" active={isAdmin} label="Admin" />
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: '6px 18px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        transition: 'all 0.2s',
        background: active ? '#10b981' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.45)',
        boxShadow: active ? '0 4px 15px rgba(16,185,129,0.3)' : 'none',
      }}
    >
      {label}
    </Link>
  )
}
