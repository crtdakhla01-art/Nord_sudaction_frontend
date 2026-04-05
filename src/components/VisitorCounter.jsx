import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const COUNTER_API_URL = 'https://api.counterapi.dev/v1/nordsudaction_visitore/up'
const SESSION_COUNT_KEY = 'nsa_visitor_counter_value'
const VISIBILITY_THRESHOLD = 0
const DEV_FALLBACK_COUNT = 1234

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

function detectLanguage(pathname) {
  const path = (pathname || '').toLowerCase()

  if (path.startsWith('/es') || path.includes('/es/')) {
    return 'es'
  }

  if (path.startsWith('/fr') || path.includes('/fr/')) {
    return 'fr'
  }

  if (path.startsWith('/en') || path.includes('/en/')) {
    return 'en'
  }

  const saved = (localStorage.getItem('lang') || '').toLowerCase()
  if (saved.startsWith('fr')) {
    return 'fr'
  }
  if (saved.startsWith('es')) {
    return 'es'
  }
  if (saved.startsWith('en')) {
    return 'en'
  }

  const browserLanguage = (navigator.language || '').toLowerCase()
  if (browserLanguage.startsWith('fr')) {
    return 'fr'
  }
  if (browserLanguage.startsWith('es')) {
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
  const { pathname } = useLocation()
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
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          if (import.meta.env.DEV) {
            sessionStorage.setItem(SESSION_COUNT_KEY, String(DEV_FALLBACK_COUNT))
            if (isActive) {
              setCount(DEV_FALLBACK_COUNT)
            }
          }
          return
        }

        const payload = await response.json()
        const value = toSafeCount(payload)

        if (value === null) {
          if (import.meta.env.DEV) {
            sessionStorage.setItem(SESSION_COUNT_KEY, String(DEV_FALLBACK_COUNT))
            if (isActive) {
              setCount(DEV_FALLBACK_COUNT)
            }
          }
          return
        }

        sessionStorage.setItem(SESSION_COUNT_KEY, String(value))

        if (isActive) {
          setCount(value)
        }
      } catch {
        if (import.meta.env.DEV) {
          sessionStorage.setItem(SESSION_COUNT_KEY, String(DEV_FALLBACK_COUNT))
          if (isActive) {
            setCount(DEV_FALLBACK_COUNT)
          }
        }
      }
    }

    loadCounter()

    return () => {
      isActive = false
    }
  }, [count])

  const isAdminRoute = pathname.toLowerCase().startsWith('/admin')
  const language = useMemo(() => detectLanguage(pathname), [pathname])
  const label = useMemo(() => labelForLanguage(language), [language])
  const shouldShow = (import.meta.env.DEV || !isAdminRoute) && Number.isFinite(count) && count >= VISIBILITY_THRESHOLD

  return (
    <div
      className="visitor-counter"
      style={{ display: shouldShow ? 'flex' : 'none' }}
      aria-live="polite"
      aria-label={shouldShow ? `${label} ${count}` : 'Visitor counter hidden'}
    >
      <span className="visitor-counter__label">{label}</span>
      <span className="visitor-counter__count">{count}</span>
    </div>
  )
}

export default VisitorCounter
