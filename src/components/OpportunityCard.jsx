import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '../api/client'
import { getPrimaryOpportunityImage } from '../utils/opportunityImages'

const OpportunityCard = memo(function OpportunityCard({ opportunity }) {
  const { t } = useTranslation()
  const primaryImage = getPrimaryOpportunityImage(opportunity)

  return (
    <Link
      to={`/opportunities/${opportunity.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="w-full flex-shrink-0 overflow-hidden">
        {primaryImage ? (
          <img
            className="w-full transition duration-500 group-hover:scale-105 md:h-40 md:object-cover"
            src={getImageUrl(primaryImage)}
            alt={opportunity.titre || `${opportunity.first_name || ''} ${opportunity.last_name || ''}`.trim() || 'Opportunity'}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl font-black text-secondary-500 opacity-20">NSA</span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold leading-tight text-primary-500">
            {opportunity.titre || '-'}
          </h3>
          {opportunity.ville && (
            <p className="flex items-center gap-1 text-xs text-primary-400">
              <span className="text-secondary-500">📍</span>
              {opportunity.ville}
            </p>
          )}
        </div>

        <button
          type="button"
          className="mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-secondary-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-500 hover:shadow-lg hover:shadow-secondary-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
        >
          {t('seeDetails')}
        </button>
      </div>
    </Link>
  )
})

export default OpportunityCard
