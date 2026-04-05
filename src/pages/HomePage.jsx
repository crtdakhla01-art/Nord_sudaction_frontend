import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { usePosts } from '../hooks/usePosts'
import { getImageUrl } from '../api/client'
import { formatDateLabel } from '../utils/date'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
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
  '/partner_28.png',
  '/partner_29.jpg',
]

const staticAdvertisements = [
  {
    id: 'ad-1',
    image: '/banner_3.png',
    link: 'https://padeleventmaroc.com/',
    begin_date: '2026-01-01',
    end_date: '2030-12-31',
  },
]

const homeHeroGalleryImages = [
  '/header_image_1.jpeg',
  '/header_image_2.jpeg',
  '/header_image_3.jpeg',
  '/header_image_4.jpeg',
  '/header_image_5.jpeg',
  '/header_image_6.jpeg',
]

function HomePage() {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1
  const MotionH2 = motion.h2
  const MotionH3 = motion.h3
  const MotionArticle = motion.article
  const MotionLink = motion.a

  const { t } = useTranslation()
  const { data: postsData, isLoading, isError, error } = usePosts({ per_page: 5 })
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0)

  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress: pageScrollProgress } = useScroll()

  const heroImageY = useTransform(
    pageScrollProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-20, 20],
  )

  const homePosts = postsData?.data?.slice(0, 5) || []
  const shouldSlidePartners = partners.length > 10
  const firstRowPartners = partners.filter((_, index) => index % 2 === 0)
  const secondRowPartners = partners.filter((_, index) => index % 2 !== 0)
  const firstRowItems = shouldSlidePartners ? [...firstRowPartners, ...firstRowPartners] : firstRowPartners
  const secondRowItems = shouldSlidePartners ? [...secondRowPartners, ...secondRowPartners] : secondRowPartners

  useEffect(() => {
    if (prefersReducedMotion || homeHeroGalleryImages.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCurrentHeroImageIndex((previousIndex) => (previousIndex + 1) % homeHeroGalleryImages.length)
    }, 3500)

    return () => window.clearInterval(intervalId)
  }, [prefersReducedMotion])

  return (
    <div>
      <div className="flex flex-col">
      {/* order number three  */}
      <SectionContainer className="order-2 lg:order-1 pb-3 pt-0 lg:pt-0 bg-white">
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
      
      <SectionContainer className="order-1 lg:order-2 pb-6 pt-2 md:pt-4 lg:-mt-4 lg:pt-0">
        <MotionDiv
          className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        > 
          {/* order number one  */}
          <MotionDiv
            style={{ y: heroImageY }}
            className="order-1 mt-[10px] h-[260px] overflow-hidden rounded-[2rem] border border-secondary-100 bg-gradient-to-br from-primary-50 via-primary-50 to-secondary-50 p-4 shadow-xl sm:h-[320px] md:h-[420px] lg:order-2"
          >
            <div className="mb-3 flex items-center justify-end px-1">
              <div className="flex items-center gap-2">
                {homeHeroGalleryImages.map((imageSrc, index) => {
                  const isActive = index === currentHeroImageIndex

                  return (
                    <span
                      key={imageSrc}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isActive ? 'w-7 bg-secondary-500' : 'w-2.5 bg-primary-200'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
            <motion.img
              key={homeHeroGalleryImages[currentHeroImageIndex]}
              src={homeHeroGalleryImages[currentHeroImageIndex]}
              alt={`${t('brand')} ${currentHeroImageIndex + 1}`}
              className="h-[calc(100%-2.25rem)] w-full rounded-[1.5rem] border border-white/70 object-cover shadow-md"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </MotionDiv>
          {/* order number two  */}
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
            <p className="mt-3 max-w-2xl text-base leading-7 text-primary-400">{t('heroSubtitle2')}</p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-primary-400">{t('heroSubtitle3')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button as={Link} to="/a-propos">
                {t('heroCtaMore')}
              </Button>
            </div>
          </div>
        </MotionDiv>
      </SectionContainer>
      </div>

      {/* <SectionContainer className="bg-white/70">
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
      </SectionContainer> */}
        <SectionContainer className="bg-secondary-50/40 pb-4 pt-0">
          <MotionDiv
            className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-secondary-100 bg-primary-50 p-6 shadow-md md:grid-cols-2 md:p-10"
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
              Actualités
            </MotionH2>
            <Link to="/actualites" className="animated-underline text-sm font-semibold text-secondary-500 transition hover:text-accent-500">
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
              {homePosts.length === 0 ? (
                <p className="text-primary-400">Aucune actualité disponible.</p>
              ) : null}
              {homePosts.map((post, index) => (
                <MotionArticle
                  key={post.id}
                  className={`interactive-card flex cursor-pointer flex-col overflow-hidden rounded-xl border border-secondary-100 bg-primary-50 shadow transition-all duration-300 ${index >= 3 ? 'hidden lg:flex' : ''}`}
                  variants={fadeUp}
                  whileHover={scaleHover.whileHover}
                  whileTap={scaleHover.whileTap}
                  transition={scaleHover.transition}
                >
                  <div className="h-28 w-full overflow-hidden bg-primary-50">
                    {post.media ? (
                      <img src={getImageUrl(post.media)} alt={post.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-2xl font-black text-secondary-500 opacity-20">NSA</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="text-sm font-bold leading-snug text-primary-500 line-clamp-2">{post.title}</h3>
                      <p className="mt-1 text-xs text-primary-400">{formatDateLabel(post.published_at || post.created_at, 'fr')}</p>
                    </div>
                    <Link
                      to={`/actualites/${post.slug}`}
                      className="mt-3 block w-full rounded-xl bg-secondary-500 px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-secondary-600"
                    >
                      {t('readMore')}
                    </Link>
                  </div>
                </MotionArticle>
              ))}
            </MotionDiv>
          ) : null}
        </MotionDiv>
      </SectionContainer>



      <SectionContainer className="pb-4 pt-2">
        <MotionDiv
          className="mx-auto w-full max-w-6xl rounded-2xl border border-secondary-100 bg-white px-4 py-6 shadow-sm sm:px-6"
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
                      <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-secondary-100 bg-white p-2 shadow-sm sm:h-28 sm:w-36 sm:rounded-3xl">
                        <img
                          src={partner}
                          alt={`Partenaire ${(index % firstRowPartners.length) + 1}`}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                          decoding="async"
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
                      <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-secondary-100 bg-white p-2 shadow-sm sm:h-28 sm:w-36 sm:rounded-3xl">
                        <img
                          src={partner}
                          alt={`Partenaire ${(index % secondRowPartners.length) + 1}`}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                          decoding="async"
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
                  <div className="flex h-16 w-24 items-center justify-center rounded-2xl border border-secondary-100 bg-white p-2 shadow-sm sm:h-28 sm:w-36 sm:rounded-3xl">
                    <img
                      src={partner}
                      alt={`Partenaire ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                      decoding="async"
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
