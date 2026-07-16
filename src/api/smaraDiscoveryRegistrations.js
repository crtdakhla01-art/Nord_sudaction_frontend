import { publicApi } from './client'
import { adminApi } from './adminClient'
import { normalizeEmail, normalizePhone } from '../utils/validation'

export const submitSmaraDiscoveryRegistration = async (formValues) => {
  const payload = {
    ...formValues,
    email: normalizeEmail(formValues.email),
    phone: normalizePhone(formValues.phone),
    has_visited_es_smara: formValues.has_visited_es_smara === 'yes',
    notify_first_date: formValues.notify_first_date === 'yes',
  }

  const { data } = await publicApi.post('/smara-discovery-registrations', payload)
  return data
}

export const fetchAdminSmaraDiscoveryRegistrations = async (params = {}) => {
  const { data } = await adminApi.get('/admin/smara-discovery-registrations', { params })
  return data
}

export const fetchAdminSmaraDiscoveryRegistration = async (id) => {
  const { data } = await adminApi.get(`/admin/smara-discovery-registrations/${id}`)
  return data
}

export const deleteAdminSmaraDiscoveryRegistration = async (id) => {
  const { data } = await adminApi.delete(`/admin/smara-discovery-registrations/${id}`)
  return data
}
