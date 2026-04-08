import { useEffect, useMemo, useRef, useState } from 'react'

const COUNTER_API_URL = 'https://api.nordsudaction.ma/api/visitor-up'
const SESSION_COUNT_KEY = 'nsa_visitor_counter_value'
const INITIAL_COUNT = 8965
const DISPLAY_LABEL = 'Vous etes le visiteur numero :'

function toSafeCount(payload) {
  if (payload && typeof payload === 'object') {
    const candidates = [payload.count, payload.value, payload.total]
    for (const candidate of candidates) {
      const parsed = Number(candidate)
      if (Number.isFinite(parsed) && parsed >= 0) {
        return Math.trunc(parsed)
      }
    }
  }

  return null
}

function VisitorCounter() {
  const [count, setCount] = useState(() => {
    const cached = sessionStorage.getItem(SESSION_COUNT_KEY)
    if (cached === null) {
      return INITIAL_COUNT
    }

    const parsed = Number(cached)
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.trunc(parsed)
    }

    return INITIAL_COUNT
  })
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) {
      return
    }

    hasStartedRef.current = true

    let isActive = true

    const loadCounter = async () => {
      try {
        const response = await fetch(COUNTER_API_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          return
        }

        const payload = await response.json()
        const value = toSafeCount(payload)

        if (value === null) {
          return
        }

        sessionStorage.setItem(SESSION_COUNT_KEY, String(value))

        if (isActive) {
          setCount(value)
        }
      } catch {
        // Keep the default visible value on network/proxy errors.
      }
    }

    loadCounter()

    return () => {
      isActive = false
    }
  }, [count])

  const formattedCount = useMemo(() => {
    if (!Number.isFinite(count)) {
      return String(INITIAL_COUNT)
    }

    return new Intl.NumberFormat('en-US').format(count)
  }, [count])
  const ariaCount = Number.isFinite(count) ? count : INITIAL_COUNT

  return (
    <div
      className="visitor-counter"
      style={{ display: 'flex' }}
      aria-live="polite"
      aria-label={`${DISPLAY_LABEL} ${ariaCount}`}
    >
      <span className="visitor-counter__label">{DISPLAY_LABEL}</span>
      <span className="visitor-counter__count">{formattedCount}</span>
    </div>
  )
}

export default VisitorCounter
