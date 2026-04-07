import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { getImageUrl } from '../api/client'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { useEvent } from '../hooks/useEvent'
import { formatDateLabel } from '../utils/date'
import { normalizeGalleryLink } from '../utils/eventGallery'
import { fadeLeft, fadeUp, inViewViewport, staggerContainer } from '../utils/animations'

function MediaThumb({ item, isActive, onSelect }) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-primary-50 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2 ${
        isActive
          ? 'border-secondary-500 shadow-md shadow-secondary-500/15'
          : 'border-primary-100 hover:-translate-y-0.5 hover:border-secondary-200 hover:shadow-md'
      }`}
      aria-pressed={isActive}
    >
      <img src={getImageUrl(item.image)} alt="" className="h-full w-full object-contain sm:object-cover" loading="lazy" decoding="async" />

      <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">{t('imageLabel')}</span>
    </button>
  )
}

function MediaLightbox({ item, onClose, onPrev, onNext, hasMultiple }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (hasMultiple && event.key === 'ArrowLeft') {
        onPrev()
      }

      if (hasMultiple && event.key === 'ArrowRight') {
        onNext()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [hasMultiple, onClose, onNext, onPrev])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-white transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Close preview"
      >
        ×
      </button>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Previous media"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onNext}
            className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Next media"
          >
            ›
          </button>
        </>
      ) : null}

      <div className="flex max-h-[90vh] max-w-6xl items-center justify-center overflow-hidden rounded-[28px] bg-black shadow-2xl">
        {item?.image ? (
          <img src={getImageUrl(item.image)} alt="" className="max-h-[90vh] max-w-full object-contain" decoding="async" />
        ) : null}

        {item?.vedio ? (
          <video key={item.vedio} src={getImageUrl(item.vedio)} className="max-h-[90vh] max-w-full bg-black object-contain" controls autoPlay playsInline preload="metadata" />
        ) : null}
      </div>
    </div>
  )
}

function EventDetailPage() {
  const MotionDiv = motion.div
  const MotionSection = motion.section
  const MotionH1 = motion.h1

  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const { data: event, isLoading, isError, error } = useEvent(id)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [nowDate, setNowDate] = useState(() => new Date())
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const mediaY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-15, 15])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowDate(new Date())
    }, 60_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const targetDate = event?.date ? new Date(event.date) : null
  let countdown = null

  if (targetDate && !Number.isNaN(targetDate.getTime()) && !event?.is_it_passed && targetDate > nowDate) {
    const cursor = new Date(nowDate)
    let months = 0

    while (true) {
      const nextMonth = new Date(cursor)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      if (nextMonth <= targetDate) {
        months += 1
        cursor.setMonth(cursor.getMonth() + 1)
      } else {
        break
      }
    }

    const remainingMs = targetDate.getTime() - cursor.getTime()
    const totalHours = Math.floor(remainingMs / (1000 * 60 * 60))

    countdown = {
      months,
      days: Math.floor(totalHours / 24),
      hours: totalHours % 24,
    }
  }

  const formatTimerValue = (value) => String(value).padStart(2, '0')

  if (isLoading) {
    return (
      <SectionContainer>
        <LoadingState />
      </SectionContainer>
    )
  }

  if (isError || !event) {
    return (
      <SectionContainer>
        <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center gap-5 rounded-[28px] border border-secondary-100 bg-primary-50 px-6 py-12 text-center shadow-md">
          <ErrorState message={error?.message} />
          <Link
            to="/events"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-secondary-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-500 hover:shadow-lg hover:shadow-secondary-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
          >
            {t('backToEvents')}
          </Link>
        </div>
      </SectionContainer>
    )
  }

  const gallery = event.gallery || []
  const images = gallery.filter((item) => item?.image)
  const videos = gallery.filter((item) => item?.vedio)
  const links = gallery.filter((item) => item?.link)
  const activeImage = images[activeIndex] || null
  const hasPreviewableMedia = Boolean(activeImage?.image)

  const selectPrev = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  const selectNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  return (
    <div className="bg-[linear-gradient(180deg,_#fff_0%,_#fafafa_38%,_#f3f3f3_100%)]">
      <SectionContainer className="pt-8 sm:pt-10 lg:pt-12">
        <MotionDiv
          className="mx-auto flex w-full max-w-6xl flex-col gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          {countdown ? (
            <MotionSection className="relative overflow-hidden rounded-[24px] border border-primary-100 bg-[linear-gradient(180deg,_#ffffff_0%,_#fafafa_100%)] px-4 py-5 shadow-[0_12px_28px_rgba(20,20,20,0.06)] sm:px-6" variants={fadeUp}>
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary-100/70 blur-2xl" />
              <div className="relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-500">{t('eventStartsIn')}</p>

                <div className="mt-4 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-end gap-2 sm:gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-black leading-none text-primary-500 sm:text-6xl lg:text-7xl">{formatTimerValue(countdown.months)}</p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-300 sm:text-xs">{t('monthsLabel')}</p>
                  </div>

                  <p className="pb-6 text-3xl font-black leading-none text-primary-300 sm:pb-7 sm:text-5xl lg:text-6xl">:</p>

                  <div className="text-center">
                    <p className="text-4xl font-black leading-none text-primary-500 sm:text-6xl lg:text-7xl">{formatTimerValue(countdown.days)}</p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-300 sm:text-xs">{t('daysLabel')}</p>
                  </div>

                  <p className="pb-6 text-3xl font-black leading-none text-primary-300 sm:pb-7 sm:text-5xl lg:text-6xl">:</p>

                  <div className="text-center">
                    <p className="text-4xl font-black leading-none text-secondary-500 sm:text-6xl lg:text-7xl">{formatTimerValue(countdown.hours)}</p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-400 sm:text-xs">{t('hoursLabel')}</p>
                  </div>
                </div>
              </div>
            </MotionSection>
          ) : null}

          <MotionDiv className="relative overflow-hidden rounded-[32px] border border-secondary-100 bg-primary-50 p-6 shadow-[0_20px_60px_rgba(20,20,20,0.07)] sm:p-8 lg:p-10" variants={fadeUp}>
            <div className="absolute -right-16 -top-12 h-40 w-40 rounded-full bg-secondary-100 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-primary-100 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/events"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-500 transition-all duration-300 hover:bg-primary-100 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                >
                  ← {t('backToEvents')}
                </Link>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${event.is_it_passed ? 'bg-primary-100 text-primary-500' : 'bg-secondary-500 text-white'}`}>
                  {event.is_it_passed ? t('passed') : t('upcoming')}
                </span>
              </div>

              <MotionH1 className="mt-4 max-w-3xl text-2xl font-black tracking-tight text-primary-500 sm:text-3xl lg:text-4xl" variants={fadeLeft}>
                {event.title}
              </MotionH1>
            </div>
          </MotionDiv>

          <MotionDiv className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]" variants={fadeUp}>
            <div className="space-y-8">
              {event.description ? (
                <MotionSection className="rounded-[28px] border border-primary-100 bg-white p-6 shadow-[0_14px_34px_rgba(20,20,20,0.05)] sm:p-8" variants={fadeUp}>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('formDescription')}</p>
                  <h2 className="mt-2 text-xl font-bold text-primary-500">{t('descriptionHeading')}</h2>
                  <div className="mt-5 rounded-2xl bg-primary-50 p-5 sm:p-6">
                    <p className="whitespace-pre-line text-base leading-8 text-primary-400">{event.description}</p>
                  </div>
                </MotionSection>
              ) : null}

              <MotionSection className="rounded-[28px] border border-secondary-100 bg-primary-50 p-5 shadow-[0_14px_34px_rgba(20,20,20,0.05)] sm:p-6" variants={fadeUp} style={{ y: mediaY }}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('gallerySection')}</p>
                    <h2 className="mt-2 text-xl font-bold text-primary-500">{t('galleryPreview')}</h2>
                  </div>

                  {images.length > 1 ? (
                    <div className="hidden items-center gap-2 sm:flex">
                      <button
                        type="button"
                        onClick={selectPrev}
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary-100 bg-white text-lg text-primary-500 transition-all duration-300 hover:border-secondary-200 hover:bg-secondary-50 hover:text-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
                        aria-label="Previous media"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={selectNext}
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary-100 bg-white text-lg text-primary-500 transition-all duration-300 hover:border-secondary-200 hover:bg-secondary-50 hover:text-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
                        aria-label="Next media"
                      >
                        ›
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="overflow-hidden rounded-[24px] bg-primary-50">
                  <div className="relative flex min-h-[280px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(217,36,43,0.12),_transparent_55%)] p-3 sm:min-h-[380px] sm:p-0">
                    {activeImage?.image ? (
                      <img src={getImageUrl(activeImage.image)} alt={event.title} className="h-full w-full object-contain sm:object-cover" loading="lazy" decoding="async" />
                    ) : null}

                    {!activeImage?.image ? (
                      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary-400">{t('imageLabel')}</span>
                        <p className="max-w-md text-sm leading-7 text-primary-400">{t('galleryEmpty')}</p>
                      </div>
                    ) : null}

                    {hasPreviewableMedia ? (
                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center justify-center rounded-lg bg-black/65 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-black/80 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        {t('expand')}
                      </button>
                    ) : null}
                  </div>
                </div>

                {images.length > 0 ? (
                  <motion.div className="mt-5 flex flex-wrap gap-3" variants={staggerContainer}>
                    {images.map((item, index) => (
                      <motion.div key={`${item.image}-${index}`} variants={fadeUp}>
                        <MediaThumb item={item} isActive={index === activeIndex} onSelect={() => setActiveIndex(index)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}
              </MotionSection>

              <MotionSection className="rounded-[28px] border border-primary-100 bg-white p-6 shadow-[0_14px_34px_rgba(20,20,20,0.05)] sm:p-8" variants={fadeUp}>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('videosLabel')}</p>
                <h2 className="mt-2 text-xl font-bold text-primary-500">{t('videosLabel')}</h2>

                {videos.length > 0 ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {videos.map((item, index) => (
                      <article key={`${item.vedio}-${index}`} className="overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 shadow-sm">
                        <div className="relative aspect-video bg-black">
                          <video
                            src={getImageUrl(item.vedio)}
                            className="h-full w-full object-contain sm:object-cover"
                            controls
                            playsInline
                            preload="metadata"
                          />
                          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                            {t('videoLabel')} {index + 1}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-primary-200 bg-primary-50 px-4 py-6 text-sm leading-7 text-primary-400">
                    {t('galleryEmpty')}
                  </div>
                )}
              </MotionSection>
            </div>

            <div className="space-y-8">
              <MotionSection className="rounded-[28px] border border-primary-100 bg-white p-6 shadow-[0_14px_34px_rgba(20,20,20,0.05)]" variants={fadeUp}>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('quickInfo')}</p>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">{t('cardDate')}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-primary-500">{formatDateLabel(event.date, i18n.language)}</p>
                  </div>
                  <div className="rounded-2xl border border-primary-100 bg-white px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">{t('cardLocation')}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-primary-500">{event.location || '-'}</p>
                  </div>
                </div>
              </MotionSection>

              <MotionSection className="rounded-[28px] border border-primary-100 bg-white p-6 shadow-[0_14px_34px_rgba(20,20,20,0.05)]" variants={fadeUp}>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('mediaSection')}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">{t('imagesLabel')}</p>
                    <p className="mt-2 text-2xl font-black text-primary-500">{images.length}</p>
                  </div>
                  <div className="rounded-2xl border border-primary-100 bg-white px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">{t('videosLabel')}</p>
                    <p className="mt-2 text-2xl font-black text-primary-500">{videos.length}</p>
                  </div>
                  <div className="rounded-2xl border border-secondary-100 bg-secondary-50 px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-400">{t('linksSection')}</p>
                    <p className="mt-2 text-2xl font-black text-secondary-500">{links.length}</p>
                  </div>
                </div>
              </MotionSection>

              <MotionSection className="rounded-[28px] border border-primary-100 bg-white p-6 shadow-[0_14px_34px_rgba(20,20,20,0.05)]" variants={fadeUp}>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-500">{t('linksSection')}</p>
                <h2 className="mt-2 text-xl font-bold text-primary-500">{t('openLink')}</h2>

                {links.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {links.map((item, index) => (
                      <a
                        key={`${item.link}-${index}`}
                        href={normalizeGalleryLink(item.link)}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-secondary-100 bg-secondary-50 px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary-200 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-secondary-600">{t('openLink')} {links.length > 1 ? index + 1 : ''}</p>
                          <p className="mt-1 truncate text-sm text-primary-400">{normalizeGalleryLink(item.link)}</p>
                        </div>
                        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-secondary-500 shadow-sm transition-all duration-300 group-hover:bg-secondary-500 group-hover:text-white">
                          ↗
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-primary-200 bg-primary-50 px-4 py-6 text-sm leading-7 text-primary-400">
                    {t('galleryEmpty')}
                  </div>
                )}
              </MotionSection>
            </div>
          </MotionDiv>

          {/* Back to events button at bottom */}
          <MotionDiv className="flex justify-center" variants={fadeUp}>
            <Link
              to="/events"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-500 transition-all duration-300 hover:bg-primary-100 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            >
              ← {t('backToEvents')}
            </Link>
          </MotionDiv>
        </MotionDiv>
      </SectionContainer>

      {isLightboxOpen && activeImage && hasPreviewableMedia ? (
        <MediaLightbox item={activeImage} onClose={() => setIsLightboxOpen(false)} onPrev={selectPrev} onNext={selectNext} hasMultiple={images.length > 1} />
      ) : null}
    </div>
  )
}

export default EventDetailPage