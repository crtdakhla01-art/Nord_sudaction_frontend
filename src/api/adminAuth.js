import {
  adminApi,
  clearAdminSession,
  getAdminUser,
  setAdminToken,
  setAdminUser,
} from './adminClient'

export const loginWithPassword = async (credentials) => {
  const { data } = await adminApi.post('/login', credentials)
  return data
}

export const verifyOtpCode = async (payload) => {
  const { data } = await adminApi.post('/verify-otp', payload)

  if (data?.token) {
    setAdminToken(data.token)
  }

  if (data?.user) {
    setAdminUser(data.user)
  }

  return data
}

export const getStoredUser = () => getAdminUser()

export const adminLogout = async () => {
  try {
    await adminApi.post('/admin/logout')
  } finally {
    clearAdminSession()
  }
}
