import axios from 'axios';
import { AuthResponse, Note } from '../types';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Django REST Framework default uses "Token <token>"
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login/', { username, password });
    return response.data;
  },
  register: async (username: string, password: string): Promise<void> => {
    await api.post('/register/', { username, password });
  },
};

// Note Services
export const noteService = {
  getAll: async (): Promise<Note[]> => {
    const response = await api.get<Note[]>('/notes/');
    return response.data;
  },
  
  create: async (formData: FormData): Promise<Note> => {
    const response = await api.post<Note>('/notes/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Note> => {
    const response = await api.put<Note>(`/notes/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}/`);
  },
};

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data as any;
    if (typeof data === 'object' && data !== null) {
      if (data.detail) return data.detail;
      // Handle Django field errors (e.g., { "username": ["Required."] })
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError)) return (firstError as any)[0];
      if (typeof firstError === 'string') return firstError;
    }
  }
  return 'An unexpected error occurred.';
};