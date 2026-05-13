import { useState } from 'react'
import { parseApiError, getErrorKey, getFieldErrors, isValidationError } from '../utils/apiErrorHandler'

/**
 * Custom hook for handling API errors in React components.
 * Provides methods to parse errors, display friendly messages, and handle validation errors.
 *
 * @returns {Object} - Hook with error handling methods and state
 */
export const useApiError = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handle an API error and extract friendly message
   * @param {Object} error - Axios error object
   * @returns {string} - The friendly error message
   */
  const handleError = (error) => {
    const parsed = parseApiError(error)
    if (parsed) {
      setErrorMessage(parsed.message)
      if (isValidationError(error)) {
        setValidationErrors(getFieldErrors(error))
      }
      return parsed.message
    }
    setErrorMessage('An unexpected error occurred')
    return 'An unexpected error occurred'
  }

  /**
   * Clear all error states
   */
  const clearErrors = () => {
    setErrorMessage(null)
    setValidationErrors({})
  }

  /**
   * Clear specific field error
   * @param {string} fieldName - Name of field to clear error for
   */
  const clearFieldError = (fieldName) => {
    setValidationErrors((prev) => {
      const updated = { ...prev }
      delete updated[fieldName]
      return updated
    })
  }

  /**
   * Get error message for a specific field
   * @param {string} fieldName - Name of field
   * @returns {string|null} - Error message or null
   */
  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || null
  }

  /**
   * Get error key (for analytics or advanced logic)
   * @param {Object} error - Axios error object
   * @returns {string|null} - Error key
   */
  const getError = (error) => {
    return getErrorKey(error)
  }

  /**
   * Check if current error state has validation errors
   * @returns {boolean}
   */
  const hasValidationErrors = () => {
    return Object.keys(validationErrors).length > 0
  }

  return {
    // State
    errorMessage,
    validationErrors,
    isLoading,
    setIsLoading,

    // Methods
    handleError,
    clearErrors,
    clearFieldError,
    getFieldError,
    getError,
    hasValidationErrors,

    // Low-level state setters for advanced use
    setErrorMessage,
    setValidationErrors,
  }
}
