export const createEmptyGalleryItem = () => ({
  image: null,
  existingImage: '',
  vedio: null,
  existingVedio: '',
  link: '',
})

export const normalizeGalleryLink = (value) => {
  const trimmed = typeof value === 'string' ? value.trim() : ''

  if (!trimmed) {
    return ''
  }

  if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed.replace(/^\/+/, '')}`
}

const isValidGalleryLink = (value) => {
  const normalizedValue = normalizeGalleryLink(value)

  if (!normalizedValue) {
    return false
  }

  try {
    const parsed = new URL(normalizedValue)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const getGalleryItems = (event) => {
  const items = (event?.gallery || []).map((item) => ({
    image: null,
    existingImage: item.image || '',
    vedio: null,
    existingVedio: item.vedio || '',
    link: item.link || '',
  }))

  return items.length > 0 ? items : [createEmptyGalleryItem()]
}

export const appendGalleryItemsToFormData = (formData, galleryItems) => {
  galleryItems.forEach((item, index) => {
    const normalizedLink = normalizeGalleryLink(item.link)
    const hasValidLink = isValidGalleryLink(normalizedLink)
    const hasData = item.image || item.existingImage || item.vedio || item.existingVedio || hasValidLink

    if (!hasData) {
      return
    }

    if (item.image) {
      formData.append(`gallery[${index}][image]`, item.image)
    } else if (item.existingImage) {
      formData.append(`gallery[${index}][existing_image]`, item.existingImage)
    }

    if (item.vedio) {
      formData.append(`gallery[${index}][vedio]`, item.vedio)
    } else if (item.existingVedio) {
      formData.append(`gallery[${index}][existing_vedio]`, item.existingVedio)
    }

    if (hasValidLink) {
      formData.append(`gallery[${index}][link]`, normalizedLink)
    }
  })
}

export const getFeaturedGalleryMedia = (event) => {
  const gallery = event?.gallery || []
  const imageItem = gallery.find((item) => item?.image)

  if (imageItem) {
    return {
      type: 'image',
      path: imageItem.image,
      link: imageItem.link || '',
    }
  }

  const videoItem = gallery.find((item) => item?.vedio)

  if (videoItem) {
    return {
      type: 'video',
      path: videoItem.vedio,
      link: videoItem.link || '',
    }
  }

  const linkItem = gallery.find((item) => item?.link)

  return {
    type: null,
    path: '',
    link: linkItem?.link || '',
  }
}