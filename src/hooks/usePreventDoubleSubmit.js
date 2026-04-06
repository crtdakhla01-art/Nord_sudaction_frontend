import { useRef, useCallback } from 'react'

/**
 * Returns a `wrap` function that guards any async submit handler against
 * duplicate invocations. A second call while the first is still in-flight is
 * silently dropped (+ dev warning). This covers the brief window between the
 * first click and React re-rendering with isPending=true from React Query.
 *
 * Usage:
 *   const { wrap } = usePreventDoubleSubmit()
 *   const handleSubmit = wrap(async (event) => { ... })
 */
function usePreventDoubleSubmit() {
  const inFlightRef = useRef(false)

  const wrap = useCallback((asyncFn) => async (...args) => {
    if (inFlightRef.current) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[usePreventDoubleSubmit] Duplicate submission prevented.')
      }
      return
    }

    inFlightRef.current = true
    try {
      await asyncFn(...args)
    } finally {
      inFlightRef.current = false
    }
  }, [])

  return { wrap }
}

export default usePreventDoubleSubmit
