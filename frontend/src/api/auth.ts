import api from './axios'
import { AuthResponse } from '../types'

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (data: FormData) => {
    const response = await api.put('/auth/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}
