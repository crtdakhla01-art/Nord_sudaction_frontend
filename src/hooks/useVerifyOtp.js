import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { clearOtpContext } from '../api/adminClient'
import { verifyOtpCode } from '../api/adminAuth'

export const useVerifyOtp = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyOtpCode,
    onSuccess: (data) => {
      clearOtpContext()
      const role = data?.user?.role?.name
      navigate(role === 'manager' ? '/admin/opportunities' : '/admin', { replace: true })
    },
  })
}
