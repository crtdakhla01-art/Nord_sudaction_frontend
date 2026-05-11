import { adminApi } from './adminClient'
import { publicApi } from './client'

export const submitInscription = async (payload) => {
  const { data } = await publicApi.post('/inscriptions', payload)
  return data
}

export const fetchAdminInscriptions = async () => {
  const { data } = await adminApi.get('/admin/inscriptions')
  return data
}

export const updateInscriptionPaymentStatus = async ({ id, is_paid }) => {
  const { data } = await adminApi.put(`/admin/inscriptions/${id}/payment-status`, { is_paid })
  return data
}
