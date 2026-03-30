import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createActivity, deleteActivity, fetchAdminActivities, updateActivity } from '../api/adminActivities'

export const useActivitiesCRUD = () => {
  const queryClient = useQueryClient()

  const activitiesQuery = useQuery({
    queryKey: ['admin', 'activities'],
    queryFn: fetchAdminActivities,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'activities'] })

  const createMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: updateActivity,
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: invalidate,
  })

  return { activitiesQuery, createMutation, updateMutation, deleteMutation }
}
