import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitOpportunity } from '../api/opportunities'

export const useSubmitOpportunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
  })
}
