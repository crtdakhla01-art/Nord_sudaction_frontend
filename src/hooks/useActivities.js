import { useQuery } from '@tanstack/react-query'
import { fetchActivities } from '../api/activities'

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  })
}
