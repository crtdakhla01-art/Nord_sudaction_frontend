import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectOpportunity } from '../api/adminOpportunities'

export const useRejectOpportunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'opportunities'] })
    },
  })
}
