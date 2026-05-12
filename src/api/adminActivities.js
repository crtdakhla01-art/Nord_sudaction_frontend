import { adminApi } from './adminClient'

export const fetchAdminActivities = async () => {
  const { data } = await adminApi.get('/admin/activities')
  return data
}

export const createActivity = async (payload) => {
  const { data } = await adminApi.post('/admin/activities', payload)
  return data
}

export const updateActivity = async ({ id, formData }) => {
  formData.append('_method', 'PUT')
  const { data } = await adminApi.post(`/admin/activities/${id}`, formData)
  return data
}

export const deleteActivity = async (id) => {
  const { data } = await adminApi.delete(`/admin/activities/${id}`)
  return data
}
