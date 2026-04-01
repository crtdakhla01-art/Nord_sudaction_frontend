import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '../api/client'
import { formatDateLabel } from '../utils/date'

function EventDetailModal({ event, onClose }) {
  const { t, i18n } = useTranslation()
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
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ─── Close button ─────────────────────────────── */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          aria-label={t('close')}
        >
          ✕
        </button>

        {/* ─── Gallery viewer ───────────────────────────── */}
        <div className="relative flex h-64 w-full flex-shrink-0 items-center justify-center overflow-hidden bg-primary-50 sm:h-80">
          {activeItem?.image ? (
            <img
              src={getImageUrl(activeItem.image)}
              alt={`${event.title} ${activeIndex + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : activeItem?.vedio ? (
            <video
              key={activeItem.vedio}
              src={getImageUrl(activeItem.vedio)}
              className="h-full w-full object-cover"
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
                ‹
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white transition hover:bg-black/60"
                aria-label="Next"
              >
                ›
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
                    i === activeIndex ? 'w-5 bg-secondary-500' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── Thumbnail strip ──────────────────────────── */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto bg-primary-50 px-4 py-3">
            {gallery.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  activeIndex === index
                    ? 'border-secondary-500'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                {item?.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : item?.vedio ? (
                  <video
                    src={getImageUrl(item.vedio)}
                    className="h-full w-full object-cover"
                    preload="metadata"
                    muted
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-100 text-sm">
                    🔗
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ─── Scrollable content ───────────────────────── */}
        <div className="max-h-[55vh] overflow-y-auto p-6 sm:p-8">
          <div className="space-y-5">
            {/* Title + status badge */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold leading-tight text-primary-500 sm:text-3xl">
                {event.title}
              </h2>
              <span
                className={`mt-1 flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  event.is_it_passed
                    ? 'bg-primary-100 text-primary-500'
                    : 'bg-red-50 text-secondary-500'
                }`}
              >
                {event.is_it_passed ? t('passed') : t('upcoming')}
              </span>
            </div>

            {/* Date + Location */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-secondary-500">📅</span>
                <span>
                  <strong className="text-primary-500">{t('cardDate')}:</strong>{' '}
                  <span className="text-primary-400">
                    {formatDateLabel(event.date, i18n.language)}
                  </span>
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <span className="text-secondary-500">📍</span>
                  <span>
                    <strong className="text-primary-500">{t('cardLocation')}:</strong>{' '}
                    <span className="text-primary-400">{event.location}</span>
                  </span>
                </div>
              )}
            </div>

            <hr className="border-primary-100" />

            {/* Description */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary-500">
                {t('formDescription')}
              </h3>
              <p className="whitespace-pre-line leading-relaxed text-primary-400">
                {event.description}
              </p>
            </div>

            {/* Links */}
            {links.length > 0 && (
              <>
                <hr className="border-primary-100" />
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-secondary-500">
                    {t('linksSection')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {links.map((item, index) => (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#ce2c36]"
                      >
                        🔗 {t('openLink')}
                        {links.length > 1 ? ` ${index + 1}` : ''}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Close */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="rounded-full bg-primary-500 px-7 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal
