const canUseBrowser = () => typeof window !== 'undefined'

const canTrackMeta = () => canUseBrowser() && typeof window.fbq === 'function'

const safeSessionStorageGet = (key) => {
  if (!canUseBrowser()) {
    return null
  }

  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

const safeSessionStorageSet = (key, value) => {
  if (!canUseBrowser()) {
    return
  }

  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Ignore storage failures to avoid breaking UX in restricted browsers.
  }
}

const onceKey = (key) => `meta_once:${key}`

export const trackMetaEvent = (eventName, params = {}) => {
  if (!canTrackMeta()) {
    return false
  }

  window.fbq('track', eventName, params)
  return true
}

export const trackMetaCustomEvent = (eventName, params = {}) => {
  if (!canTrackMeta()) {
    return false
  }

  window.fbq('trackCustom', eventName, params)
  return true
}

export const trackMetaPageView = () => trackMetaEvent('PageView')

export const trackMetaEventOnce = (key, eventName, params = {}) => {
  const storageKey = onceKey(key)

  if (safeSessionStorageGet(storageKey)) {
    return false
  }

  const tracked = trackMetaEvent(eventName, params)

  if (tracked) {
    safeSessionStorageSet(storageKey, '1')
  }

  return tracked
}

export const trackMetaCustomEventOnce = (key, eventName, params = {}) => {
  const storageKey = onceKey(key)

  if (safeSessionStorageGet(storageKey)) {
    return false
  }

  const tracked = trackMetaCustomEvent(eventName, params)

  if (tracked) {
    safeSessionStorageSet(storageKey, '1')
  }

  return tracked
}
