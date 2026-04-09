import { useState, useEffect } from 'react'
import { transactionService, type Transaction } from '../services/transactionService'
import { cardService, type Card } from '../services/cardService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Toast } from '../components/Toast'

const CATEGORIES = ['Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Moradia', 'Educação', 'Salário', 'Investimento', 'Outros']
const METHODS = [{ value: '', label: 'Nenhum' }, { value: 'pix', label: 'PIX' }, { value: 'debit', label: 'Débito' }, { value: 'credit', label: 'Crédito' }]

const TYPE_LABEL: Record<string, string> = { income: 'Receita', expense: 'Despesa', patrimony: 'Patrimônio' }
const TYPE_COLOR: Record<string, string> = { income: 'var(--success)', expense: 'var(--danger)', patrimony: 'var(--info)' }

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function formatAmount(amount: string) {
  return parseFloat(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterMonth, setFilterMonth] = useState(currentMonth())
  const [filterType, setFilterType] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    method: '',
    card_id: '',
    is_fixed: false,
    reference_month: currentMonth(),
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const load = async () => {
    setLoading(true)
    try {
      const [txs, cds] = await Promise.all([
        transactionService.list({ reference_month: filterMonth, type: filterType || undefined }),
        cardService.list(),
      ])
      setTransactions(txs)
      setCards(cds)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filterMonth, filterType])

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Valor inválido.'
    if (!form.description.trim()) errs.description = 'Descrição obrigatória.'
    if (!form.category) errs.category = 'Selecione uma categoria.'
    if (!form.reference_month) errs.reference_month = 'Mês obrigatório.'
    if ((form.method === 'credit' || form.method === 'debit') && !form.card_id) errs.card_id = 'Selecione um cartão.'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    setFormLoading(true)
    try {
      await transactionService.create({
        type: form.type,
        amount: parseFloat(form.amount),
        description: form.description,
        category: form.category,
        method: form.method || null,
        card_id: form.card_id || null,
        is_fixed: form.is_fixed,
        reference_month: form.reference_month,
      })
      setShowModal(false)
      setForm({ type: 'expense', amount: '', description: '', category: '', method: '', card_id: '', is_fixed: false, reference_month: currentMonth() })
      setToast({ msg: 'Transação criada!', type: 'success' })
      load()
    } catch (err: any) {
      const msg = err.response?.data?.detail?.message || 'Erro ao criar transação.'
      setToast({ msg, type: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta transação?')) return
    try {
      await transactionService.remove(id)
      setToast({ msg: 'Transação excluída.', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao excluir.', type: 'error' })
    }
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0)

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Transações</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            {transactions.length} registros em {filterMonth}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Nova</Button>
      </div>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Entradas', value: totalIncome, color: 'var(--success)' },
          { label: 'Saídas', value: totalExpense, color: 'var(--danger)' },
        ].map(item => (
          <div key={item.label} className="glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: item.color }}>
              {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="month"
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          style={{ padding: '8px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{ padding: '8px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
        >
          <option value="">Todos os tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
          <option value="patrimony">Patrimônio</option>
        </select>
      </div>

      {/* Lista */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhuma transação neste período.
          </div>
        ) : (
          transactions.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: 'flex', alignItems: 'center', padding: '16px 20px',
                borderBottom: i < transactions.length - 1 ? '1px solid var(--glass-border)' : 'none',
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: `${TYPE_COLOR[tx.type]}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', marginRight: '14px',
              }}>
                {tx.type === 'income' ? '↑' : tx.type === 'expense' ? '↓' : '◆'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {tx.description}
                  {tx.is_fixed && <span style={{ marginLeft: '6px', fontSize: '10px', background: 'var(--accent-glow)', color: 'var(--accent-light)', padding: '1px 6px', borderRadius: '4px' }}>FIXO</span>}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {tx.category} · {TYPE_LABEL[tx.type]}{tx.method ? ` · ${tx.method.toUpperCase()}` : ''}
                </p>
              </div>
              <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                <p style={{ fontWeight: 700, fontSize: '15px', color: TYPE_COLOR[tx.type] }}>
                  {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(tx.id)}
                style={{ marginLeft: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', flexShrink: 0 }}
                title="Excluir"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal nova transação */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px',
        }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="glass fade-in" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Nova Transação</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tipo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['income', 'expense', 'patrimony'].map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm(p => ({ ...p, type: t }))}
                    style={{
                      padding: '10px', borderRadius: '10px', border: `2px solid ${form.type === t ? TYPE_COLOR[t] : 'var(--glass-border)'}`,
                      background: form.type === t ? `${TYPE_COLOR[t]}22` : 'transparent',
                      color: form.type === t ? TYPE_COLOR[t] : 'var(--text-muted)',
                      fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    {TYPE_LABEL[t]}
                  </button>
                ))}
              </div>

              <Input label="Valor (R$)" type="number" step="0.01" min="0.01" placeholder="0,00" value={form.amount} onChange={setField('amount')} error={formErrors.amount} />
              <Input label="Descrição" type="text" placeholder="Ex: Supermercado" value={form.description} onChange={setField('description')} error={formErrors.description} />

              {/* Categoria */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Categoria</label>
                <select value={form.category} onChange={setField('category')}
                  style={{ padding: '11px 14px', background: 'var(--bg-elevated)', border: `1px solid ${formErrors.category ? 'var(--danger)' : 'var(--glass-border)'}`, borderRadius: '8px', color: form.category ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '15px' }}>
                  <option value="">Selecionar...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {formErrors.category && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{formErrors.category}</span>}
              </div>

              {/* Método */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Método de pagamento</label>
                <select value={form.method} onChange={setField('method')}
                  style={{ padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px' }}>
                  {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              {/* Cartão — só aparece se método for crédito/débito */}
              {(form.method === 'credit' || form.method === 'debit') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Cartão</label>
                  <select value={form.card_id} onChange={setField('card_id')}
                    style={{ padding: '11px 14px', background: 'var(--bg-elevated)', border: `1px solid ${formErrors.card_id ? 'var(--danger)' : 'var(--glass-border)'}`, borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px' }}>
                    <option value="">Selecionar cartão...</option>
                    {cards.map(c => <option key={c.id} value={c.id}>{c.nickname}</option>)}
                  </select>
                  {formErrors.card_id && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{formErrors.card_id}</span>}
                </div>
              )}

              <Input label="Mês de referência" type="month" value={form.reference_month} onChange={setField('reference_month')} error={formErrors.reference_month} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="is_fixed" checked={form.is_fixed} onChange={setField('is_fixed')}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
                <label htmlFor="is_fixed" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Gasto fixo (recorrente)</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button type="button" variant="ghost" fullWidth onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" fullWidth loading={formLoading}>Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
