import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import { useAcceptOpportunity } from '../../hooks/useAcceptOpportunity'
import { useAdminOpportunities } from '../../hooks/useAdminOpportunities'
import { useRejectOpportunity } from '../../hooks/useRejectOpportunity'

function AdminOpportunitiesPage() {
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState('all')
  const { data, isLoading, isError, error } = useAdminOpportunities()
  const acceptMutation = useAcceptOpportunity()
  const rejectMutation = useRejectOpportunity()

  const opportunities = useMemo(() => {
    const all = data || []
    if (statusFilter === 'all') {
      return all
    }

    return all.filter((item) => item.status === statusFilter)
  }, [data, statusFilter])

  const statuses = ['all', 'pending', 'accepted', 'rejected']

  return (
    <section className="w-full space-y-6">
      <div className="w-full rounded-2xl border border-primary-100 bg-white p-8 shadow-md">
        <h2 className="text-2xl font-black text-primary-500">{t('opportunitiesManagement')}</h2>
        <p className="mt-1 text-sm text-primary-400">{t('reviewUpdateOpportunities')}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase transition ${
                statusFilter === status
                  ? 'bg-secondary-500 text-white'
                  : 'border border-primary-200 bg-white text-primary-500 hover:border-secondary-300 hover:text-secondary-500'
              }`}
            >
              {t(status)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <LoadingState /> : null}
      {isError ? <ErrorState message={error?.message} /> : null}

      {!isLoading && !isError ? (
        <div className="grid grid-cols-3 gap-6">
          {opportunities.length === 0 ? (
            <p className="col-span-3 rounded-2xl border border-primary-100 bg-white px-4 py-5 text-sm text-primary-400 shadow-md">
              {t('noOpportunitiesFound')}
            </p>
          ) : null}

          {opportunities.map((item) => (
            <article key={item.id} className="flex min-h-[250px] flex-col justify-between rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
              <div>
                <h3 className="text-lg font-bold text-primary-500">
                  {item.titre || '-'}
                </h3>
                <p className="mt-1 text-sm text-primary-400">
                  <span className="font-semibold text-primary-500">{t('cardVille')}:</span> {item.ville || '-'}
                </p>
                <p className="mt-2 text-sm text-primary-400">
                  <span className="font-semibold text-primary-500">{t('cardType')}:</span> {item.type?.name || '-'}
                </p>
                <p className="mt-1 text-sm text-primary-400">
                  <span className="font-semibold text-primary-500">{t('cardBudget')}:</span> {item.budget}
                </p>
                <p className="mt-3">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase text-primary-500">
                    {item.status}
                  </span>
                </p>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <Link
                  to={`/admin/opportunities/${item.id}`}
                  className="rounded-lg border border-primary-200 bg-white px-4 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
                >
                  {t('seeDetails')}
                </Link>
                <button
                  type="button"
                  onClick={() => acceptMutation.mutate(item.id)}
                  className="rounded-lg bg-accent-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-600"
                  disabled={acceptMutation.isPending}
                >
                  {t('accept')}
                </button>
                <button
                  type="button"
                  onClick={() => rejectMutation.mutate(item.id)}
                  className="rounded-lg bg-secondary-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-secondary-600"
                  disabled={rejectMutation.isPending}
                >
                  {t('reject')}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default AdminOpportunitiesPage
