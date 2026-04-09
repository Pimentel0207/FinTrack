import api from './api'

export interface Transaction {
  id: string
  type: 'income' | 'expense' | 'patrimony'
  amount: string
  description: string
  category: string
  method: string | null
  card_id: string | null
  is_fixed: boolean
  reference_month: string
  created_at: string
}

export interface TransactionCreate {
  type: string
  amount: number
  description: string
  category: string
  method?: string | null
  card_id?: string | null
  is_fixed?: boolean
  reference_month: string
}

export interface TransactionFilters {
  type?: string
  category?: string
  reference_month?: string
}

export const transactionService = {
  async list(filters?: TransactionFilters): Promise<Transaction[]> {
    const res = await api.get<Transaction[]>('/transactions', { params: filters })
    return res.data
  },

  async create(data: TransactionCreate): Promise<Transaction> {
    const res = await api.post<Transaction>('/transactions', data)
    return res.data
  },

  async update(id: string, data: Partial<TransactionCreate>): Promise<Transaction> {
    const res = await api.patch<Transaction>(`/transactions/${id}`, data)
    return res.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`)
  },
}
