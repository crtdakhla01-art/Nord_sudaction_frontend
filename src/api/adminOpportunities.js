import { adminApi } from './adminClient'

export const fetchAdminOpportunities = async () => {
  const { data } = await adminApi.get('/admin/opportunities')
  return data
}

export const fetchAdminOpportunity = async (id) => {
  const { data } = await adminApi.get(`/admin/opportunities/${id}`)
  return data
}

export const acceptOpportunity = async (id) => {
  const { data } = await adminApi.put(`/admin/opportunities/${id}/accept`)
  return data
}

export const rejectOpportunity = async (id) => {
  const { data } = await adminApi.put(`/admin/opportunities/${id}/reject`)
  return data
}
