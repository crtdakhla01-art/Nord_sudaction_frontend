import axios from 'axios'

const defaultApiBaseUrl =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000/api`
    : 'http://localhost:8000/api'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl

export const ADMIN_TOKEN_KEY = 'admin_token'
export const ADMIN_USER_KEY = 'admin_user'
export const ADMIN_OTP_CONTEXT_KEY = 'admin_otp_context'

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY)
export const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token)
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY)

export const getAdminUser = () => {
  const raw = localStorage.getItem(ADMIN_USER_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setAdminUser = (user) => {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
}

export const clearAdminUser = () => localStorage.removeItem(ADMIN_USER_KEY)

export const clearAdminSession = () => {
  clearAdminToken()
  clearAdminUser()
}

export const setOtpContext = (context) => {
  localStorage.setItem(ADMIN_OTP_CONTEXT_KEY, JSON.stringify(context))
}

export const getOtpContext = () => {
  const raw = localStorage.getItem(ADMIN_OTP_CONTEXT_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearOtpContext = () => {
  localStorage.removeItem(ADMIN_OTP_CONTEXT_KEY)
}

export const adminApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
})

const sanitizePayload = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || payload instanceof FormData) {
    return payload ?? null
  }

  const safePayload = { ...payload }

  if ('password' in safePayload) {
    safePayload.password = '***'
  }

  if ('code' in safePayload) {
    safePayload.code = '***'
  }

  return safePayload
}

adminApi.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    const safePayload = sanitizePayload(config.data)

    console.log('[API Request]', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL || ''}${config.url || ''}`,
      params: config.params || null,
      data: safePayload ?? null,
    })
  }

  const token = getAdminToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      const config = error?.config || {}
      const response = error?.response

      console.error('[API Error]', {
        message: error?.message,
        code: error?.code || null,
        status: response?.status || null,
        statusText: response?.statusText || null,
        method: config.method?.toUpperCase() || null,
        url: `${config.baseURL || ''}${config.url || ''}`,
        params: config.params || null,
        requestData: sanitizePayload(config.data),
        responseData: response?.data || null,
        responseHeaders: response?.headers || null,
        stack: error?.stack || null,
      })
    }

    return Promise.reject(error)
  },
)
