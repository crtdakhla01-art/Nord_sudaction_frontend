import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import { getImageUrl } from '../../api/client'
import { useAdminOpportunity } from '../../hooks/useAdminOpportunity'

function AdminOpportunityDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: opportunity, isLoading, isError, error } = useAdminOpportunity(id)

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState message={error?.message} />
  }

  if (!opportunity) {
    return null
  }

  return (
    <section className="w-full space-y-6">
      <div className="w-full rounded-2xl border border-primary-100 bg-white p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-primary-500">{opportunity.titre || '-'}</h2>
            <p className="mt-1 text-sm text-primary-400">{opportunity.ville || '-'}</p>
          </div>

          <Link
            to="/admin/opportunities"
            className="rounded-lg border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
          >
            {t('backToOpportunities')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500">{t('descriptionHeading')}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-primary-400">{opportunity.description || '-'}</p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <p className="text-sm text-primary-400">
              <span className="font-semibold text-primary-500">{t('cardType')}:</span> {opportunity.type?.name || '-'}
            </p>
            <p className="text-sm text-primary-400">
              <span className="font-semibold text-primary-500">{t('cardBudget')}:</span> {opportunity.budget || '-'}
            </p>
            <p className="text-sm text-primary-400">
              <span className="font-semibold text-primary-500">{t('cardPhone')}:</span> {opportunity.phone || '-'}
            </p>
            <p className="text-sm text-primary-400">
              <span className="font-semibold text-primary-500">{t('cardEmail')}:</span> {opportunity.email || '-'}
            </p>
            <p className="text-sm text-primary-400">
              <span className="font-semibold text-primary-500">{t('formFirstName')}:</span> {opportunity.first_name || '-'}
            </p>
            <p className="text-sm text-primary-400">
              <span className="font-semibold text-primary-500">{t('formLastName')}:</span> {opportunity.last_name || '-'}
            </p>
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500">Status</p>
            <p className="mt-3">
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase text-primary-500">
                {opportunity.status}
              </span>
            </p>
          </article>

          <article className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-md">
            {opportunity.image ? (
              <img src={getImageUrl(opportunity.image)} alt={opportunity.titre || 'Opportunity'} className="h-56 w-full object-cover" />
            ) : (
              <div className="flex h-56 w-full items-center justify-center bg-primary-50">
                <span className="text-4xl font-black text-secondary-500 opacity-20">NSA</span>
              </div>
            )}
          </article>
        </aside>
      </div>
    </section>
  )
}

export default AdminOpportunityDetailPage
