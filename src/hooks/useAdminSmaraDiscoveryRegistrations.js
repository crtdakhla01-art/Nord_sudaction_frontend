import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteAdminSmaraDiscoveryRegistration,
  fetchAdminSmaraDiscoveryRegistration,
  fetchAdminSmaraDiscoveryRegistrations,
} from '../api/smaraDiscoveryRegistrations'

export const useAdminSmaraDiscoveryRegistrations = (filters = {}) => {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['admin', 'smara-discovery-registrations', filters],
    queryFn: () => fetchAdminSmaraDiscoveryRegistrations(filters),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdminSmaraDiscoveryRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'smara-discovery-registrations'] })
    },
  })

  return { listQuery, deleteMutation }
}

export const useAdminSmaraDiscoveryRegistration = (id) => {
  return useQuery({
    queryKey: ['admin', 'smara-discovery-registrations', id],
    queryFn: () => fetchAdminSmaraDiscoveryRegistration(id),
    enabled: Boolean(id),
  })
}
