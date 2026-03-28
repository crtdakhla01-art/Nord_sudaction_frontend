import { useLogin } from './useLogin'
import { useLogout } from './useLogout'
import { useUser } from './useUser'
import { useVerifyOtp } from './useVerifyOtp'

export const useAdminAuth = () => {
  const loginMutation = useLogin()
  const verifyOtpMutation = useVerifyOtp()
  const logoutMutation = useLogout()
  const { isAuthenticated, role, user } = useUser()

  return {
    isAuthenticated,
    role,
    user,
    loginMutation,
    verifyOtpMutation,
    logoutMutation,
  }
}
