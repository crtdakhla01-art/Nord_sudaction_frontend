import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { adminLogout } from '../api/adminAuth'

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminLogout,
    onSettled: async () => {
      await queryClient.clear()
      navigate('/admin/login', { replace: true })
    },
  })
}
