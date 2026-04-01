import { ADMIN_TOKEN_KEY } from './adminClient'

const getBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000/api`

const authHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  const headers = { Accept: 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

const handleResponse = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Request failed')
  return data
}

export const fetchAdminGallery = async (page = 1) => {
  const res = await fetch(`${getBaseUrl()}/gallery?page=${page}`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export const uploadGalleryImages = async (files) => {
  const formData = new FormData()

  for (const file of files) {
    formData.append('images[]', file)
  }

  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  const headers = { Accept: 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${getBaseUrl()}/admin/gallery`, {
    method: 'POST',
    headers,
    body: formData,
  })

  return handleResponse(res)
}

export const deleteGalleryImage = async (id) => {
  const res = await fetch(`${getBaseUrl()}/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res)
}
