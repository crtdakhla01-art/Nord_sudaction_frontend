import { useTranslation } from 'react-i18next'

function LoadingState() {
  const { t } = useTranslation()
  return (
    <p className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-500">
      {t('loading')}
    </p>
  )
}

export default LoadingState
