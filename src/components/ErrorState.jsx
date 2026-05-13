import { useTranslation } from 'react-i18next'
import { getFriendlyServerError } from '../utils/friendlyError'

function ErrorState({ message, error, showDebug = false }) {
  const { t } = useTranslation()
  const displayMessage = getFriendlyServerError(error, {
    message,
    t,
    fallback: t('formSubmitError'),
  })

  // Only show debug in dev mode AND when explicitly enabled or debug param is set
  const shouldShowDebug = import.meta.env.DEV && error?.response?.data && (showDebug || new URLSearchParams(window.location.search).get('debug_errors') === '1')

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700" role="alert">
      <p className="text-sm font-semibold">{displayMessage}</p>
      {/* Detailed debug block — only shown in dev with explicit flag */}
      {shouldShowDebug && (
        <details className="mt-3 text-[11px]">
          <summary className="cursor-pointer font-mono text-rose-600 hover:text-rose-700">Developer details</summary>
          <pre className="mt-2 overflow-auto rounded bg-rose-100 p-2 text-rose-900">
            {JSON.stringify(error.response.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}

export default ErrorState
