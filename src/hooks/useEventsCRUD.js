import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createEvent, deleteEvent, fetchAdminEvents, updateEvent } from '../api/adminEvents'

export const useEventsCRUD = () => {
  const queryClient = useQueryClient()

  const eventsQuery = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: fetchAdminEvents,
  })

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
    },
  })

  return {
    eventsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
