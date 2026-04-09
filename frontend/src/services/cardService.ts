import api from './api'

export interface Card {
  id: string
  nickname: string
  created_at: string
}

export const cardService = {
  async list(): Promise<Card[]> {
    const res = await api.get<Card[]>('/cards')
    return res.data
  },

  async create(nickname: string): Promise<Card> {
    const res = await api.post<Card>('/cards', { nickname })
    return res.data
  },

  async update(id: string, nickname: string): Promise<Card> {
    const res = await api.put<Card>(`/cards/${id}`, { nickname })
    return res.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/cards/${id}`)
  },
}
