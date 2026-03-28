import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '../api/client'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { useOpportunity } from '../hooks/useOpportunity'

function OpportunityDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: opportunity, isLoading, isError, error } = useOpportunity(id)

  if (isLoading) {
    return (
      <SectionContainer>
        <LoadingState />
      </SectionContainer>
    )
  }

  if (isError) {
    return (
      <SectionContainer>
        <ErrorState message={error?.message} />
      </SectionContainer>
    )
  }

  if (!opportunity) return null

  return (
    <div className="bg-[linear-gradient(180deg,_#fff_0%,_#fafafa_38%,_#f3f3f3_100%)]">
      <SectionContainer className="pt-8 sm:pt-10 lg:pt-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">

          {/* Header card */}
          <div className="relative overflow-hidden rounded-[32px] border border-primary-100 bg-white p-6 shadow-[0_20px_60px_rgba(20,20,20,0.07)] sm:p-8 lg:p-10">
            <div className="absolute -right-16 -top-12 h-40 w-40 rounded-full bg-secondary-100 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-primary-100 blur-3xl" />

            <div className="relative z-10">
              <Link
                to="/opportunities"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-500 transition-all duration-300 hover:bg-primary-100 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                ← {t('backToOpportunities')}
              </Link>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {opportunity.type?.name && (
                  <span className="inline-flex rounded-full bg-secondary-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                    {opportunity.type.name}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-primary-500 sm:text-4xl lg:text-5xl">
                {opportunity.titre || `${opportunity.first_name || ''} ${opportunity.last_name || ''}`.trim() || '-'}
              </h1>

              {/* Info tiles */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {opportunity.ville && (
                  <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">{t('cardVille')}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-primary-500">{opportunity.ville}</p>
                  </div>
                )}
                <div className="rounded-2xl border border-primary-100 bg-white px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">{t('cardType')}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-primary-500">{opportunity.type?.name || '-'}</p>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-white px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">{t('cardBudget')}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-primary-500">{opportunity.budget || '-'}</p>
                </div>
                <div className="rounded-2xl border border-secondary-100 bg-secondary-50 px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-400">{t('cardPhone')}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-secondary-600">{opportunity.phone || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">

            {/* Description */}
            <section className="rounded-[28px] border border-primary-100 bg-white p-6 shadow-[0_14px_34px_rgba(20,20,20,0.05)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('formDescription')}</p>
              <h2 className="mt-2 text-xl font-bold text-primary-500">{t('descriptionHeading')}</h2>
              <div className="mt-5 rounded-2xl bg-primary-50 p-5 sm:p-6">
                <p className="whitespace-pre-line text-base leading-8 text-primary-400">
                  {opportunity.description || '-'}
                </p>
              </div>
            </section>

            {/* Side info */}
            <div className="space-y-5">
              {/* Image */}
              <section className="overflow-hidden rounded-[28px] border border-primary-100 bg-white shadow-[0_14px_34px_rgba(20,20,20,0.05)]">
                {opportunity.image ? (
                  <img
                    src={getImageUrl(opportunity.image)}
                    alt={opportunity.titre || 'Opportunity'}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-primary-50">
                    <span className="text-4xl font-black text-secondary-500 opacity-20">NSA</span>
                  </div>
                )}
              </section>

              {/* Contact */}
              <section className="rounded-[28px] border border-primary-100 bg-white p-6 shadow-[0_14px_34px_rgba(20,20,20,0.05)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('contactTitle')}</p>
                <ul className="mt-4 space-y-3 text-sm text-primary-400">
                  <li>
                    <strong className="text-secondary-600">{t('formFirstName')}:</strong>{' '}
                    {opportunity.first_name} {opportunity.last_name}
                  </li>
                  <li>
                    <strong className="text-secondary-600">{t('cardEmail')}:</strong>{' '}
                    <a
                      href={`mailto:${opportunity.email}`}
                      className="text-secondary-500 underline hover:text-secondary-600"
                    >
                      {opportunity.email}
                    </a>
                  </li>
                  <li>
                    <strong className="text-secondary-600">{t('cardPhone')}:</strong> {opportunity.phone}
                  </li>
                </ul>
              </section>
            </div>
          </div>

        </div>
      </SectionContainer>
    </div>
  )
}

export default OpportunityDetailPage
