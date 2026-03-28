import { getAdminToken, getAdminUser } from '../api/adminClient'

export const useUser = () => {
  const token = getAdminToken()
  const user = getAdminUser()

  return {
    token,
    user,
    role: user?.role?.name || null,
    isAuthenticated: Boolean(token),
  }
}
