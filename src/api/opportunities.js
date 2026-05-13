import { publicApi } from './client'
import { normalizeEmail, normalizePhone } from '../utils/validation'

export const fetchOpportunities = async () => {
  const { data } = await publicApi.get('/opportunities')
  return data
}

export const fetchOpportunity = async (id) => {
  const { data } = await publicApi.get(`/opportunities/${id}`)
  return data
}

export const fetchOpportunityTypes = async () => {
  const { data } = await publicApi.get('/types-opportunities')
  return data
}

export const submitOpportunity = async (formValues) => {
  const normalizedEmail = normalizeEmail(formValues.email)
  const normalizedPhone = normalizePhone(formValues.phone)
  const payload = new FormData()
  if (formValues.titre) payload.append('titre', formValues.titre)
  if (formValues.ville) payload.append('ville', formValues.ville)
  payload.append('first_name', formValues.first_name)
  payload.append('last_name', formValues.last_name)
  payload.append('description', formValues.description)
  payload.append('budget', formValues.budget)
  payload.append('phone', normalizedPhone)
  payload.append('email', normalizedEmail)
  payload.append('type_key', formValues.type_key)

  if (Array.isArray(formValues.images)) {
    formValues.images.forEach((file) => {
      payload.append('images[]', file)
    })
  }

  const { data } = await publicApi.post('/opportunities', payload)
  return data
}
