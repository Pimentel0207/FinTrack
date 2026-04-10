import api from './api'

export interface Goal {
  id: string
  type: 'saving' | 'sos'
  title: string
  emoji: string | null
  target_amount: string
  current_amount: string
  sos_category: string | null
  created_at: string
  updated_at: string
}

export interface GoalCreate {
  type: string
  title: string
  emoji?: string
  target_amount: number
  sos_category?: string
}

export const goalService = {
  async list(type?: string): Promise<Goal[]> {
    const res = await api.get<Goal[]>('/goals', { params: type ? { type } : undefined })
    return res.data
  },

  async create(data: GoalCreate): Promise<Goal> {
    const res = await api.post<Goal>('/goals', data)
    return res.data
  },

  async update(id: string, data: { title?: string; emoji?: string; target_amount?: number }): Promise<Goal> {
    const res = await api.patch<Goal>(`/goals/${id}`, data)
    return res.data
  },

  async deposit(id: string, amount: number): Promise<Goal> {
    const res = await api.post<Goal>(`/goals/${id}/deposit`, { amount })
    return res.data
  },

  async withdraw(id: string, amount: number): Promise<Goal> {
    const res = await api.post<Goal>(`/goals/${id}/withdraw`, { amount })
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/goals/${id}`)
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/goals/${id}`)
  },
}
