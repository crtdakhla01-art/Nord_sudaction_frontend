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

const generateSendTraceId = () => {
  const randomPart = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

  return `fe-${Date.now()}-${randomPart}`
}

publicApi.interceptors.request.use((config) => {
  const method = String(config.method || 'get').toLowerCase()
  const isMutatingRequest = ['post', 'put', 'patch', 'delete'].includes(method)

  if (isMutatingRequest) {
    const existingTraceId = config.headers?.['X-Send-Trace-Id']
    const sendTraceId = typeof existingTraceId === 'string' && existingTraceId.trim() !== ''
      ? existingTraceId
      : generateSendTraceId()

    config.headers = {
      ...config.headers,
      'X-Send-Trace-Id': sendTraceId,
    }

    if (typeof window !== 'undefined') {
      console.info('[send_trace_id] public request', {
        send_trace_id: sendTraceId,
        method: method.toUpperCase(),
        url: config.url,
      })
    }
  }

  return config
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