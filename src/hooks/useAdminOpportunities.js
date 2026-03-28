import { useQuery } from '@tanstack/react-query'
import { fetchAdminOpportunities } from '../api/adminOpportunities'

export const useAdminOpportunities = () => {
  return useQuery({
    queryKey: ['admin', 'opportunities'],
    queryFn: fetchAdminOpportunities,
  })
}
