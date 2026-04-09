import api from './api'

export interface LoginPayload {
  login: string
  password: string
  remember_me?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: {
    id: string
    name: string
    email: string
    username: string
    salary: string
    currency: string
    avatar_url: string | null
  }
}

export const authService = {
  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken })
    return res.data
  },
}
