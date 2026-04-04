import axios from 'axios'

const defaultApiBaseUrl =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000/api`
    : 'http://localhost:8000/api'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl

export const publicApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
})

publicApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export const publicWebBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '')
export const publicImageBaseUrl =
  import.meta.env.VITE_API_BASE_IMG || `${publicWebBaseUrl}/storage`

export const getImageUrl = (path) => {
  if (!path) return null
  const normalizedPath = String(path).trim()
  if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) return normalizedPath
  if (normalizedPath.startsWith('/')) return normalizedPath
  return `${publicImageBaseUrl.replace(/\/+$/, '')}/${normalizedPath.replace(/^\/+/, '')}`
}