import { useQuery } from '@tanstack/react-query'
import { fetchEvent } from '../api/events'

export const useEvent = (id) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
    enabled: Boolean(id),
  })
}