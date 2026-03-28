import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdvertisement,
  deleteAdvertisement,
  fetchAdminAdvertisements,
  updateAdvertisement,
} from '../api/adminAdvertisements'

export const useAdvertisementsCRUD = () => {
  const queryClient = useQueryClient()

  const advertisementsQuery = useQuery({
    queryKey: ['admin', 'advertisements'],
    queryFn: fetchAdminAdvertisements,
  })

  const createMutation = useMutation({
    mutationFn: createAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'advertisements'] })
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'advertisements'] })
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'advertisements'] })
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
    },
  })

  return {
    advertisementsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
