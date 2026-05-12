export const createEmptyGalleryItem = () => ({
  image: null,
  existingImage: '',
  video: null,
  existingVideo: '',
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
    video: null,
    existingVideo: item.video || '',
    link: item.link || '',
  }))

  return items.length > 0 ? items : [createEmptyGalleryItem()]
}

export const appendGalleryItemsToFormData = (formData, galleryItems) => {
  galleryItems.forEach((item, index) => {
    const normalizedLink = normalizeGalleryLink(item.link)
    const hasValidLink = isValidGalleryLink(normalizedLink)
    const hasData = item.image || item.existingImage || item.video || item.existingVideo || hasValidLink

    if (!hasData) {
      return
    }

    if (item.image) {
      formData.append(`gallery[${index}][image]`, item.image)
    } else if (item.existingImage) {
      formData.append(`gallery[${index}][existing_image]`, item.existingImage)
    }

    if (item.video) {
      formData.append(`gallery[${index}][video]`, item.video)
    } else if (item.existingVideo) {
      formData.append(`gallery[${index}][existing_video]`, item.existingVideo)
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

  const videoItem = gallery.find((item) => item?.video)

  if (videoItem) {
    return {
      type: 'video',
      path: videoItem.video,
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