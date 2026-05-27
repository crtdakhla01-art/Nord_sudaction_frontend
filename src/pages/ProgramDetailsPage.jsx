import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionContainer from '../components/SectionContainer'
import programmePdf from '../assets/programme.pdf'

function parseAgendaItem(item) {
  const match = item.match(/^(\d{2}H\d{2})\s*[:-]\s*(.+)$/)
  if (!match) {
    return { time: null, text: item }
  }

  return { time: match[1], text: match[2] }
}

const MotionHeader = motion.header
const MotionSection = motion.section
const MotionDiv = motion.div
const MotionLi = motion.li
const MotionSpan = motion.span

function ProgramDetailsPage() {
  const { t } = useTranslation()

  const positioningItems = t('programDetails.positioningItems', { returnObjects: true })
  const strategicVisionItems = t('programDetails.strategicVisionItems', { returnObjects: true })
  const experientialPositioningItems = t('programDetails.experientialPositioningItems', { returnObjects: true })
  const eventGoals = t('programDetails.eventGoals', { returnObjects: true })
  const targetSectors = t('programDetails.targetSectors', { returnObjects: true })
  const rseImpactItems = t('programDetails.rseImpactItems', { returnObjects: true })
  const timelineDays = t('programDetails.timelineDays', { returnObjects: true })

  const safeTimelineDays = useMemo(
    () => (Array.isArray(timelineDays) ? timelineDays : []),
    [timelineDays],
  )
  const [activeDayId, setActiveDayId] = useState(safeTimelineDays[0]?.id || 'friday')

  const activeDay = useMemo(
    () => safeTimelineDays.find((day) => day.id === activeDayId) ?? safeTimelineDays[0],
    [activeDayId, safeTimelineDays],
  )

  const handleDownloadProgram = async () => {
    try {
      const response = await fetch(programmePdf, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      })

      if (!response.ok) {
        throw new Error('Program file unavailable')
      }

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.toLowerCase().includes('application/pdf')) {
        throw new Error('Invalid program file type')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = 'programme.pdf'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch {
      window.alert(t('officialProgramDownloadMissing'))
    }
  }

  return (
    <SectionContainer className="bg-primary-50 text-primary-500">
      <div className="relative mx-auto max-w-6xl space-y-7">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-secondary-200/30 blur-3xl" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-primary-300/25 blur-3xl" />
        </div>

        <MotionHeader
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl border border-secondary-200 bg-gradient-to-br from-primary-100 via-white to-secondary-50 p-7 shadow-[0_20px_60px_rgba(20,20,20,0.14)] md:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-600">{t('programDetails.eyebrow')}</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[0.05em] text-primary-700 md:text-4xl">{t('programDetails.title')}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-primary-500 md:text-lg">
            {t('programDetails.subtitle')}
          </p>
        </MotionHeader>

        <MotionSection
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="grid gap-4 lg:grid-cols-2"
        >
          <article className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-primary-600">{t('programDetails.positioningTitle')}</h2>
            <p className="mt-3 text-sm leading-7 text-primary-500">
              {t('programDetails.positioningIntro')}
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-primary-500 sm:grid-cols-2">
              {(Array.isArray(positioningItems) ? positioningItems : []).map((item) => (
                <MotionLi key={item} whileHover={{ scale: 1.015 }} className="rounded-lg border border-primary-100 bg-primary-50/70 px-3 py-2">
                  {item}
                </MotionLi>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-primary-600">{t('programDetails.strategicVisionTitle')}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-primary-500">
              {(Array.isArray(strategicVisionItems) ? strategicVisionItems : []).map((item) => (
                <MotionLi key={item} whileHover={{ scale: 1.015 }} className="rounded-lg border border-primary-100 bg-primary-50/70 px-3 py-2">
                  {item}
                </MotionLi>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-primary-600">{t('programDetails.experientialPositioningTitle')}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-primary-500">
              {(Array.isArray(experientialPositioningItems) ? experientialPositioningItems : []).map((item) => (
                <MotionLi key={item} whileHover={{ scale: 1.015 }} className="rounded-lg border border-primary-100 bg-primary-50/70 px-3 py-2">
                  {item}
                </MotionLi>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-primary-600">{t('programDetails.eventGoalsTitle')}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-primary-500">
              {(Array.isArray(eventGoals) ? eventGoals : []).map((item) => (
                <MotionLi key={item} whileHover={{ scale: 1.015 }} className="rounded-lg border border-primary-100 bg-primary-50/70 px-3 py-2">
                  {item}
                </MotionLi>
              ))}
            </ul>
          </article>
        </MotionSection>

        <MotionSection
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="grid gap-4 lg:grid-cols-2"
        >
          <article className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-primary-600">{t('programDetails.targetSectorsTitle')}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-primary-500">
              {(Array.isArray(targetSectors) ? targetSectors : []).map((item) => (
                <MotionLi
                  key={item}
                  whileHover={{ scale: 1.015, boxShadow: '0 0 0 1px rgba(239, 27, 43, 0.28)' }}
                  className="rounded-lg border border-primary-100 bg-primary-50/70 px-3 py-2"
                >
                  {item}
                </MotionLi>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-primary-600">{t('programDetails.rseImpactTitle')}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-primary-500">
              {(Array.isArray(rseImpactItems) ? rseImpactItems : []).map((item) => (
                <MotionLi key={item} whileHover={{ scale: 1.015 }} className="rounded-lg border border-primary-100 bg-primary-50/70 px-3 py-2">
                  {item}
                </MotionLi>
              ))}
            </ul>
          </article>
        </MotionSection>

        <MotionSection
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-3xl border border-secondary-100 bg-gradient-to-br from-primary-50 to-white p-5 shadow-[0_15px_40px_rgba(60,60,60,0.16)] md:p-7"
        >
          <h2 className="text-xl font-semibold text-primary-700 md:text-2xl">{t('programDetails.officialProgramTitle')}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {safeTimelineDays.map((day) => {
              const isActive = day.id === activeDay.id

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveDayId(day.id)}
                  className="relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition"
                >
                  {isActive ? (
                    <MotionSpan
                      layoutId="activeProgramDay"
                      className="absolute inset-0 rounded-xl border border-secondary-200 bg-secondary-50"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    />
                  ) : null}
                  <span className={`relative ${isActive ? 'text-secondary-700' : 'text-primary-500'}`}>{day.label}</span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeDay.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-base font-semibold text-primary-700 md:text-lg">{activeDay?.label} - {activeDay?.title}</h3>

              <div className="relative pl-4 md:pl-6">
                <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-secondary-200" />

                <div className="space-y-3">
                  {(Array.isArray(activeDay?.items) ? activeDay.items : []).map((rawItem) => {
                    const entry = parseAgendaItem(rawItem)
                    const isFeatured = activeDay?.id === 'sunday' && rawItem === activeDay?.items?.[7]

                    return (
                      <MotionDiv
                        key={`${activeDay.id}-${rawItem}`}
                        whileHover={{ scale: 1.015 }}
                        className={`rounded-xl border px-4 py-3 ${isFeatured
                          ? 'border-secondary-200 bg-gradient-to-r from-secondary-50 to-primary-50'
                          : 'border-primary-100 bg-white'
                        }`}
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                          {entry.time ? (
                            <span className="inline-flex w-fit rounded-full border border-secondary-200 bg-secondary-50 px-2.5 py-1 text-xs font-semibold text-secondary-700">
                              {entry.time}
                            </span>
                          ) : null}
                          <p className="text-sm leading-7 text-primary-600">{entry.text}</p>
                        </div>
                        {isFeatured ? <p className="mt-2 text-xs uppercase tracking-[0.12em] text-secondary-700">{t('programDetails.featuredMoment')}</p> : null}
                      </MotionDiv>
                    )
                  })}
                </div>
              </div>
            </MotionDiv>
          </AnimatePresence>
        </MotionSection>

        <MotionDiv
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-3"
        >
          <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <button
              type="button"
              onClick={handleDownloadProgram}
              className="inline-flex items-center rounded-xl border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 transition hover:border-primary-300 hover:bg-primary-50"
            >
              {t('programDetails.backButton')}
            </button>
          </MotionDiv>

          <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/inscription"
              className="inline-flex items-center rounded-xl bg-secondary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-600"
            >
              {t('programDetails.inscriptionButton')}
            </Link>
          </MotionDiv>
        </MotionDiv>
      </div>
    </SectionContainer>
  )
}

export default ProgramDetailsPage

