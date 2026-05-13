import i18n from '../i18n'

/**
 * Parses backend API error responses and extracts translated message.
 * Backend responses follow pattern: { success, error_key/message_key, data }
 *
 * @param {Object} error - Axios error object
 * @returns {Object} - Parsed error object { key, message, originalError }
 */
export const parseApiError = (error) => {
  // If no error, return null
  if (!error) {
    return null
  }

  // Handle response errors (4xx, 5xx from backend)
  if (error.response?.data) {
    const data = error.response.data

    // Check for error_key first (newer API response format)
    if (data.error_key) {
      return {
        key: data.error_key,
        message: i18n.t(data.error_key, data.error_key), // Fallback to key if translation missing
        originalError: error,
        statusCode: error.response.status,
      }
    }

    // Check for message_key (alternative format)
    if (data.message_key) {
      return {
        key: data.message_key,
        message: i18n.t(data.message_key, data.message_key),
        originalError: error,
        statusCode: error.response.status,
      }
    }

    // Check for error object with nested message
    if (data.error && typeof data.error === 'object') {
      if (data.error.key) {
        return {
          key: data.error.key,
          message: i18n.t(data.error.key, data.error.key),
          originalError: error,
          statusCode: error.response.status,
        }
      }
    }

    // Fallback: check if message exists (old format compatibility)
    if (data.message && typeof data.message === 'string') {
      return {
        key: 'api.error_server_error',
        message: data.message,
        originalError: error,
        statusCode: error.response.status,
      }
    }
  }

  // Handle network errors (no response)
  if (error.message === 'Network Error') {
    return {
      key: 'api.error_server_error',
      message: i18n.t('api.error_server_error'),
      originalError: error,
      statusCode: null,
    }
  }

  // Handle request timeout
  if (error.code === 'ECONNABORTED') {
    return {
      key: 'api.error_server_error',
      message: i18n.t('api.error_server_error'),
      originalError: error,
      statusCode: null,
    }
  }

  // Fallback for any other error
  return {
    key: 'api.error_server_error',
    message: i18n.t('api.error_server_error'),
    originalError: error,
    statusCode: error.response?.status || null,
  }
}

/**
 * Get friendly translated error message for display.
 * Handles both new translation-key format and legacy messages.
 *
 * @param {Object} error - Axios error object
 * @returns {string} - Translated error message ready for display
 */
export const getFriendlyErrorMessage = (error) => {
  const parsed = parseApiError(error)
  return parsed ? parsed.message : i18n.t('api.error_server_error')
}

/**
 * Get error key from response (for advanced logic/analytics)
 *
 * @param {Object} error - Axios error object
 * @returns {string|null} - Error key or null
 */
export const getErrorKey = (error) => {
  const parsed = parseApiError(error)
  return parsed ? parsed.key : null
}

/**
 * Check if error is validation error (400 with multiple field errors)
 *
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  if (!error.response?.data) return false
  const data = error.response.data
  // Validation errors typically have error_key like 'api.error_validation_failed' or have a 422 status
  return error.response.status === 422 || data.error_key === 'api.error_validation_failed'
}

/**
 * Extract field-level validation errors if present
 *
 * @param {Object} error - Axios error object
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const getFieldErrors = (error) => {
  if (!error.response?.data?.errors) {
    return {}
  }

  const errors = error.response.data.errors
  const fieldErrors = {}

  // Handle Laravel validation error format: { field: ['error message'] }
  Object.keys(errors).forEach((field) => {
    const messages = errors[field]
    // Try to find translation key for this field
    const fieldKey = `api.error_${field}_invalid`
    fieldErrors[field] = i18n.t(fieldKey, Array.isArray(messages) ? messages[0] : messages)
  })

  return fieldErrors
}

/**
 * Setup axios error interceptor to automatically handle API errors
 * Call this once during app initialization
 *
 * @param {Object} axiosInstance - Axios instance
 */
export const setupAxiosErrorInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Log parsed error for debugging (in development only)
      if (process.env.NODE_ENV === 'development') {
        const parsed = parseApiError(error)
        if (parsed) {
          console.warn('API Error:', {
            key: parsed.key,
            message: parsed.message,
            statusCode: parsed.statusCode,
          })
        }
      }

      // Re-throw error so components can handle it
      return Promise.reject(error)
    }
  )
}
