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

const normalizeHeaders = (headers) => {
  if (!headers) return undefined
  if (typeof headers.toJSON === 'function') return headers.toJSON()
  return headers
}

const buildFullUrl = (config) => {
  const base = (config?.baseURL || '').replace(/\/$/, '')
  const url = config?.url || ''
  return `${base}${url}`
}

// ─── DEBUG INTERCEPTORS ───────────────────────────────────────────────────────
publicApi.interceptors.request.use((config) => {
  config.metadata = {
    startedAt: Date.now(),
    requestId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }

  console.groupCollapsed(
    `%c➡ API REQUEST ${config.method?.toUpperCase()} ${config.url}`,
    'color:#3b82f6;font-weight:bold',
  )
  console.log('Request ID      :', config.metadata.requestId)
  console.log('Full URL         :', buildFullUrl(config))
  console.log('Params          :', config.params)
  console.log('Headers         :', normalizeHeaders(config.headers))
  console.groupEnd()
  return config
})

publicApi.interceptors.response.use(
  (response) => {
    const startedAt = response.config?.metadata?.startedAt
    const durationMs = typeof startedAt === 'number' ? Date.now() - startedAt : undefined

    console.groupCollapsed(
      `%c✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      'color:#22c55e;font-weight:bold',
    )
    console.log('Duration (ms)    :', durationMs)
    console.log('Response DATA    :', response.data) // Directly logging data for clarity
    console.groupEnd()
    return response
  },
  (error) => {
    const cfg = error?.config
    const startedAt = cfg?.metadata?.startedAt
    const durationMs = typeof startedAt === 'number' ? Date.now() - startedAt : undefined

    console.group(`%c❌ API ERROR: ${cfg?.method?.toUpperCase()} ${cfg?.url}`, 'color:#ef4444;font-weight:bold')
    
    // 1. STEP ONE: SHOW THE REQUEST THAT WAS SENT
    console.groupCollapsed('1. SENT REQUEST DETAILS')
    console.log('Full URL:', buildFullUrl(cfg))
    console.log('Headers Sent:', normalizeHeaders(cfg?.headers))
    console.log('Payload/Data:', cfg?.data)
    console.log('Config:', cfg)
    console.groupEnd()

    // 2. STEP TWO: SHOW THE SERVER RESPONSE (The Missing Data)
    if (error.response) {
      console.group('2. RECEIVED RESPONSE (THE ERROR)')
      console.log('%cSTATUS CODE:', 'color:#ef4444;font-weight:bold', error.response.status)
      console.log('RESPONSE HEADERS:', normalizeHeaders(error.response.headers))
      
      // THIS IS THE MOST IMPORTANT PART:
      console.log('%cRESPONSE BODY (DATA):', 'color:#facc15;font-weight:bold', error.response.data)
      
      if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
        console.warn('⚠️ SERVER RETURNED HTML INSTEAD OF JSON! Check your Laravel logs/syntax.')
      }
      console.groupEnd()
    } else if (error.request) {
      console.warn('2. NO RESPONSE RECEIVED: Server might be down or CORS is blocking the request.')
      console.log('Raw Request Object:', error.request)
    } else {
      console.error('2. REQUEST SETUP ERROR:', error.message)
    }

    console.log('Duration (ms):', durationMs)
    console.log('Request ID:', cfg?.metadata?.requestId)
    console.groupEnd()

    return Promise.reject(error)
  },
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