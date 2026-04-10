import api from './api'

export interface Subscription {
  id: string
  name: string
  amount: string
  billing_day: number
  category: string
  created_at: string
}

export interface CreateSubscriptionPayload {
  name: string
  amount: string | number
  billing_day: number
  category: string
}

export interface UpdateSubscriptionPayload {
  name?: string
  amount?: string | number
  billing_day?: number
  category?: string
}

export const subscriptionService = {
  async list(): Promise<Subscription[]> {
    const res = await api.get<Subscription[]>('/subscriptions')
    return res.data
  },

  async get(id: string): Promise<Subscription> {
    const res = await api.get<Subscription>(`/subscriptions/${id}`)
    return res.data
  },

  async create(data: CreateSubscriptionPayload): Promise<Subscription> {
    const res = await api.post<Subscription>('/subscriptions', data)
    return res.data
  },

  async update(id: string, data: UpdateSubscriptionPayload): Promise<Subscription> {
    const res = await api.patch<Subscription>(`/subscriptions/${id}`, data)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/subscriptions/${id}`)
  },
}
