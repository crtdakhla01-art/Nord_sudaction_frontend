import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateInscriptionPaymentStatus } from '../api/inscriptions'

export const useUpdateInscriptionPaymentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateInscriptionPaymentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-status'] })
    },
  })
}
