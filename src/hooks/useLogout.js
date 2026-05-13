import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { adminLogout } from '../api/adminAuth'
import { authDebug } from '../utils/authDebug'

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminLogout,
    onMutate: () => {
      authDebug.log('[LOGOUT]', 'Logout started')
    },
    onError: (error) => {
      authDebug.warn('[LOGOUT]', 'Logout request failed; continuing cleanup', {
        status: error?.response?.status,
        message: error?.response?.data?.message || error?.message,
      })
    },
    onSettled: async () => {
      authDebug.log('[LOGOUT]', 'Logout settled; clearing query cache and redirecting')
      await queryClient.clear()
      navigate('/admin/login', { replace: true })
    },
  })
}
