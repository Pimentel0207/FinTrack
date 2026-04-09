import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Toast } from '../components/Toast'

export function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [shake, setShake] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Nome é obrigatório.'
    if (!form.email.includes('@')) errs.email = 'Email inválido.'
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) errs.username = 'Username: 3-30 caracteres (letras, números, _).'
    if (form.password.length < 8) errs.password = 'Mínimo 8 caracteres.'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    setLoading(true)
    try {
      const data = await authService.register(form)
      login(data.access_token, data.refresh_token, data.user)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.detail?.message || 'Erro ao criar conta.'
      setToast(msg)
      setShake(true)
      setTimeout(() => setShake(false), 400)
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
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        className={`glass fade-in ${shake ? 'shake' : ''}`}
        style={{ width: '100%', maxWidth: '420px', padding: '40px' }}
      >
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
            Criar conta
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Comece a controlar suas finanças
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Nome completo"
            type="text"
            placeholder="João Silva"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Username"
            type="text"
            placeholder="joaosilva"
            value={form.username}
            onChange={set('username')}
            error={errors.username}
            autoComplete="username"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth loading={loading} style={{ marginTop: '8px' }}>
            Criar conta
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>
      </div>

      {toast && <Toast message={toast} type="error" onClose={() => setToast('')} />}
    </div>
  )
}
