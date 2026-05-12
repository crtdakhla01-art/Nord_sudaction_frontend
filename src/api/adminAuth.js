import {
  adminApi,
  clearOtpContext,
} from './adminClient'

export const loginWithPassword = async (credentials) => {
  const { data } = await adminApi.post('/login', credentials)
  return data
}

export const verifyOtpCode = async (payload) => {
  const { data } = await adminApi.post('/verify-otp', payload)

  // OTP verification now establishes a secure session cookie.
  // No token is returned to localStorage.

  return data
}

export const getStoredUser = async () => {
  // Fetch the current authenticated user from the secure session.
  try {
    const { data } = await adminApi.get('/admin/me')
    return data?.user || null
  } catch {
    return null
  }
}

export const adminLogout = async () => {
  try {
    await adminApi.post('/admin/logout')
  } finally {
    clearOtpContext()
  }
}
