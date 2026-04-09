import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/Button'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <div className="glass" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
          Dashboard em construção — autenticação funcionando!
        </p>
        <Button variant="ghost" onClick={logout} fullWidth>
          Sair
        </Button>
      </div>
    </div>
  )
}
