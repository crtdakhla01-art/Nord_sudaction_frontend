import { adminApi } from './adminClient'

export const fetchAdminAdvertisements = async () => {
  const { data } = await adminApi.get('/admin/advertisements')
  return data
}

export const createAdvertisement = async (payload) => {
  const formData = new FormData()
  formData.append('image', payload.image)
  formData.append('begin_date', payload.begin_date)
  formData.append('end_date', payload.end_date)

  if (payload.link?.trim()) {
    formData.append('link', payload.link.trim())
  }

  const { data } = await adminApi.post('/admin/advertisements', formData)
  return data
}

export const updateAdvertisement = async ({ id, values }) => {
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('begin_date', values.begin_date)
  formData.append('end_date', values.end_date)

  if (values.link?.trim()) {
    formData.append('link', values.link.trim())
  }

  if (values.image) {
    formData.append('image', values.image)
  }

  const { data } = await adminApi.post(`/admin/advertisements/${id}`, formData)
  return data
}

export const deleteAdvertisement = async (id) => {
  const { data } = await adminApi.delete(`/admin/advertisements/${id}`)
  return data
}
