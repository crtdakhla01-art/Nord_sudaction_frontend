const normalizeMessage = (value) =>
  {
    const text = String(value ?? '').toLowerCase()
    const normalized = typeof text.normalize === 'function'
      ? text.normalize('NFD')
      : text

    return normalized
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

const getFirstValidationMessage = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return null
  }

  for (const value of Object.values(errors)) {
    if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim()){
      return value[0]
    }

    if (typeof value === 'string' && value.trim()){
      return value
    }
  }

  return null
}

const isTranslationKey = (value) => typeof value === 'string' && value.includes('.') && !value.includes(' ')

const isTechnicalMessage = (message) => {
  const normalized = normalizeMessage(message)

  return (
    normalized.includes('request failed with status code') ||
    normalized.includes('network error') ||
    normalized.includes('sqlstate') ||
    normalized.includes('stack trace') ||
    normalized.includes('exception')
  )
}

export const getFriendlyServerError = (error, options = {}) => {
  const t = options.t || ((key) => key)
  const response = error?.response
  const data = response?.data || {}
  const requestUrl = String(error?.config?.url || '').toLowerCase()
  const apiKey =
    (typeof data?.error_key === 'string' && data.error_key.trim()) ||
    (typeof data?.message_key === 'string' && data.message_key.trim()) ||
    null
  const status = options.status ?? response?.status ?? null
  const validationMessage = getFirstValidationMessage(data?.errors)
  const rawMessage =
    options.message ||
    validationMessage ||
    data?.message ||
    data?.error ||
    (typeof data === 'string' ? data : null) ||
    error?.message ||
    ''

  const normalized = normalizeMessage(rawMessage)

  // New API format: backend returns translation keys (error_key/message_key).
  // Always prioritize explicit backend keys over generic HTTP status mappings.
  if (apiKey) {
    return t(apiKey)
  }

  if (
    options.context === 'newsletter' &&
    (
      normalized.includes('already used') ||
      normalized.includes('already been taken') ||
      normalized.includes('deja utilise') ||
      normalized.includes('deja inscrit') ||
      (status === 422 && Array.isArray(data?.errors?.email) && data.errors.email.length > 0)
    )
  ) {
    return t('newsletterAlreadySubscribed')
  }

  if (
    !response &&
    (
      error?.code === 'ERR_NETWORK' ||
      normalized.includes('network error') ||
      normalized.includes('failed to fetch')
    )
  ) {
    return t('friendlyNetworkError')
  }

  if (
    normalized.includes('provided credentials are invalid') ||
    normalized.includes('credentials are invalid') ||
    normalized.includes('invalid credentials') ||
    normalized.includes('email or password') ||
    normalized.includes('incorrect password')
  ) {
    return t('friendlyInvalidCredentials')
  }

  // Some environments may return 500 for auth failures.
  // If this is a login request and the payload/message hints at invalid auth,
  // prefer the credential message over a generic server error text.
  if (
    requestUrl.includes('/login') &&
    status === 500 &&
    (
      normalized.includes('unauthorized') ||
      normalized.includes('invalid') ||
      normalized.includes('credential') ||
      normalized.includes('password') ||
      normalized.includes('email')
    )
  ) {
    return t('friendlyInvalidCredentials')
  }

  if (
    normalized.includes('otp') &&
    (
      normalized.includes('invalid') ||
      normalized.includes('incorrect') ||
      normalized.includes('expired') ||
      normalized.includes('invalide')
    )
  ) {
    return t('friendlyInvalidOtp')
  }

  if (status === 429 || normalized.includes('too many')) {
    return t('friendlyTooManyAttempts')
  }

  if (status === 401) {
    return t('friendlyUnauthorized')
  }

  if (status === 403) {
    return t('friendlyForbidden')
  }

  if (status === 404) {
    return t('friendlyNotFound')
  }

  if (status === 422) {
    if (validationMessage && isTranslationKey(validationMessage)) {
      return t(validationMessage)
    }

    return validationMessage || t('friendlyValidationError')
  }

  if (status >= 500) {
    return t('friendlyServerError')
  }

  if (typeof rawMessage === 'string' && rawMessage.trim() && !isTechnicalMessage(rawMessage)) {
    return rawMessage
  }

  return options.fallback || t('formSubmitError')
}
