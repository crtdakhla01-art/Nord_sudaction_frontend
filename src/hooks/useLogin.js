import { useMutation } from '@tanstack/react-query'
import { loginWithPassword } from '../api/adminAuth'

export const useLogin = () => {
  return useMutation({
    mutationFn: loginWithPassword,
  })
}
