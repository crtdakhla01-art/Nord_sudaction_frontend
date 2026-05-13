const EMAIL_REGEX = /^(?!.*\.\.)(?!.*\s)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/
const MOROCCAN_PHONE_REGEX = /^(?:\+212|212|0)[5-7]\d{8}$/

export const normalizeEmail = (value) => {
  const normalized = String(value ?? '').trim().toLowerCase()
  return normalized
}

export const normalizePhone = (value) => {
  let normalized = String(value ?? '').trim()
  if (!normalized) return ''

  normalized = normalized.replace(/[^\d+]/g, '')

  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`
  }

  return normalized
}

export const validateEmail = (value, { required = true } = {}) => {
  const normalized = normalizeEmail(value)

  if (!normalized) {
    return required
      ? { isValid: false, errorKey: 'validation.email_required', normalized }
      : { isValid: true, errorKey: null, normalized }
  }

  if (!EMAIL_REGEX.test(normalized)) {
    return { isValid: false, errorKey: 'validation.email_invalid', normalized }
  }

  return { isValid: true, errorKey: null, normalized }
}

export const validatePhone = (value, { required = false } = {}) => {
  const normalized = normalizePhone(value)

  if (!normalized) {
    return required
      ? { isValid: false, errorKey: 'validation.phone_required', normalized }
      : { isValid: true, errorKey: null, normalized }
  }

  if (!MOROCCAN_PHONE_REGEX.test(normalized)) {
    return { isValid: false, errorKey: 'validation.phone_invalid', normalized }
  }

  const onlyDigits = normalized.replace(/\D/g, '')
  if (/^0+$/.test(onlyDigits)) {
    return { isValid: false, errorKey: 'validation.phone_invalid', normalized }
  }

  return { isValid: true, errorKey: null, normalized }
}

export const isTranslationKey = (value) => {
  if (typeof value !== 'string') return false
  return value.includes('.') && !value.includes(' ')
}
