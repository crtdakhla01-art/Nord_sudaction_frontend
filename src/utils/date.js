export const toDateInputValue = (value) => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  return value.includes('T') ? value.split('T')[0] : value
}

export const formatDateLabel = (value, locale = 'fr') => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}