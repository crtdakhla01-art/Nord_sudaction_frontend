export const getOpportunityImages = (opportunity) => {
  if (!opportunity) {
    return []
  }

  if (Array.isArray(opportunity.images) && opportunity.images.length > 0) {
    return opportunity.images
      .map((item) => item?.path)
      .filter(Boolean)
  }

  if (opportunity.image) {
    return [opportunity.image]
  }

  return []
}

export const getPrimaryOpportunityImage = (opportunity) => {
  const images = getOpportunityImages(opportunity)
  return images[0] || null
}
