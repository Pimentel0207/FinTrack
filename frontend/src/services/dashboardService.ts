import api from './api'

export interface DashboardSummary {
  real_balance: string
  available_balance: string
  income: string
  expenses: string
  patrimony: string
  goals_progress: number
  total_invested: string
}

export interface ChartDataPoint {
  month: string
  income: string
  expenses: string
}

export interface DashboardChart {
  data: ChartDataPoint[]
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await api.get<DashboardSummary>('/dashboard/summary')
    return res.data
  },

  async getChart(): Promise<DashboardChart> {
    const res = await api.get<DashboardChart>('/dashboard/chart')
    return res.data
  },
}
