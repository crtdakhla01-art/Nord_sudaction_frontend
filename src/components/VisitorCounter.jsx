import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const COUNTER_API_URL = 'https://api.nordsudaction.ma/api/visitor-up'
const SESSION_COUNT_KEY = 'nsa_visitor_counter_value'
const INITIAL_COUNT = 8965

function toSafeCount(payload) {
  if (payload && typeof payload === 'object') {
    const candidates = [
      payload.count,
      payload.value,
      payload.total,
      payload?.data?.count,
      payload?.data?.value,
      payload?.data?.total,
    ]

    for (const candidate of candidates) {
      const parsed = Number(candidate)
      if (Number.isFinite(parsed) && parsed >= 0) {
        return Math.trunc(parsed)
      }
    }

    const upCount = Number(payload?.data?.up_count)
    if (Number.isFinite(upCount) && upCount >= 0) {
    // The production counter API exposes incremental visits as up_count.
      return INITIAL_COUNT + Math.trunc(upCount)
    }
  }

  return null
}

function VisitorCounter() {
  const { t, i18n } = useTranslation()
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
  useEffect(() => {
    let isActive = true

    // This endpoint increments the counter. Do not call it again on refresh
    // if we already counted this browser session.
    if (sessionStorage.getItem(SESSION_COUNT_KEY) !== null) {
      return () => {
        isActive = false
      }
    }

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
  }, [])

  const formattedCount = useMemo(() => {
    if (!Number.isFinite(count)) {
      return String(INITIAL_COUNT)
    }

    return new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language || 'fr').format(count)
  }, [count, i18n.language, i18n.resolvedLanguage])
  const ariaCount = Number.isFinite(count) ? count : INITIAL_COUNT
  const label = t('visitorCounterMessage')

  return (
    <div
      className="visitor-counter"
      style={{ display: 'flex' }}
      aria-live="polite"
      aria-label={`${label} ${ariaCount}`}
    >
      <span className="visitor-counter__label">{label}</span>
      <span className="visitor-counter__count" dir="ltr">{formattedCount}</span>
    </div>
  )
}

export default VisitorCounter
