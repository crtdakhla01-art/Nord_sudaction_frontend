import { useEffect, useMemo, useRef, useState } from 'react'

const COUNTER_API_URL = 'https://api.nordsudaction.ma/counter-proxy.php'
const SESSION_COUNT_KEY = 'nsa_visitor_counter_value'
const VISIBILITY_THRESHOLD = 1000

function toSafeCount(payload) {
  if (payload && typeof payload === 'object') {
    const candidates = [payload.up_count, payload.count, payload.value, payload.total]
    for (const candidate of candidates) {
      const parsed = Number(candidate)
      if (Number.isFinite(parsed) && parsed >= 0) {
        return Math.trunc(parsed)
      }
    }
  }

  return null
}

function detectBrowserLanguage() {
  const language = (navigator.language || '').toLowerCase()

  if (language.startsWith('fr')) {
    return 'fr'
  }

  if (language.startsWith('es')) {
    return 'es'
  }

  return 'en'
}

function labelForLanguage(language) {
  if (language === 'fr') {
    return 'Visiteurs :'
  }

  if (language === 'es') {
    return 'Visitantes:'
  }

  return 'Visitors:'
}

function VisitorCounter() {
  const [count, setCount] = useState(() => {
    const cached = sessionStorage.getItem(SESSION_COUNT_KEY)
    if (cached === null) {
      return null
    }

    const parsed = Number(cached)
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.trunc(parsed)
    }

    return null
  })
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) {
      return
    }

    hasStartedRef.current = true

    if (count !== null) {
      return
    }

    let isActive = true

    const loadCounter = async () => {
      try {
        const response = await fetch(COUNTER_API_URL, {
          method: 'GET',
          mode: 'cors',
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
        // Keep hidden on any network/proxy error.
      }
    }

    loadCounter()

    return () => {
      isActive = false
    }
  }, [count])

  const browserLanguage = useMemo(() => detectBrowserLanguage(), [])
  const label = useMemo(() => labelForLanguage(browserLanguage), [browserLanguage])
  const formattedCount = useMemo(() => {
    if (!Number.isFinite(count)) {
      return ''
    }

    return new Intl.NumberFormat('en-US').format(count)
  }, [count])
  const shouldShow = Number.isFinite(count) && count >= VISIBILITY_THRESHOLD

  return (
    <div
      className="visitor-counter"
      style={{ display: shouldShow ? 'flex' : 'none' }}
      aria-live="polite"
      aria-label={shouldShow ? `${label} ${count}` : 'Visitor counter hidden'}
    >
      <span className="visitor-counter__label">{label}</span>
      <span className="visitor-counter__count">{formattedCount}</span>
    </div>
  )
}

export default VisitorCounter
