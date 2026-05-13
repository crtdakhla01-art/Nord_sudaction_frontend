import axios from 'axios'
import { authDebug } from '../utils/authDebug'

const defaultApiBaseUrl =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000/api`
    : 'http://localhost:8000/api'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl

// Storage keys for OTP context only (not for tokens/users which use secure cookies)
export const ADMIN_OTP_CONTEXT_KEY = 'admin_otp_context'

export const setOtpContext = (context) => {
  sessionStorage.setItem(ADMIN_OTP_CONTEXT_KEY, JSON.stringify(context))
}

export const getOtpContext = () => {
  const raw = sessionStorage.getItem(ADMIN_OTP_CONTEXT_KEY)

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
  sessionStorage.removeItem(ADMIN_OTP_CONTEXT_KEY)
}

export const adminApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
  // Enable cookies for stateful SPA authentication.
  withCredentials: true,
})

adminApi.interceptors.request.use(
  (config) => {
    authDebug.log('[AXIOS]', 'Request', {
      method: String(config.method || 'GET').toUpperCase(),
      url: config.url,
      withCredentials: config.withCredentials,
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })

    return config
  },
  (error) => {
    authDebug.error('[AXIOS]', 'Request setup failed', {
      message: error?.message,
    })

    return Promise.reject(error)
  }
)

adminApi.interceptors.response.use(
  (response) => {
    authDebug.log('[AXIOS]', 'Response', {
      status: response.status,
      method: String(response.config?.method || 'GET').toUpperCase(),
      url: response.config?.url,
    })

    return response
  },
  (error) => {
    const status = error.response?.status
    const requestUrl = String(error?.config?.url || '')
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const isPreAuthRoute = currentPath === '/admin/login' || currentPath === '/admin/verify-otp'

    authDebug.warn('[AXIOS]', 'Response error', {
      status,
      method: String(error?.config?.method || 'GET').toUpperCase(),
      url: requestUrl,
      message: error?.response?.data?.message || error?.message,
      isPreAuthRoute,
    })

    // Handle 401/419 (unauthenticated or session expired) globally.
    if (status === 401 || status === 419) {
      // Passive user probe should not trigger redirect loops before OTP flow completes.
      if (requestUrl.includes('/admin/me') || isPreAuthRoute) {
        authDebug.log('[SESSION]', 'Ignoring 401/419 for passive /me or pre-auth route', {
          status,
          url: requestUrl,
          currentPath,
        })
        return Promise.reject(error)
      }

      // Clear OTP context on auth failure and redirect to login.
      clearOtpContext()

      authDebug.warn('[SESSION]', 'Session expired/unauthorized; clearing OTP context and redirecting', {
        status,
        currentPath,
      })

      // Optionally redirect or emit auth event to be handled by the app.
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    return Promise.reject(error)
  }
)

