import api from './api'

export interface Envelope {
  id: string
  category: string
  limit_amount: string
  updated_at: string
}

export interface EnvelopeStatus extends Envelope {
  spent_current_month: string
  percentage_used: number
  status: 'ok' | 'warning' | 'alert' | 'exceeded'
}

export interface CreateEnvelopePayload {
  category: string
  limit_amount: string | number
}

export interface UpdateEnvelopePayload {
  category?: string
  limit_amount?: string | number
}

export const envelopeService = {
  async list(): Promise<Envelope[]> {
    const res = await api.get<Envelope[]>('/envelopes')
    return res.data
  },

  async get(id: string): Promise<Envelope> {
    const res = await api.get<Envelope>(`/envelopes/${id}`)
    return res.data
  },

  async getStatus(id: string, referenceMonth?: string): Promise<EnvelopeStatus> {
    const params = referenceMonth ? { reference_month: referenceMonth } : {}
    const res = await api.get<EnvelopeStatus>(`/envelopes/${id}/status`, { params })
    return res.data
  },

  async create(data: CreateEnvelopePayload): Promise<Envelope> {
    const res = await api.post<Envelope>('/envelopes', data)
    return res.data
  },

  async update(id: string, data: UpdateEnvelopePayload): Promise<Envelope> {
    const res = await api.patch<Envelope>(`/envelopes/${id}`, data)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/envelopes/${id}`)
  },
}
