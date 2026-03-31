import { publicApi } from './client'

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
  const payload = new FormData()
  if (formValues.titre) payload.append('titre', formValues.titre)
  if (formValues.ville) payload.append('ville', formValues.ville)
  payload.append('first_name', formValues.first_name)
  payload.append('last_name', formValues.last_name)
  payload.append('description', formValues.description)
  payload.append('budget', formValues.budget)
  payload.append('phone', formValues.phone)
  payload.append('email', formValues.email)
  payload.append('type_key', formValues.type_key)

  if (Array.isArray(formValues.images)) {
    formValues.images.forEach((file) => {
      payload.append('images[]', file)
    })
  }

  // Backward compatibility if caller still sends a single image field.
  if (formValues.image) {
    payload.append('image', formValues.image)
  }

  const { data } = await publicApi.post('/opportunities', payload)
  return data
}
