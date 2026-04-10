import { useState, useEffect } from 'react'
import { goalService } from '../services/goalService'
import type { Goal } from '../services/goalService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'saving' | 'sos'>('saving')
  const [showModal, setShowModal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    type: 'saving',
    title: '',
    emoji: '🎯',
    target_amount: '',
    sos_category: '',
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const data = await goalService.list()
      setGoals(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar metas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await goalService.create({
        type: newGoal.type,
        title: newGoal.title,
        emoji: newGoal.emoji,
        target_amount: parseFloat(newGoal.target_amount),
        sos_category: newGoal.sos_category || undefined,
      })
      setNewGoal({
        type: 'saving',
        title: '',
        emoji: '🎯',
        target_amount: '',
        sos_category: '',
      })
      setShowModal(false)
      fetchGoals()
    } catch (err) {
      setError('Erro ao criar meta')
      console.error(err)
    }
  }

  const handleDeposit = async (goalId: string) => {
    const amount = prompt('Quanto deseja depositar?')
    if (!amount) return

    try {
      await goalService.deposit(goalId, parseFloat(amount))
      fetchGoals()
    } catch (err) {
      setError('Erro ao depositar')
      console.error(err)
    }
  }

  const handleWithdraw = async (goalId: string) => {
    const amount = prompt('Quanto deseja retirar?')
    if (!amount) return

    try {
      await goalService.withdraw(goalId, parseFloat(amount))
      fetchGoals()
    } catch (err) {
      setError('Erro ao retirar')
      console.error(err)
    }
  }

  const handleDelete = async (goalId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta meta?')) return

    try {
      await goalService.delete(goalId)
      fetchGoals()
    } catch (err) {
      setError('Erro ao deletar meta')
      console.error(err)
    }
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num)
  }

  const filteredGoals = goals.filter(g => g.type === activeTab)

  if (loading) {
    return (
      <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Carregando metas...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
              {activeTab === 'saving' ? 'Meus Sonhos 🎯' : 'Reserva SOS 🚨'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {activeTab === 'saving'
                ? 'Economize para realizar seus sonhos'
                : 'Reserve uma quantia para emergências'}
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>+ Nova Meta</Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass" style={{
            padding: '12px 16px',
            marginBottom: '16px',
            color: 'var(--danger)',
            borderLeft: '4px solid var(--danger)',
          }}>
            {error}
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
          {(['saving', 'sos'] as const).map(tab => (
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
              {tab === 'saving' ? 'Meus Sonhos' : 'Reserva SOS'}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {filteredGoals.length === 0 ? (
            <div className="glass" style={{
              padding: '40px 20px',
              textAlign: 'center',
              gridColumn: '1 / -1',
            }}>
              <p style={{ color: 'var(--text-muted)' }}>
                Nenhuma meta neste momento. Crie uma!
              </p>
            </div>
          ) : (
            filteredGoals.map(goal => {
              const progress = (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100
              return (
                <div key={goal.id} className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ fontSize: '24px', marginBottom: '4px' }}>{goal.emoji}</p>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{goal.title}</h3>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '18px',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '12px',
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Progresso</span>
                      <span style={{ fontWeight: 600 }}>{progress.toFixed(1)}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--glass-border)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: '100%',
                        background: progress >= 100 ? 'var(--success)' : 'var(--accent)',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>

                  {/* Amounts */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                  }}>
                    <span>{formatCurrency(goal.current_amount)}</span>
                    <span>de {formatCurrency(goal.target_amount)}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="primary"
                      onClick={() => handleDeposit(goal.id)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                    >
                      Depositar
                    </Button>
                    {parseFloat(goal.current_amount) > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => handleWithdraw(goal.id)}
                        style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                      >
                        Retirar
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <form
              onSubmit={handleCreateGoal}
              className="glass"
              style={{
                padding: '24px',
                maxWidth: '400px',
                width: '100%',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                Nova Meta
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Título
                </label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Ex: Novo Carro"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Emoji
                </label>
                <Input
                  value={newGoal.emoji}
                  onChange={(e) => setNewGoal({ ...newGoal, emoji: e.target.value })}
                  placeholder="Ex: 🎯"
                  maxLength={2}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Valor Alvo
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newGoal.target_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Tipo
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
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
                  <option value="saving">Meu Sonho</option>
                  <option value="sos">Reserva SOS</option>
                </select>
              </div>

              {newGoal.type === 'sos' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                    Categoria SOS
                  </label>
                  <Input
                    value={newGoal.sos_category}
                    onChange={(e) => setNewGoal({ ...newGoal, sos_category: e.target.value })}
                    placeholder="Ex: Saúde, Carro, Casa"
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="submit"
                  style={{ flex: 1 }}
                >
                  Criar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
