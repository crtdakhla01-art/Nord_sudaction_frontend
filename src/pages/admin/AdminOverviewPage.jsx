import { useTranslation } from 'react-i18next'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import { useAdminDashboardStatus } from '../../hooks/useAdminDashboardStatus'

function StatLine({ label, value }) {
  return (
    <p className="text-sm text-primary-400">
      <span className="font-semibold text-primary-500">{label}:</span> {value}
    </p>
  )
}

function AdminOverviewPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError, error } = useAdminDashboardStatus()

  const stats = data?.data

  return (
    <section className="w-full max-w-full space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
        <h2 className="text-2xl font-black text-primary-500">{t('adminOverviewWelcome')}</h2>
        <p className="mt-2 text-sm text-primary-400">{t('adminOverviewSubtitle')}</p>
        {stats?.generated_at ? (
          <p className="mt-3 text-xs text-primary-300">
            Updated: {new Date(stats.generated_at).toLocaleString()}
          </p>
        ) : null}
      </div>

      {isLoading ? <LoadingState /> : null}
      {isError ? <ErrorState message={error?.response?.data?.message || error?.message} /> : null}

      {!isLoading && !isError ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">Users</h3>
            <p className="mt-3 text-2xl font-black text-primary-500">{stats?.users?.total ?? 0}</p>
            <div className="mt-3 space-y-1">
              <StatLine label="Admins" value={stats?.users?.admins ?? 0} />
              <StatLine label="Managers" value={stats?.users?.managers ?? 0} />
            </div>
          </article>

          <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{t('navOpportunities')}</h3>
            <p className="mt-3 text-2xl font-black text-primary-500">{stats?.opportunities?.total ?? 0}</p>
            <div className="mt-3 space-y-1">
              <StatLine label={t('pending')} value={stats?.opportunities?.pending ?? 0} />
              <StatLine label={t('accepted')} value={stats?.opportunities?.accepted ?? 0} />
              <StatLine label={t('rejected')} value={stats?.opportunities?.rejected ?? 0} />
            </div>
          </article>

          <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{t('navEvents')}</h3>
            <p className="mt-3 text-2xl font-black text-primary-500">{stats?.events?.total ?? 0}</p>
            <div className="mt-3 space-y-1">
              <StatLine label={t('upcoming')} value={stats?.events?.upcoming ?? 0} />
              <StatLine label={t('passed')} value={stats?.events?.passed ?? 0} />
            </div>
          </article>

          <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">Actualites</h3>
            <p className="mt-3 text-2xl font-black text-primary-500">{stats?.posts?.total ?? 0}</p>
            <div className="mt-3 space-y-1">
              <StatLine label="Published" value={stats?.posts?.published ?? 0} />
              <StatLine label="Draft" value={stats?.posts?.draft ?? 0} />
              <StatLine label="Featured" value={stats?.posts?.featured ?? 0} />
              <StatLine label="Views" value={stats?.posts?.total_views ?? 0} />
            </div>
          </article>

          <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{t('navAdvertisements')}</h3>
            <p className="mt-3 text-2xl font-black text-primary-500">{stats?.advertisements?.total ?? 0}</p>
            <div className="mt-3 space-y-1">
              <StatLine label="Active" value={stats?.advertisements?.active ?? 0} />
              <StatLine label="Scheduled" value={stats?.advertisements?.scheduled ?? 0} />
              <StatLine label="Expired" value={stats?.advertisements?.expired ?? 0} />
            </div>
          </article>

          <article className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{t('navContact')}</h3>
            <p className="mt-3 text-2xl font-black text-primary-500">{stats?.contacts?.total ?? 0}</p>
            <div className="mt-3 space-y-1">
              <StatLine label="Last 7 days" value={stats?.contacts?.last_7_days ?? 0} />
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}

export default AdminOverviewPage
