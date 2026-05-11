import { useQuery } from '@tanstack/react-query'
import { fetchAdminInscriptions } from '../api/inscriptions'

export const useAdminInscriptions = () => {
  return useQuery({
    queryKey: ['admin', 'inscriptions'],
    queryFn: fetchAdminInscriptions,
  })
}
