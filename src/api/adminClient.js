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

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
