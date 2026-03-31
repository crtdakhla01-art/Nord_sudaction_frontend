import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import { getImageUrl } from '../../api/client'
import { useAdminOpportunity } from '../../hooks/useAdminOpportunity'
import { getOpportunityImages } from '../../utils/opportunityImages'

function AdminOpportunityDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const { data: opportunity, isLoading, isError, error } = useAdminOpportunity(id)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, closeLightbox])

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState message={error?.message} />
  }

  if (!opportunity) {
    return null
  }

  const opportunityImages = getOpportunityImages(opportunity)

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

          <article className="overflow-hidden rounded-2xl border border-primary-100 bg-white p-4 shadow-md">
            {opportunityImages.length > 0 ? (
              <div className="space-y-3">
                <img
                  src={getImageUrl(opportunityImages[0])}
                  alt={opportunity.titre || 'Opportunity'}
                  className="h-56 w-full cursor-pointer rounded-xl object-cover transition-opacity hover:opacity-90"
                  onClick={() => setLightboxIndex(0)}
                />

                {opportunityImages.length > 1 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {opportunityImages.slice(1).map((imagePath, index) => (
                      <img
                        key={`${imagePath}-${index}`}
                        src={getImageUrl(imagePath)}
                        alt={`${opportunity.titre || 'Opportunity'} ${index + 2}`}
                        className="h-20 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-90"
                        onClick={() => setLightboxIndex(index + 1)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-56 w-full items-center justify-center rounded-xl bg-primary-50">
                <span className="text-4xl font-black text-secondary-500 opacity-20">NSA</span>
              </div>
            )}
          </article>

          {/* Lightbox */}
          {lightboxIndex !== null && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={closeLightbox}
            >
              <button
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                onClick={closeLightbox}
              >
                ✕
              </button>

              {opportunityImages.length > 1 && (
                <button
                  className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + opportunityImages.length) % opportunityImages.length) }}
                >
                  ‹
                </button>
              )}

              <img
                src={getImageUrl(opportunityImages[lightboxIndex])}
                alt={opportunity.titre || 'Opportunity'}
                className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {opportunityImages.length > 1 && (
                <button
                  className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % opportunityImages.length) }}
                >
                  ›
                </button>
              )}

              <div className="absolute bottom-4 text-sm text-white/70">
                {lightboxIndex + 1} / {opportunityImages.length}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default AdminOpportunityDetailPage
