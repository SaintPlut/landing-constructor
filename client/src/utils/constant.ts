export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
}

export const ROUTES = {
  HOME: '/',
  TEMPLATES: '/templates',
  LOGIN: '/login',
  ADMIN: '/admin',
  CONSTRUCTOR: '/constructor',
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
}