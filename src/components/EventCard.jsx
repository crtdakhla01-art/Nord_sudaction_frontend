import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '../api/client'
import { formatDateLabel } from '../utils/date'
import { getFeaturedGalleryMedia } from '../utils/eventGallery'

function EventCard({ event }) {
  const { t, i18n } = useTranslation()
  const featuredMedia = getFeaturedGalleryMedia(event)

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
        {/* Thumbnail */}
        <div className="flex h-32 w-full flex-shrink-0 items-center justify-center overflow-hidden bg-primary-50">
          {featuredMedia.type === 'image' ? (
            <img
              src={getImageUrl(featuredMedia.path)}
              alt={event.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : null}

          {featuredMedia.type === 'video' ? (
            <div className="relative h-full w-full bg-black">
              <video
                src={getImageUrl(featuredMedia.path)}
                className="h-full w-full object-cover"
                preload="metadata"
                muted
                playsInline
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                Video
              </span>
            </div>
          ) : null}

          {!featuredMedia.type ? (
            <span className="text-4xl font-black text-secondary-500 opacity-20">NSA</span>
          ) : null}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col justify-between gap-2 p-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold leading-tight text-primary-500">{event.title}</h3>
              <span
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  event.is_it_passed
                    ? 'bg-primary-100 text-primary-500'
                    : 'bg-red-50 text-secondary-500'
                }`}
              >
                {event.is_it_passed ? t('passed') : t('upcoming')}
              </span>
            </div>
            <ul className="space-y-0.5 text-xs text-primary-400">
              <li>
                <strong className="text-secondary-600">{t('cardDate')}:</strong>{' '}
                {formatDateLabel(event.date, i18n.language)}
              </li>
              {event.location && (
                <li>
                  <strong className="text-secondary-600">{t('cardLocation')}:</strong>{' '}
                  {event.location}
                </li>
              )}
            </ul>
          </div>

          {/* CTA */}
          <button
            type="button"
            className="mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-secondary-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-500 hover:shadow-lg hover:shadow-secondary-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
          >
            {t('seeDetails')}
          </button>
        </div>
      </Link>
  )
}

export default EventCard
