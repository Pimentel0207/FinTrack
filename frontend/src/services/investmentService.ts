import api from './api'

export interface Investment {
  id: string
  name: string
  type: string
  amount_invested: string
  current_value: string
  return_rate: string
  created_at: string
  updated_at: string
}

export interface InvestmentCreate {
  name: string
  type: string
  amount_invested: number
  current_value: number
  return_rate: number
}

export const investmentService = {
  async list(): Promise<Investment[]> {
    const res = await api.get<Investment[]>('/investments')
    return res.data
  },

  async create(data: InvestmentCreate): Promise<Investment> {
    const res = await api.post<Investment>('/investments', data)
    return res.data
  },

  async update(id: string, data: Partial<InvestmentCreate>): Promise<Investment> {
    const res = await api.patch<Investment>(`/investments/${id}`, data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/investments/${id}`)
  },
}
