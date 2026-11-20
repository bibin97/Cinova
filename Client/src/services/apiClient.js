import axios from 'axios'

/**
 * Axios instance for the future CINOVA API.
 * Phase 1–5: pages must call mock services, not this client, for data.
 * Phase 8: swap mock services to use this instance.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinova_mock_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
