import { createApiService } from './api-factory'

// Default API service
export const api = createApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  }
})

// Example: Service with predefined endpoints
export const userApi = createApiService({
  baseUrl: '/api',
  endpoints: {
    users: '/users',
    profile: '/profile',
    posts: '/posts'
  }
})

export default api