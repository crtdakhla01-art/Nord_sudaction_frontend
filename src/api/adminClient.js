import axios from 'axios'

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

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/419 (unauthenticated or session expired) globally.
    if (error.response?.status === 401 || error.response?.status === 419) {
      // Clear OTP context on auth failure and redirect to login.
      clearOtpContext()
      
      // Optionally redirect or emit auth event to be handled by the app.
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    return Promise.reject(error)
  }
)

