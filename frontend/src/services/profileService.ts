import api from './api'

export interface UserProfile {
  id: string
  name: string
  email: string
  username: string
  salary: string
  currency: string
  avatar_url: string | null
}

export interface UpdateProfilePayload {
  name?: string
  salary?: string
  currency?: string
  avatar_url?: string | null
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const res = await api.get<UserProfile>('/profile')
    return res.data
  },

  async updateProfile(data: UpdateProfilePayload): Promise<UserProfile> {
    const res = await api.patch<UserProfile>('/profile', data)
    return res.data
  },

  async changePassword(data: ChangePasswordPayload): Promise<void> {
    await api.post('/profile/change-password', data)
  },
}
