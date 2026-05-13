import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { clearOtpContext } from '../api/adminClient'
import { getStoredUser, verifyOtpCode } from '../api/adminAuth'
import { MANAGER_ROLE } from '../constants/roles'
import { authDebug } from '../utils/authDebug'

export const useVerifyOtp = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyOtpCode,
    retry: false,
    onMutate: (payload) => {
      authDebug.log('[OTP]', 'OTP verification started', {
        challengeId: payload?.challenge_id,
      })
    },
    onSuccess: async (data) => {
      authDebug.log('[OTP]', 'OTP verification succeeded; fetching /me', {
        userId: data?.user?.id,
      })

      clearOtpContext()
      const currentUser = (await getStoredUser()) || data?.user || null
      const role = currentUser?.role?.name

      authDebug.log('[SESSION]', 'Current user resolved after OTP', {
        userId: currentUser?.id,
        role,
      })

      authDebug.log('[ROUTE GUARD]', 'Redirecting after OTP success', {
        to: role === MANAGER_ROLE ? '/admin/opportunities' : '/admin',
      })

      navigate(role === MANAGER_ROLE ? '/admin/opportunities' : '/admin', { replace: true })
    },
    onError: (error) => {
      authDebug.warn('[OTP]', 'OTP verification failed', {
        status: error?.response?.status,
        message: error?.response?.data?.message || error?.message,
      })
    },
  })
}
