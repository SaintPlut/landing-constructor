import axios from 'axios';
import { Template, Landing, ApiError, ApiResponse } from '../types';

const API_BASE = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Network error',
      code: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

export const templatesApi = {
  getAll: async (): Promise<Template[]> => {
    const response = await api.get<Template[]>('/templates');
    return response.data;
  },

  getById: async (id: string): Promise<Template> => {
    const response = await api.get<Template>(`/templates/${id}`);
    return response.data;
  },

  search: async (filters: { name?: string; keywords?: string }): Promise<Template[]> => {
    const response = await api.get<Template[]>('/templates', { 
      params: filters 
    });
    return response.data;
  },
};

export const landingsApi = {
  getAll: async (): Promise<Landing[]> => {
    const response = await api.get<Landing[]>('/landings');
    return response.data;
  },

  getById: async (id: string): Promise<Landing> => {
    const response = await api.get<Landing>(`/landings/${id}`);
    return response.data;
  },

  create: async (landing: Omit<Landing, 'id'>): Promise<Landing> => {
    const response = await api.post<Landing>('/landings', landing);
    return response.data;
  },

  update: async (id: string, landing: Partial<Landing>): Promise<Landing> => {
    const response = await api.put<Landing>(`/landings/${id}`, landing);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/landings/${id}`);
  },
};

export { api };