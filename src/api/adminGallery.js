import { adminApi } from './adminClient'

export const fetchAdminGallery = async (page = 1) => {
  const { data } = await adminApi.get('/gallery', { params: { page } })
  return data
}

export const fetchGalleryCategories = async () => {
  const { data } = await adminApi.get('/gallery-categories')
  return data
}

export const createGalleryCategory = async (name) => {
  const { data } = await adminApi.post('/admin/gallery-categories', { name })
  return data
}

export const deleteGalleryCategory = async (id) => {
  const { data } = await adminApi.delete(`/admin/gallery-categories/${id}`)
  return data
}

export const uploadGalleryImages = async ({ files, galleryCategorieId }) => {
  const formData = new FormData()
  formData.append('gallery_categorie_id', String(galleryCategorieId))

  for (const file of files) {
    formData.append('images[]', file)
  }

  const { data } = await adminApi.post('/admin/gallery', formData)
  return data
}

export const updateGalleryImageCategory = async ({ id, galleryCategorieId }) => {
  const { data } = await adminApi.put(`/admin/gallery/${id}`, {
    gallery_categorie_id: galleryCategorieId,
  })
  return data
}

export const deleteGalleryImage = async (id) => {
  const { data } = await adminApi.delete(`/admin/gallery/${id}`)
  return data
}
