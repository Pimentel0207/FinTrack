import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { type ReactNode } from 'react'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '◈' },
  { to: '/transactions', label: 'Transações', icon: '↕' },
  { to: '/patrimony', label: 'Patrimônio', icon: '◆' },
  { to: '/cards', label: 'Cartões', icon: '▣' },
  { to: '/goals', label: 'Metas', icon: '🎯' },
  { to: '/settings', label: 'Configurações', icon: '⚙' },
]

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0, borderRight: '1px solid var(--glass-border)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        background: 'var(--bg-surface)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '16px' }}>FinTrack</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
                fontSize: '14px', fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
            {user?.name?.split(' ')[0]}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>@{user?.username}</p>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)',
              background: 'transparent', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
