import { useTranslation } from 'react-i18next'

function ErrorState({ message, error }) {
  const { t } = useTranslation()

  // Extract the most useful message from the raw axios error if available
  const serverMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === 'string' ? error.response.data.slice(0, 300) : null)

  const displayMessage = serverMessage || message || t('errorTitle')

  const status = error?.response?.status

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700" role="alert">
      <strong className="block text-sm font-semibold">
        {t('errorTitle')}{status ? ` — HTTP ${status}` : ''}
      </strong>
      <p className="mt-1 text-sm">{displayMessage}</p>
      {/* Detailed debug block — remove before final production deploy */}
      {import.meta.env.DEV && error?.response?.data && (
        <pre className="mt-2 overflow-auto rounded bg-rose-100 p-2 text-[11px] text-rose-900">
          {JSON.stringify(error.response.data, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default ErrorState
