import { adminApi } from './adminClient'

export const fetchAdminPosts = async (params = {}) => {
  const { data } = await adminApi.get('/admin/posts', { params })
  return data
}

export const createAdminPost = async (payload) => {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('content', payload.content)
  formData.append('type', payload.type)
  formData.append('status', payload.status)
  formData.append('is_featured', payload.is_featured ? '1' : '0')

  if (payload.external_link) {
    formData.append('external_link', payload.external_link)
  }

  if (payload.published_at) {
    formData.append('published_at', payload.published_at)
  }

  if (payload.image) {
    formData.append('image', payload.image)
  }

  const { data } = await adminApi.post('/admin/posts', formData)
  return data
}

export const updateAdminPost = async ({ id, values }) => {
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('title', values.title)
  formData.append('description', values.description)
  formData.append('content', values.content)
  formData.append('type', values.type)
  formData.append('status', values.status)
  formData.append('is_featured', values.is_featured ? '1' : '0')

  if (values.external_link) {
    formData.append('external_link', values.external_link)
  }

  if (values.published_at) {
    formData.append('published_at', values.published_at)
  }

  if (values.image) {
    formData.append('image', values.image)
  }

  const { data } = await adminApi.post(`/admin/posts/${id}`, formData)
  return data
}

export const deleteAdminPost = async (id) => {
  const { data } = await adminApi.delete(`/admin/posts/${id}`)
  return data
}
