import { useTranslation } from 'react-i18next'

function ErrorState({ message }) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700" role="alert">
      <strong className="block text-sm font-semibold">{t('errorTitle')}</strong>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  )
}

export default ErrorState
