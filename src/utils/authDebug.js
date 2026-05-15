const isEnabled = false

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
  return isEnabled && prefix && message && data
}

function warn(prefix, message, data) {
  return isEnabled && prefix && message && data
}

function error(prefix, message, data) {
  return isEnabled && prefix && message && data
}

export const authDebug = {
  enabled: isEnabled,
  maskEmail,
  maskToken,
  log,
  warn,
  error,
}
