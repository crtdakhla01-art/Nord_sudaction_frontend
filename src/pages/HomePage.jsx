import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useActivities } from '../hooks/useActivities'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import heroImage from '../assets/hero.png'
import Button from '../components/Button'
import SectionContainer from '../components/SectionContainer'
import VideoPlayer from '../components/VideoPlayer'
import AdvertisementsTable from '../components/AdvertisementsTable'
import { fadeLeft, fadeUp, inViewViewport, scaleHover, staggerContainer } from '../utils/animations'

const partners = [
  '/partner_1.jpg',
  '/partner_2.jpg',
  '/partner_3.jpg',
  '/partner_4.jpeg',
  '/partner_5.jpeg',
  '/partner_6.jpeg',
  '/partner_7.jpeg',
  '/partner_8.jpeg',
  '/partner_9.jpeg',
  '/partner_10.jpeg',
  '/partner_12.jpeg',
  '/partner_13.jpeg',
  '/partner_14.jpg',
  '/partner_15.jpeg',
  '/partner_16.jpeg',
  '/partner_17.jpeg',
  '/partner_19.jpeg',
  '/partner_21.jpeg',
  '/partner_22.jpeg',
  '/partner_23.jpeg',
  '/partner_24.jpeg',
  '/partner_25.jpg',
  '/partner_26.jpg',
  '/partner_27.jpg',
  '/partner_29.jpg',
]

const staticAdvertisements = [
  {
    id: 'ad-1',
    image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=80',
    link: 'https://www.raidtanjalagouira.ma',
    begin_date: '2026-01-01',
    end_date: '2030-12-31',
  },
]

function HomePage() {
  const MotionDiv = motion.div
  const MotionImg = motion.img
  const MotionH1 = motion.h1
  const MotionH2 = motion.h2
  const MotionH3 = motion.h3
  const MotionArticle = motion.article
  const MotionLink = motion.a

  const { t } = useTranslation()
  const { data: activities, isLoading, isError, error } = useActivities()
  const [expandedTitles, setExpandedTitles] = useState({})

  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress: pageScrollProgress } = useScroll()

  const heroImageY = useTransform(
    pageScrollProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-20, 20],
  )

  const featuredActivities = activities || []
  const homeActivities = featuredActivities.slice(0, 5)
  const shouldSlidePartners = partners.length > 10
  const firstRowPartners = partners.filter((_, index) => index % 2 === 0)
  const secondRowPartners = partners.filter((_, index) => index % 2 !== 0)
  const firstRowItems = shouldSlidePartners ? [...firstRowPartners, ...firstRowPartners] : firstRowPartners
  const secondRowItems = shouldSlidePartners ? [...secondRowPartners, ...secondRowPartners] : secondRowPartners

  const getTitlePreview = (title = '', words = 3) => {
    const parts = title.trim().split(/\s+/)
    if (parts.length <= words) {
      return { text: title, truncated: false }
    }

    return {
      text: `${parts.slice(0, words).join(' ')}...`,
      truncated: true,
    }
  }

  const toggleTitle = (id) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div>
      <SectionContainer className="pb-3 pt-0 lg:pt-0">
        <MotionDiv
          className="w-full"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <AdvertisementsTable advertisements={staticAdvertisements} />
        </MotionDiv>
      </SectionContainer>

      <SectionContainer className="pb-6 pt-2 md:pt-4 lg:-mt-4 lg:pt-0">
        <MotionDiv
          className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <MotionImg
            style={{ y: heroImageY }}
            className="order-1 hidden h-[320px] w-full rounded-3xl object-cover shadow-xl md:block md:h-[420px] lg:order-2"
            src={heroImage}
            alt="Humanitarian work"
          />
          <div className="order-2 lg:order-1">
            {/* <p className="mb-4 inline-block rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-600">
              NGO Platform
            </p> */}
            <MotionH1
              className="text-2xl font-extrabold leading-[1.1] text-primary-500 md:text-[36px] lg:text-[38px]"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              {t('heroTitle')}
            </MotionH1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-primary-400">
              {t('heroSubtitle')}<strong className="font-bold italic">{t('heroSubtitleBold')}</strong>{t('heroSubtitlePost')}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-400">{t('heroSubtitle2')}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-400">{t('heroSubtitle3')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button as={Link} to="/a-propos">
                {t('heroCtaMore')}
              </Button>
            </div>
          </div>
        </MotionDiv>
      </SectionContainer>

      <SectionContainer className="bg-white/70">
          <MotionDiv
            className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-primary-100 bg-white p-6 shadow-md md:grid-cols-2 md:p-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inViewViewport}
          >
            <MotionDiv className="flex h-[280px] w-full items-center justify-center rounded-2xl bg-white p-4" style={{ y: heroImageY }}>
              <img
                src="/la_cope.jpeg"
                alt="La Cope"
                className="max-h-full max-w-full object-contain"
              />
            </MotionDiv>
            <div>
              <p className="text-base font-semibold text-primary-400">{t('laCopeEdition')}</p>
              <MotionH2
                className="mt-2 text-3xl font-bold text-primary-500"
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={inViewViewport}
              >
                {t('laCopeTitre')}
              </MotionH2>
              <p className="mt-4 text-lg font-semibold text-secondary-500">{t('laCopeDates')}</p>
            </div>
          </MotionDiv>
        </SectionContainer>

      <SectionContainer>
        <MotionDiv
          className="mx-auto w-full max-w-6xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <MotionH2
              className="text-3xl font-bold text-primary-500"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              Activités
            </MotionH2>
            <Link to="/activities" className="animated-underline text-sm font-semibold text-secondary-500 transition hover:text-accent-500">
              voir plus
            </Link>
          </div>

          {isLoading ? <LoadingState /> : null}
          {isError ? <ErrorState message={error?.message} /> : null}

          {!isLoading && !isError ? (
            <MotionDiv
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              {featuredActivities.length === 0 ? (
                <p className="text-primary-400">Aucune activité disponible.</p>
              ) : null}
              {homeActivities.map((activity, index) => {
                const preview = getTitlePreview(activity.title)
                const isExpanded = Boolean(expandedTitles[activity.id])

                return (
                  <MotionArticle
                    key={activity.id}
                    className={`interactive-card flex cursor-pointer flex-col overflow-hidden rounded-xl border border-primary-100 bg-white shadow transition-all duration-300 ${index >= 3 ? 'hidden lg:flex' : ''}`}
                    variants={fadeUp}
                    whileHover={scaleHover.whileHover}
                    whileTap={scaleHover.whileTap}
                    transition={scaleHover.transition}
                  >
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h3 className="text-base font-bold leading-snug text-primary-500">
                          {isExpanded ? activity.title : preview.text}
                        </h3>
                        {preview.truncated ? (
                          <button
                            type="button"
                            onClick={() => toggleTitle(activity.id)}
                            className="mt-1 text-[10px] font-semibold lowercase text-secondary-500 hover:underline"
                          >
                            {isExpanded ? 'voir moins' : 'voir plus'}
                          </button>
                        ) : null}
                      </div>
                      <MotionLink
                        href={activity.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 block w-full rounded-xl bg-secondary-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-secondary-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        Voir l'activité
                      </MotionLink>
                    </div>
                  </MotionArticle>
                )
              })}
            </MotionDiv>
          ) : null}
        </MotionDiv>
      </SectionContainer>

      <SectionContainer className="bg-white/70 pb-4 pt-0">
          <MotionDiv
            className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-primary-100 bg-white p-6 shadow-md md:grid-cols-2 md:p-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inViewViewport}
          >
            <MotionDiv className="w-full" style={{ y: heroImageY }}>
              <VideoPlayer url="https://www.youtube.com/watch?v=DPrBVkE22mM" title="Raid Tanja Lagouira" />
            </MotionDiv>
            <div className="flex h-full flex-col">
              <p className="text-base font-semibold text-primary-400">{t('raidEdition')}</p>
              <MotionH2
                className="mt-2 text-3xl font-bold text-primary-500"
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={inViewViewport}
              >
                {t('raidTitle')}
              </MotionH2>
              <p className="mt-4 text-lg font-semibold text-secondary-500">{t('raidDates')}</p>
              <p className="mt-4 text-base leading-7 text-primary-400">{t('raidText1')}</p>
              <p className="mt-3 text-base leading-7 text-primary-400">{t('raidText2')}</p>
              <div className="mt-auto flex justify-end pt-4">
                <a
                  href="https://www.raidtanjalagouira.ma"
                  target="_blank"
                  rel="noreferrer"
                  className="animated-underline inline-flex items-center font-semibold text-secondary-500"
                >
                  www.raidtanjalagouira.ma
                </a>
              </div>
            </div>
          </MotionDiv>
        </SectionContainer>

      <SectionContainer className="pb-4 pt-2">
        <MotionDiv
          className="mx-auto w-full max-w-6xl rounded-2xl border border-primary-100 bg-white px-4 py-6 shadow-sm sm:px-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <div className="mb-6 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-secondary-500" />
            <MotionH3
              className="text-sm font-extrabold uppercase tracking-wide text-primary-500"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              {t('partnersTitle')}
            </MotionH3>
          </div>

          {shouldSlidePartners ? (
            <div className="space-y-4">
              <div className="partners-marquee">
                <div className="partners-track gap-4">
                  {firstRowItems.map((partner, index) => (
                    <div key={`r1-${partner}-${index}`} className="flex min-w-[120px] flex-col items-center text-center sm:min-w-[180px]">
                      <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-primary-100 bg-white p-2 shadow-sm sm:h-28 sm:w-36 sm:rounded-3xl">
                        <img
                          src={partner}
                          alt={`Partenaire ${(index % firstRowPartners.length) + 1}`}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="partners-marquee">
                <div className="partners-track partners-track-reverse gap-4">
                  {secondRowItems.map((partner, index) => (
                    <div key={`r2-${partner}-${index}`} className="flex min-w-[120px] flex-col items-center text-center sm:min-w-[180px]">
                      <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-primary-100 bg-white p-2 shadow-sm sm:h-28 sm:w-36 sm:rounded-3xl">
                        <img
                          src={partner}
                          alt={`Partenaire ${(index % secondRowPartners.length) + 1}`}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((partner, index) => (
                <div key={partner} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-primary-100 bg-white p-2 shadow-sm sm:h-28 sm:w-36 sm:rounded-3xl">
                    <img
                      src={partner}
                      alt={`Partenaire ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </MotionDiv>
      </SectionContainer>
    </div>
  )
}

export default HomePage
