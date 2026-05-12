import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '../api/client'
import { formatDateLabel } from '../utils/date'

function EventDetailModal({ event, onClose }) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)

  const gallery = event?.gallery || []

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const activeItem = gallery[activeIndex] ?? null

  const goNext = () => setActiveIndex((i) => (i < gallery.length - 1 ? i + 1 : 0))
  const goPrev = () => setActiveIndex((i) => (i > 0 ? i - 1 : gallery.length - 1))

  const links = gallery.filter((item) => item?.link)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-primary-50 shadow-2xl">
        {/* ??? Close button ??????????????????????????????? */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          aria-label={t('close')}
        >
          ?
        </button>

        {/* ??? Gallery viewer ????????????????????????????? */}
        <div className="relative flex h-72 w-full flex-shrink-0 items-center justify-center overflow-hidden bg-secondary-50 p-3 sm:h-80 sm:p-0">
          {activeItem?.image ? (
            <img
              src={getImageUrl(activeItem.image)}
              alt={`${event.title} ${activeIndex + 1}`}
              className="h-full w-full object-contain sm:object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : activeItem?.video ? (
            <video
              key={activeItem.video}
              src={getImageUrl(activeItem.video)}
              className="h-full w-full object-contain sm:object-cover"
              controls
              preload="metadata"
            />
          ) : (
            <span className="text-6xl font-black text-secondary-500 opacity-20">NSA</span>
          )}

          {/* Arrow buttons */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white transition hover:bg-black/60"
                aria-label="Previous"
              >
                ?
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white transition hover:bg-black/60"
                aria-label="Next"
              >
                ?
              </button>
            </>
          )}

          {/* Dot indicators */}
          {gallery.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? 'w-7 bg-white' : 'w-2 bg-white/50'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ??? Content section ???????????????????????????? */}
        <div className="flex flex-col gap-4 p-5">
          {/* Title & Date */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-primary-900">{event.title}</h2>
            <p className="text-sm text-secondary-600">{formatDateLabel(event.date_event)}</p>
          </div>

          {/* Description (if available) */}
          {event.description && (
            <p className="line-clamp-3 text-base text-secondary-700">{event.description}</p>
          )}

          {/* Link buttons */}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  {item.link_label || 'View More'}
                  <span>?</span>
                </a>
              ))}
            </div>
          )}

          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-lg bg-secondary-200 py-2 font-semibold text-secondary-900 transition hover:bg-secondary-300 sm:hidden"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal
