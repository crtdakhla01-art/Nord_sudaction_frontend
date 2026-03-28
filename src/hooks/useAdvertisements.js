import { useQuery } from '@tanstack/react-query'
import { fetchAdvertisements } from '../api/advertisements'

export const useAdvertisements = () => {
  return useQuery({
    queryKey: ['advertisements'],
    queryFn: fetchAdvertisements,
  })
}
