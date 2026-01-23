import api from './axios'
import { Content } from '../types'

export const contentApi = {
  getAll: async (params?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ contents: Content[]; total: number; pages: number }> => {
    const response = await api.get('/content', { params })
    return response.data
  },

  getById: async (id: string): Promise<Content> => {
    const response = await api.get(`/content/${id}`)
    return response.data
  },

  getByCreator: async (creatorId: string): Promise<Content[]> => {
    const response = await api.get(`/content/creator/${creatorId}`)
    return response.data
  },

  create: async (data: FormData): Promise<Content> => {
    const response = await api.post('/content', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  update: async (id: string, data: FormData): Promise<Content> => {
    const response = await api.put(`/content/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/content/${id}`)
  },

  checkAccess: async (id: string): Promise<{ hasAccess: boolean }> => {
    const response = await api.get(`/content/${id}/access`)
    return response.data
  }
}
