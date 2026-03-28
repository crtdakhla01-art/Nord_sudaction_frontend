import { useTranslation } from 'react-i18next'

function AdminOverviewPage() {
  const { t } = useTranslation()

  return (
    <section className="w-full max-w-full space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
        <h2 className="text-2xl font-black text-primary-500">{t('adminOverviewWelcome')}</h2>
        <p className="mt-2 text-sm text-primary-400">
          {t('adminOverviewSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{t('workspace')}</h3>
          <p className="mt-3 text-xl font-bold text-primary-500">{t('stableDesktopLayout')}</p>
        </article>
        <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{t('navigation')}</h3>
          <p className="mt-3 text-xl font-bold text-primary-500">{t('stickySidebarHeader')}</p>
        </article>
        <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{t('content')}</h3>
          <p className="mt-3 text-xl font-bold text-primary-500">{t('fluidCardsTables')}</p>
        </article>
      </div>
    </section>
  )
}

export default AdminOverviewPage
