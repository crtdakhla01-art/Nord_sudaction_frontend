import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStatus } from '../api/adminDashboard'

export const useAdminDashboardStatus = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard-status'],
    queryFn: fetchDashboardStatus,
  })
}
