import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Toast } from '../components/Toast'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [login_, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)

  const triggerShake = (msg: string) => {
    setError(msg)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!login_ || !password) {
      triggerShake('Preencha todos os campos.')
      return
    }

    setLoading(true)
    try {
      const data = await authService.login({ login: login_, password, remember_me: rememberMe })
      login(data.access_token, data.refresh_token, data.user)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.detail?.message || 'Credenciais inválidas.'
      triggerShake(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-deep)',
      padding: '24px',
    }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        ref={formRef}
        className={`glass fade-in ${shake ? 'shake' : ''}`}
        style={{ width: '100%', maxWidth: '420px', padding: '40px', position: 'relative' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'var(--accent)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            FinTrack
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Bem-vindo de volta
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email ou username"
            type="text"
            placeholder="seu@email.com"
            value={login_}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Lembrar-me por 7 dias
            </label>
          </div>

          <Button type="submit" fullWidth loading={loading} style={{ marginTop: '8px' }}>
            Entrar
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Não tem conta?{' '}
          <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>
            Criar conta
          </Link>
        </p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  )
}
