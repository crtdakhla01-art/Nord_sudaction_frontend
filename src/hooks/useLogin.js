import { useMutation } from '@tanstack/react-query'
import { loginWithPassword } from '../api/adminAuth'
import { authDebug } from '../utils/authDebug'

export const useLogin = () => {
  return useMutation({
    mutationFn: loginWithPassword,
    retry: false,
    onMutate: (variables) => {
      authDebug.log('[AUTH]', 'Login request started', {
        email: authDebug.maskEmail(variables?.email),
      })
    },
    onSuccess: (data) => {
      authDebug.log('[AUTH]', 'Login step succeeded; OTP required', {
        otpRequired: Boolean(data?.otp_required),
        challengeId: data?.challenge_id,
      })
    },
    onError: (error) => {
      authDebug.warn('[AUTH]', 'Login failed', {
        status: error?.response?.status,
        message: error?.response?.data?.message || error?.message,
      })
    },
  })
}
