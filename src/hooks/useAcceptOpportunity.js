import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptOpportunity } from '../api/adminOpportunities'

export const useAcceptOpportunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'opportunities'] })
    },
  })
}
