import { useQuery } from '@tanstack/react-query'
import { fetchAdminOpportunity } from '../api/adminOpportunities'

export const useAdminOpportunity = (id) => {
  return useQuery({
    queryKey: ['admin', 'opportunity', id],
    queryFn: () => fetchAdminOpportunity(id),
    enabled: Boolean(id),
  })
}
