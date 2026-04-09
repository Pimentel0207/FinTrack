import { useState, useEffect } from 'react'
import { investmentService, type Investment } from '../services/investmentService'
import { goalService, type Goal } from '../services/goalService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Toast } from '../components/Toast'

const INV_TYPES = ['CDB', 'Ações', 'Tesouro', 'FII', 'Crypto', 'Outros']
const SOS_CATEGORIES = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Outros']

type Tab = 'investments' | 'goals' | 'sos'

function fmt(val: string | number) {
  return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function progressColor(pct: number) {
  if (pct >= 100) return 'var(--success)'
  if (pct >= 75) return 'var(--accent)'
  if (pct >= 40) return 'var(--warning)'
  return 'var(--danger)'
}

export function Patrimony() {
  const [tab, setTab] = useState<Tab>('investments')
  const [investments, setInvestments] = useState<Investment[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [sos, setSos] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Modals
  const [showInvModal, setShowInvModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState<{ goal: Goal; mode: 'deposit' | 'withdraw' } | null>(null)
  const [moveAmount, setMoveAmount] = useState('')
  const [moveLoading, setMoveLoading] = useState(false)

  // Investment form
  const [invForm, setInvForm] = useState({ name: '', type: 'CDB', amount_invested: '', current_value: '', return_rate: '' })
  const [invLoading, setInvLoading] = useState(false)

  // Goal form
  const [goalForm, setGoalForm] = useState({ type: 'saving', title: '', emoji: '', target_amount: '', sos_category: '' })
  const [goalLoading, setGoalLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [invs, gs, ss] = await Promise.all([
        investmentService.list(),
        goalService.list('saving'),
        goalService.list('sos'),
      ])
      setInvestments(invs)
      setGoals(gs)
      setSos(ss)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreateInvestment = async (e: React.FormEvent) => {
    e.preventDefault()
    setInvLoading(true)
    try {
      await investmentService.create({
        name: invForm.name,
        type: invForm.type,
        amount_invested: parseFloat(invForm.amount_invested),
        current_value: parseFloat(invForm.current_value),
        return_rate: parseFloat(invForm.return_rate),
      })
      setShowInvModal(false)
      setInvForm({ name: '', type: 'CDB', amount_invested: '', current_value: '', return_rate: '' })
      setToast({ msg: 'Investimento adicionado!', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao criar investimento.', type: 'error' })
    } finally {
      setInvLoading(false)
    }
  }

  const handleDeleteInvestment = async (id: string) => {
    if (!confirm('Excluir investimento?')) return
    try {
      await investmentService.remove(id)
      setToast({ msg: 'Investimento removido.', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao remover.', type: 'error' })
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setGoalLoading(true)
    try {
      await goalService.create({
        type: goalForm.type,
        title: goalForm.title,
        emoji: goalForm.emoji || undefined,
        target_amount: parseFloat(goalForm.target_amount),
        sos_category: goalForm.type === 'sos' ? goalForm.sos_category : undefined,
      })
      setShowGoalModal(false)
      setGoalForm({ type: 'saving', title: '', emoji: '', target_amount: '', sos_category: '' })
      setToast({ msg: 'Meta criada!', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao criar meta.', type: 'error' })
    } finally {
      setGoalLoading(false)
    }
  }

  const handleMove = async () => {
    if (!showMoveModal || !moveAmount) return
    const amount = parseFloat(moveAmount)
    if (isNaN(amount) || amount <= 0) return
    setMoveLoading(true)
    try {
      if (showMoveModal.mode === 'deposit') {
        await goalService.deposit(showMoveModal.goal.id, amount)
        setToast({ msg: 'Depósito realizado!', type: 'success' })
      } else {
        await goalService.withdraw(showMoveModal.goal.id, amount)
        setToast({ msg: 'Retirada realizada!', type: 'success' })
      }
      setShowMoveModal(null)
      setMoveAmount('')
      load()
    } catch (err: any) {
      const msg = err.response?.data?.detail?.message || 'Erro na operação.'
      setToast({ msg, type: 'error' })
    } finally {
      setMoveLoading(false)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Excluir esta meta?')) return
    try {
      await goalService.remove(id)
      setToast({ msg: 'Meta removida.', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao remover.', type: 'error' })
    }
  }

  const totalInvested = investments.reduce((s, i) => s + parseFloat(i.amount_invested), 0)
  const totalCurrent = investments.reduce((s, i) => s + parseFloat(i.current_value), 0)
  const totalReturn = totalCurrent - totalInvested

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Patrimônio</h1>
        <Button onClick={() => tab === 'investments' ? setShowInvModal(true) : setShowGoalModal(true)}>
          + {tab === 'investments' ? 'Investimento' : 'Meta'}
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {([['investments', 'Investimentos'], ['goals', 'Meus Sonhos'], ['sos', 'Reserva SOS']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            background: tab === key ? 'var(--accent)' : 'var(--bg-elevated)',
            color: tab === key ? '#fff' : 'var(--text-muted)',
            fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
          }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>Carregando...</div>
      ) : (
        <>
          {/* ─── INVESTIMENTOS ─── */}
          {tab === 'investments' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Investido', value: totalInvested, color: 'var(--text-primary)' },
                  { label: 'Valor Atual', value: totalCurrent, color: 'var(--accent-light)' },
                  { label: 'Rendimento', value: totalReturn, color: totalReturn >= 0 ? 'var(--success)' : 'var(--danger)' },
                ].map(c => (
                  <div key={c.label} className="glass" style={{ padding: '20px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{c.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: c.color }}>{fmt(c.value)}</p>
                  </div>
                ))}
              </div>

              <div className="glass" style={{ overflow: 'hidden' }}>
                {investments.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum investimento cadastrado.</div>
                ) : investments.map((inv, i) => {
                  const ret = parseFloat(inv.current_value) - parseFloat(inv.amount_invested)
                  return (
                    <div key={inv.id} style={{
                      display: 'flex', alignItems: 'center', padding: '16px 20px', gap: '14px',
                      borderBottom: i < investments.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📈</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '14px' }}>{inv.name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inv.type} · {inv.return_rate}% a.a.</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, fontSize: '15px' }}>{fmt(inv.current_value)}</p>
                        <p style={{ fontSize: '12px', color: ret >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {ret >= 0 ? '+' : ''}{fmt(ret)}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteInvestment(inv.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>✕</button>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ─── METAS (SAVING) ─── */}
          {tab === 'goals' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {goals.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>
                  Nenhum sonho cadastrado ainda.
                </div>
              ) : goals.map(goal => {
                const pct = Math.min(100, (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100)
                return (
                  <div key={goal.id} className="glass" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '28px' }}>{goal.emoji || '🎯'}</span>
                        <p style={{ fontWeight: 700, fontSize: '15px', marginTop: '4px' }}>{goal.title}</p>
                      </div>
                      <button onClick={() => handleDeleteGoal(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        <span>{fmt(goal.current_amount)}</span>
                        <span>{pct.toFixed(0)}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: progressColor(pct), borderRadius: '3px', transition: 'width 0.5s ease' }} />
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                        Meta: {fmt(goal.target_amount)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setShowMoveModal({ goal, mode: 'deposit' }); setMoveAmount('') }}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--success)', background: 'transparent', color: 'var(--success)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        + Depositar
                      </button>
                      <button onClick={() => { setShowMoveModal({ goal, mode: 'withdraw' }); setMoveAmount('') }}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        − Retirar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ─── RESERVA SOS ─── */}
          {tab === 'sos' && (
            <>
              <div className="glass" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Reserva SOS</p>
                  <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--success)' }}>
                    {fmt(sos.reduce((s, g) => s + parseFloat(g.current_amount), 0))}
                  </p>
                </div>
                <div style={{ width: '1px', background: 'var(--glass-border)', alignSelf: 'stretch' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Meta Total</p>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {fmt(sos.reduce((s, g) => s + parseFloat(g.target_amount), 0))}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {sos.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>
                    Nenhuma reserva SOS cadastrada.
                  </div>
                ) : sos.map(goal => {
                  const pct = Math.min(100, (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100)
                  return (
                    <div key={goal.id} className="glass" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '14px' }}>{goal.title}</p>
                          {goal.sos_category && <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{goal.sos_category}</p>}
                        </div>
                        <button onClick={() => handleDeleteGoal(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
                      </div>
                      <div style={{ height: '5px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: progressColor(pct), borderRadius: '3px' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>{fmt(goal.current_amount)}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{fmt(goal.target_amount)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                        <button onClick={() => { setShowMoveModal({ goal, mode: 'deposit' }); setMoveAmount('') }}
                          style={{ flex: 1, padding: '7px', borderRadius: '8px', border: '1px solid var(--success)', background: 'transparent', color: 'var(--success)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          + Depositar
                        </button>
                        <button onClick={() => { setShowMoveModal({ goal, mode: 'withdraw' }); setMoveAmount('') }}
                          style={{ flex: 1, padding: '7px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          − Retirar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Modal Investimento */}
      {showInvModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => e.target === e.currentTarget && setShowInvModal(false)}>
          <div className="glass fade-in" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Novo Investimento</h2>
            <form onSubmit={handleCreateInvestment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input label="Nome" type="text" placeholder="Ex: Tesouro IPCA+ 2029" value={invForm.name} onChange={e => setInvForm(p => ({ ...p, name: e.target.value }))} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tipo</label>
                <select value={invForm.type} onChange={e => setInvForm(p => ({ ...p, type: e.target.value }))}
                  style={{ padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px' }}>
                  {INV_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Input label="Valor investido (R$)" type="number" step="0.01" min="0" placeholder="0,00" value={invForm.amount_invested} onChange={e => setInvForm(p => ({ ...p, amount_invested: e.target.value }))} />
              <Input label="Valor atual (R$)" type="number" step="0.01" min="0" placeholder="0,00" value={invForm.current_value} onChange={e => setInvForm(p => ({ ...p, current_value: e.target.value }))} />
              <Input label="Taxa de retorno (% a.a.)" type="number" step="0.01" placeholder="0,00" value={invForm.return_rate} onChange={e => setInvForm(p => ({ ...p, return_rate: e.target.value }))} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button type="button" variant="ghost" fullWidth onClick={() => setShowInvModal(false)}>Cancelar</Button>
                <Button type="submit" fullWidth loading={invLoading}>Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Meta/SOS */}
      {showGoalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => e.target === e.currentTarget && setShowGoalModal(false)}>
          <div className="glass fade-in" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Nova Meta</h2>
            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[['saving', '🎯 Sonho'], ['sos', '🛡️ SOS']].map(([val, lbl]) => (
                  <button key={val} type="button" onClick={() => setGoalForm(p => ({ ...p, type: val }))}
                    style={{ padding: '10px', borderRadius: '10px', border: `2px solid ${goalForm.type === val ? 'var(--accent)' : 'var(--glass-border)'}`, background: goalForm.type === val ? 'var(--accent-glow)' : 'transparent', color: goalForm.type === val ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                    {lbl}
                  </button>
                ))}
              </div>
              <Input label="Título" type="text" placeholder="Ex: Viagem para Europa" value={goalForm.title} onChange={e => setGoalForm(p => ({ ...p, title: e.target.value }))} />
              {goalForm.type === 'saving' && (
                <Input label="Emoji (opcional)" type="text" placeholder="✈️" value={goalForm.emoji} onChange={e => setGoalForm(p => ({ ...p, emoji: e.target.value }))} />
              )}
              {goalForm.type === 'sos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Categoria SOS</label>
                  <select value={goalForm.sos_category} onChange={e => setGoalForm(p => ({ ...p, sos_category: e.target.value }))}
                    style={{ padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px' }}>
                    <option value="">Selecionar...</option>
                    {SOS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <Input label="Meta (R$)" type="number" step="0.01" min="0.01" placeholder="0,00" value={goalForm.target_amount} onChange={e => setGoalForm(p => ({ ...p, target_amount: e.target.value }))} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button type="button" variant="ghost" fullWidth onClick={() => setShowGoalModal(false)}>Cancelar</Button>
                <Button type="submit" fullWidth loading={goalLoading}>Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Depositar/Retirar */}
      {showMoveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => e.target === e.currentTarget && setShowMoveModal(null)}>
          <div className="glass fade-in" style={{ width: '100%', maxWidth: '360px', padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
              {showMoveModal.mode === 'deposit' ? 'Depositar' : 'Retirar'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              {showMoveModal.goal.emoji || ''} {showMoveModal.goal.title} · Saldo: {fmt(showMoveModal.goal.current_amount)}
            </p>
            <Input label="Valor (R$)" type="number" step="0.01" min="0.01" placeholder="0,00"
              value={moveAmount} onChange={e => setMoveAmount(e.target.value)} autoFocus />
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Button type="button" variant="ghost" fullWidth onClick={() => setShowMoveModal(null)}>Cancelar</Button>
              <Button fullWidth loading={moveLoading} onClick={handleMove}
                style={{ background: showMoveModal.mode === 'deposit' ? 'var(--success)' : undefined }}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
