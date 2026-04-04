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

export const fetchGalleryCategories = async () => {
  const res = await fetch(`${getBaseUrl()}/gallery-categories`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export const createGalleryCategory = async (name) => {
  const res = await fetch(`${getBaseUrl()}/admin/gallery-categories`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  return handleResponse(res)
}

export const deleteGalleryCategory = async (id) => {
  const res = await fetch(`${getBaseUrl()}/admin/gallery-categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export const uploadGalleryImages = async ({ files, galleryCategorieId }) => {
  const formData = new FormData()
  formData.append('gallery_categorie_id', String(galleryCategorieId))

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

export const updateGalleryImageCategory = async ({ id, galleryCategorieId }) => {
  const res = await fetch(`${getBaseUrl()}/admin/gallery/${id}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gallery_categorie_id: galleryCategorieId }),
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
