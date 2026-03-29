import { adminApi } from './adminClient'

export const fetchDashboardStatus = async () => {
  const { data } = await adminApi.get('/admin/dashboard-status')
  return data
}
