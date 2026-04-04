import { getImageUrl, publicApi, publicWebBaseUrl } from './client'

const isNotHeic = (value = '') => !String(value).toLowerCase().endsWith('.heic')

const baseUrl = publicWebBaseUrl.replace(/\/+$/, '')

const resolveStorageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('/storage/')) return `${baseUrl}${path}`
  return getImageUrl(path)
}

export const fetchGalleryPage = async ({ pageParam = 1 }) => {
  const response = await publicApi.get('/gallery', { params: { page: pageParam } })
  const payload = response.data ?? {}
  const items = Array.isArray(payload.data) ? payload.data : []

  const images = items
    .filter((item) => isNotHeic(item?.filename) && isNotHeic(item?.disk_path) && isNotHeic(item?.url))
    .map((item) => ({
      id: item.id,
      thumb: resolveStorageUrl(item.url),
      full: resolveStorageUrl(item.url),
      alt: item.filename || 'Gallery image',
      categoryId: item.gallery_categorie_id ?? null,
      categoryName: item?.category?.name || 'Sans categorie',
    }))

  const currentPage = Number(payload.current_page || pageParam)
  const lastPage = Number(payload.last_page || currentPage)

  return {
    images,
    currentPage,
    lastPage,
    nextPage: currentPage < lastPage ? currentPage + 1 : undefined,
  }
}
