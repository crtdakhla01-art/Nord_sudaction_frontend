import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import SectionContainer from '../components/SectionContainer'
import SmaraDiscoveryRegistrationForm from '../components/SmaraDiscoveryRegistrationForm'
import {
  smaraDiscoveryActivityImages,
  smaraDiscoveryGalleryImages,
  smaraDiscoveryHeroImage,
  smaraDiscoveryWhyVisitImages,
} from '../constants/smaraDiscoveryAssets'
import { fadeLeft, fadeUp, inViewViewport, staggerContainer } from '../utils/animations'

const ACTIVITIES = [
  {
    key: 'astrotourism',
    titleKey: 'smaraDiscoveryActivityAstrotourism',
    descKey: 'smaraDiscoveryActivityAstrotourismDesc',
    imageKey: 'astrotourism',
  },
  {
    key: 'bivouac',
    titleKey: 'smaraDiscoveryActivityBivouac',
    descKey: 'smaraDiscoveryActivityBivouacDesc',
    imageKey: 'bivouac',
  },
  {
    key: 'hiking',
    titleKey: 'smaraDiscoveryActivityHiking',
    descKey: 'smaraDiscoveryActivityHikingDesc',
    imageKey: 'hiking',
  },
  {
    key: 'archaeological_sites',
    titleKey: 'smaraDiscoveryActivityArchaeology',
    descKey: 'smaraDiscoveryActivityArchaeologyDesc',
    imageKey: 'archaeological_sites',
  },
  {
    key: 'hassani_culture',
    titleKey: 'smaraDiscoveryActivityHassani',
    descKey: 'smaraDiscoveryActivityHassaniDesc',
    imageKey: 'hassani_culture',
  },
  {
    key: 'wildlife_observation',
    titleKey: 'smaraDiscoveryActivityWildlife',
    descKey: 'smaraDiscoveryActivityWildlifeDesc',
    imageKey: 'wildlife_observation',
  },
  {
    key: 'photography',
    titleKey: 'smaraDiscoveryActivityPhotography',
    descKey: 'smaraDiscoveryActivityPhotographyDesc',
    imageKey: 'photography',
  },
]

const WHY_ITEMS = [
  'smaraDiscoveryWhyItem1',
  'smaraDiscoveryWhyItem2',
  'smaraDiscoveryWhyItem3',
  'smaraDiscoveryWhyItem4',
]

function scrollToRegistration() {
  document.getElementById('smara-discovery-registration')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function SmaraDiscoveryExperiencePage() {
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()
  const MotionDiv = motion.div
  const MotionH1 = motion.h1
  const MotionH2 = motion.h2
  const MotionH3 = motion.h3

  return (
    <div className="bg-primary-50">
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <img
          src={smaraDiscoveryHeroImage}
          alt={t('smaraDiscoveryHeroTitle')}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-900/50 to-primary-900/80" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center text-white sm:px-6">
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <MotionDiv variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary-200">
                {t('smaraDiscoveryHeroEyebrow')}
              </p>
            </MotionDiv>
            <MotionH1
              variants={fadeUp}
              className="text-4xl font-black leading-tight tracking-wide md:text-6xl lg:text-7xl"
            >
              {t('smaraDiscoveryHeroTitle')}
            </MotionH1>
            <MotionDiv variants={fadeUp}>
              <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-white/90 md:text-2xl">
                {t('smaraDiscoveryHeroSubtitle')}
              </p>
            </MotionDiv>
            <MotionDiv variants={fadeUp} className="pt-4">
              <Button
                type="button"
                onClick={scrollToRegistration}
                className="mx-auto bg-secondary-500 px-8 py-4 text-base shadow-2xl md:hover:scale-105"
              >
                {t('smaraDiscoveryHeroCta')}
              </Button>
            </MotionDiv>
          </MotionDiv>
        </div>
      </section>

      <SectionContainer className="bg-white">
        <MotionDiv
          className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <div className="space-y-5 rtl:text-right">
            <MotionH2 className="text-3xl font-bold text-primary-500 md:text-4xl" variants={fadeLeft}>
              {t('smaraDiscoveryAboutTitle')}
            </MotionH2>
            <p className="text-base leading-8 text-primary-400">{t('smaraDiscoveryAboutP1')}</p>
            <p className="text-base leading-8 text-primary-400">{t('smaraDiscoveryAboutP2')}</p>
            <p className="text-base leading-8 text-primary-400">{t('smaraDiscoveryAboutP3')}</p>
          </div>
          <MotionDiv
            className="overflow-hidden rounded-3xl border border-secondary-100 shadow-xl"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.35 }}
          >
            <img
              src={smaraDiscoveryGalleryImages[0].src}
              alt={t(smaraDiscoveryGalleryImages[0].altKey)}
              className="h-full min-h-[320px] w-full object-cover"
              loading="lazy"
            />
          </MotionDiv>
        </MotionDiv>
      </SectionContainer>

      <SectionContainer className="bg-secondary-50/50">
        <MotionDiv
          className="mx-auto max-w-6xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <MotionDiv variants={fadeUp} className="mb-10 text-center rtl:text-right">
            <MotionH2 className="text-3xl font-bold text-primary-500 md:text-4xl">{t('smaraDiscoveryGalleryTitle')}</MotionH2>
            <p className="mt-3 text-base text-primary-400">{t('smaraDiscoveryGallerySubtitle')}</p>
          </MotionDiv>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {smaraDiscoveryGalleryImages.map((image, index) => (
              <MotionDiv
                key={image.altKey}
                variants={fadeUp}
                className={`group overflow-hidden rounded-2xl border border-white bg-white shadow-md ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.src}
                    alt={t(image.altKey)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary-900/0 transition duration-300 group-hover:bg-primary-900/20" />
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </SectionContainer>

      <SectionContainer className="bg-white">
        <MotionDiv
          className="mx-auto max-w-6xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <MotionDiv variants={fadeUp} className="mb-10 text-center rtl:text-right">
            <MotionH2 className="text-3xl font-bold text-primary-500 md:text-4xl">{t('smaraDiscoveryActivitiesTitle')}</MotionH2>
            <p className="mt-3 text-base text-primary-400">{t('smaraDiscoveryActivitiesSubtitle')}</p>
          </MotionDiv>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ACTIVITIES.map((activity) => (
              <MotionDiv
                key={activity.key}
                variants={fadeUp}
                className="group overflow-hidden rounded-3xl border border-secondary-100 bg-primary-50 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={smaraDiscoveryActivityImages[activity.imageKey]}
                    alt={t(activity.titleKey)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2 p-6 rtl:text-right">
                  <h3 className="text-lg font-bold text-primary-500">{t(activity.titleKey)}</h3>
                  <p className="text-sm leading-7 text-primary-400">{t(activity.descKey)}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </SectionContainer>

      <SectionContainer className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <MotionDiv
          className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <div className="space-y-6 rtl:text-right">
            <MotionH2 className="text-3xl font-bold md:text-4xl" variants={fadeLeft}>
              {t('smaraDiscoveryWhyTitle')}
            </MotionH2>
            <p className="text-base leading-8 text-white/85">{t('smaraDiscoveryWhyP1')}</p>
            <p className="text-base leading-8 text-white/85">{t('smaraDiscoveryWhyP2')}</p>
            <p className="text-base leading-8 text-white/85">{t('smaraDiscoveryWhyP3')}</p>
            <ul className="space-y-3">
              {WHY_ITEMS.map((itemKey) => (
                <li key={itemKey} className="flex items-start gap-3 text-sm leading-7 text-white/90 rtl:flex-row-reverse rtl:text-right">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-secondary-400" />
                  {t(itemKey)}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {smaraDiscoveryWhyVisitImages.map((imageSrc, index) => (
              <div
                key={imageSrc}
                className={`overflow-hidden rounded-2xl border border-white/20 shadow-lg ${
                  index === 0 ? 'col-span-2' : ''
                }`}
              >
                <img src={imageSrc} alt={t('smaraDiscoveryWhyImageAlt')} className="h-full min-h-[140px] w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </MotionDiv>
      </SectionContainer>

      <SectionContainer className="bg-primary-50 pb-20">
        <MotionDiv
          className="mx-auto max-w-4xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          <div className="mb-8 text-center rtl:text-right">
            <MotionH2 className="text-3xl font-bold text-primary-500 md:text-4xl">{t('smaraDiscoveryFormTitle')}</MotionH2>
            <p className="mt-3 text-base leading-7 text-primary-400">{t('smaraDiscoveryFormSubtitle')}</p>
          </div>
          <SmaraDiscoveryRegistrationForm />
        </MotionDiv>
      </SectionContainer>
    </div>
  )
}

export default SmaraDiscoveryExperiencePage
