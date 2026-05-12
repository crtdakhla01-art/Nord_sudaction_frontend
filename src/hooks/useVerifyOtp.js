import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { clearOtpContext } from '../api/adminClient'
import { verifyOtpCode } from '../api/adminAuth'
import { MANAGER_ROLE } from '../constants/roles'

export const useVerifyOtp = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyOtpCode,
    retry: false,
    onSuccess: (data) => {
      clearOtpContext()
      const role = data?.user?.role?.name
      navigate(role === MANAGER_ROLE ? '/admin/opportunities' : '/admin', { replace: true })
    },
  })
}
