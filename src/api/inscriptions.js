import { adminApi } from './adminClient'
import { publicApi } from './client'

export const submitInscription = async (payload) => {
  const formData = new FormData()

  formData.append('full_name', payload.full_name)
  formData.append('birth_date', payload.birth_date)
  formData.append('city', payload.city)
  formData.append('phone', payload.phone)
  formData.append('email', payload.email)
  formData.append('profession', payload.profession)
  formData.append('organization', payload.organization)

  payload.participant_profiles.forEach((value) => formData.append('participant_profiles[]', value))
  if (payload.participant_profile_other) formData.append('participant_profile_other', payload.participant_profile_other)

  payload.investment_sectors.forEach((value) => formData.append('investment_sectors[]', value))
  if (payload.investment_sector_other) formData.append('investment_sector_other', payload.investment_sector_other)

  payload.confirmed_activities.forEach((value) => formData.append('confirmed_activities[]', value))

  if (payload.payment_proof) {
    formData.append('payment_proof', payload.payment_proof)
  }

  if (payload.cin_copy) {
    formData.append('cin_copy', payload.cin_copy)
  }

  formData.append('is_payment_confirmed', payload.is_payment_confirmed ? '1' : '0')
  formData.append('is_terms_accepted', payload.is_terms_accepted ? '1' : '0')

  const { data } = await publicApi.post('/inscriptions', formData)
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
