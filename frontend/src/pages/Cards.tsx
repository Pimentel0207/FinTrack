import { useState, useEffect } from 'react'
import { cardService, type Card } from '../services/cardService'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Toast } from '../components/Toast'

export function Cards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [nickname, setNickname] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editNickname, setEditNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const load = async () => {
    setLoading(true)
    try { setCards(await cardService.list()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) return
    setSaving(true)
    try {
      await cardService.create(nickname.trim())
      setNickname('')
      setToast({ msg: 'Cartão adicionado!', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao adicionar cartão.', type: 'error' })
    } finally { setSaving(false) }
  }

  const handleUpdate = async (id: string) => {
    if (!editNickname.trim()) return
    setSaving(true)
    try {
      await cardService.update(id, editNickname.trim())
      setEditId(null)
      setToast({ msg: 'Cartão atualizado!', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao atualizar.', type: 'error' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este cartão?')) return
    try {
      await cardService.remove(id)
      setToast({ msg: 'Cartão removido.', type: 'success' })
      load()
    } catch {
      setToast({ msg: 'Erro ao remover cartão.', type: 'error' })
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Meus Cartões</h1>

      {/* Adicionar */}
      <div className="glass" style={{ padding: '20px', marginBottom: '24px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
          <Input
            placeholder="Apelido do cartão (ex: Nubank)"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
          <Button type="submit" loading={saving} style={{ flexShrink: 0 }}>Adicionar</Button>
        </form>
      </div>

      {/* Lista */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</div>
        ) : cards.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum cartão cadastrado.
          </div>
        ) : cards.map((card, i) => (
          <div key={card.id} style={{
            display: 'flex', alignItems: 'center', padding: '16px 20px',
            borderBottom: i < cards.length - 1 ? '1px solid var(--glass-border)' : 'none',
            gap: '12px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              background: 'var(--accent-glow)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px',
            }}>💳</div>

            {editId === card.id ? (
              <>
                <input
                  value={editNickname}
                  onChange={e => setEditNickname(e.target.value)}
                  autoFocus
                  style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--accent)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
                />
                <Button onClick={() => handleUpdate(card.id)} loading={saving} style={{ padding: '8px 16px', fontSize: '13px' }}>Salvar</Button>
                <Button variant="ghost" onClick={() => setEditId(null)} style={{ padding: '8px 16px', fontSize: '13px' }}>✕</Button>
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '15px' }}>{card.nickname}</span>
                <button onClick={() => { setEditId(card.id); setEditNickname(card.nickname) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px' }}>✏️</button>
                <button onClick={() => handleDelete(card.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '16px' }}>🗑️</button>
              </>
            )}
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
