import { useQuery } from '@tanstack/react-query'
import { fetchOpportunity } from '../api/opportunities'

export const useOpportunity = (id) => {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => fetchOpportunity(id),
    enabled: Boolean(id),
  })
}
