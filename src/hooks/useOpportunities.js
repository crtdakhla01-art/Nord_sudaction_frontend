import { useQuery } from '@tanstack/react-query'
import { fetchOpportunities } from '../api/opportunities'

export const useOpportunities = () => {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities,
  })
}
