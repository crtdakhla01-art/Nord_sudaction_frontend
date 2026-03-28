import { adminApi } from './adminClient'
import { appendGalleryItemsToFormData } from '../utils/eventGallery'

export const fetchAdminEvents = async () => {
  const { data } = await adminApi.get('/admin/events')
  return data
}

export const createEvent = async (payload) => {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('date', payload.date)
  formData.append('location', payload.location)
  formData.append('is_it_passed', payload.is_it_passed ? '1' : '0')
  appendGalleryItemsToFormData(formData, payload.gallery || [])

  const { data } = await adminApi.post('/admin/events', formData)
  return data
}

export const updateEvent = async ({ id, values }) => {
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('title', values.title)
  formData.append('description', values.description)
  formData.append('date', values.date)
  formData.append('location', values.location)
  formData.append('is_it_passed', values.is_it_passed ? '1' : '0')
  appendGalleryItemsToFormData(formData, values.gallery || [])

  const { data } = await adminApi.post(`/admin/events/${id}`, formData)
  return data
}

export const deleteEvent = async (id) => {
  const { data } = await adminApi.delete(`/admin/events/${id}`)
  return data
}
