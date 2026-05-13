const isDev = import.meta.env.DEV
const isEnabled = isDev || String(import.meta.env.VITE_AUTH_DEBUG || '').toLowerCase() === 'true'

function maskEmail(email) {
  if (typeof email !== 'string' || !email.includes('@')) {
    return '***'
  }

  const [local, domain] = email.split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

function maskToken(token) {
  if (typeof token !== 'string' || token.length < 10) {
    return '***'
  }

  return `${token.slice(0, 6)}...${token.slice(-4)}`
}

function log(prefix, message, data) {
  if (!isEnabled) {
    return
  }

  if (data === undefined) {
    console.info(`${prefix} ${message}`)
    return
  }

  console.info(`${prefix} ${message}`, data)
}

function warn(prefix, message, data) {
  if (!isEnabled) {
    return
  }

  if (data === undefined) {
    console.warn(`${prefix} ${message}`)
    return
  }

  console.warn(`${prefix} ${message}`, data)
}

function error(prefix, message, data) {
  if (!isEnabled) {
    return
  }

  if (data === undefined) {
    console.error(`${prefix} ${message}`)
    return
  }

  console.error(`${prefix} ${message}`, data)
}

export const authDebug = {
  enabled: isEnabled,
  maskEmail,
  maskToken,
  log,
  warn,
  error,
}
