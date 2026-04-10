import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { profileService } from '../services/profileService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function Settings() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'security'>('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    salary: user?.salary || '',
    currency: user?.currency || 'BRL',
  })

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await profileService.updateProfile({
        name: profileData.name,
        salary: profileData.salary,
        currency: profileData.currency,
      })
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error?.message || 'Erro ao atualizar perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Senhas não coincidem' })
      return
    }
    setLoading(true)
    try {
      await profileService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      })
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error?.message || 'Erro ao alterar senha' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Configurações
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage your account and preferences
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="glass" style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '8px',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            borderLeft: `4px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            fontSize: '14px',
          }}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '16px',
        }}>
          {(['profile', 'password', 'security'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === tab ? 'var(--accent-glow)' : 'transparent',
                color: activeTab === tab ? 'var(--accent-light)' : 'var(--text-muted)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 600 : 400,
                transition: 'all 0.15s',
                fontSize: '14px',
              }}
            >
              {tab === 'profile' && 'Perfil'}
              {tab === 'password' && 'Senha'}
              {tab === 'security' && 'Segurança'}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Nome
                </label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Seu nome"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Salário (opcional)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={profileData.salary}
                  onChange={(e) => handleProfileChange('salary', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div style={{ marginBottom: '0' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Moeda
                </label>
                <select
                  value={profileData.currency}
                  onChange={(e) => handleProfileChange('currency', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                  }}
                >
                  <option value="BRL">BRL (Real)</option>
                  <option value="USD">USD (Dólar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{ alignSelf: 'flex-start' }}
            >
              {loading ? 'Salvando...' : 'Salvar Mudanças'}
            </Button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Senha Atual
                </label>
                <Input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Nova Senha
                </label>
                <Input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                  placeholder="Digite a nova senha (min. 8 caracteres)"
                  required
                />
              </div>

              <div style={{ marginBottom: '0' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Confirmar Nova Senha
                </label>
                <Input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                  placeholder="Confirme a nova senha"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{ alignSelf: 'flex-start' }}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                Informações da Conta
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '14px' }}>{user?.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Username</p>
                  <p style={{ fontSize: '14px' }}>@{user?.username}</p>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--danger)' }}>
                Zona de Perigo
              </h3>
              <Button
                variant="danger"
                onClick={handleLogout}
              >
                Sair de Todas as Sessões
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
