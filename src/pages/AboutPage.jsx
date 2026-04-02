import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionContainer from '../components/SectionContainer'
import logo from '../assets/logo.jpeg'
import { fadeLeft, fadeUp, inViewViewport, staggerContainer } from '../utils/animations'

const events = [
  { titleKey: 'aboutPageForumTitle', textKey: 'aboutPageForumText' },
  { titleKey: 'aboutPageRaidTitle', textKey: 'aboutPageRaidText' },
  { titleKey: 'aboutPageCongressTitle', textKey: 'aboutPageCongressText' },
  { titleKey: 'aboutPagePressTripsTitle', textKey: 'aboutPagePressTripsText' },
  { titleKey: 'aboutPageConferencesTitle', textKey: 'aboutPageConferencesText' },
]

function AboutPage() {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1
  const MotionH2 = motion.h2
  const MotionLi = motion.li

  const { t } = useTranslation()
  const impactItems = t('aboutPageImpactItems', { returnObjects: true })

  return (
    <SectionContainer>
      <MotionDiv
        className="mx-auto w-full max-w-6xl space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >

      {/* ── Hero banner ── */}
      <MotionDiv className="relative overflow-hidden rounded-3xl bg-secondary-500 px-6 py-6 shadow-lg sm:px-10 sm:py-8" variants={fadeUp}>
        <div className="relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">{t('aboutPageEyebrow')}</p>
            <MotionH1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl" variants={fadeLeft}>{t('brand')}</MotionH1>
            <p className="mt-4 text-sm leading-7 text-white/80 whitespace-nowrap">{t('heroSubtitleBold')}</p>
          </div>
        </div>
        {/* decorative circle */}
        <span className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <span className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />
      </MotionDiv>

      <MotionDiv className="rounded-3xl border border-secondary-100 bg-primary-50 px-6 py-6 shadow-sm sm:px-8" variants={fadeUp}>
        <p className="text-base leading-8 text-primary-400">{t('aboutPageOrigins')}</p>
      </MotionDiv>

      {/* ── Mission ── */}
      <MotionDiv className="mt-6 rounded-3xl border border-secondary-100 bg-primary-50 px-6 py-8 shadow-sm sm:px-8" variants={fadeUp}>
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-secondary-500" />
          <MotionH2 className="text-xl font-bold text-primary-500" variants={fadeLeft}>{t('introTitle')}</MotionH2>
        </div>
        <p className="mt-4 text-base leading-8 text-primary-400">
          {t('heroSubtitle')}<strong className="font-semibold text-primary-500">{t('heroSubtitleBold')}</strong>{t('heroSubtitlePost')}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <p className="rounded-2xl bg-secondary-50 px-5 py-4 text-sm leading-7 text-primary-400">{t('heroSubtitle2')}</p>
          <p className="rounded-2xl bg-secondary-50 px-5 py-4 text-sm leading-7 text-primary-400">{t('heroSubtitle3')}</p>
        </div>
      </MotionDiv>

      {/* ── Flagship events ── */}
      <MotionDiv className="mt-6 rounded-3xl border border-secondary-100 bg-primary-50 px-6 py-8 shadow-sm sm:px-8" variants={fadeUp}>
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-secondary-500" />
          <MotionH2 className="text-xl font-bold text-primary-500" variants={fadeLeft}>{t('aboutPageSectionTitle')}</MotionH2>
        </div>
        <p className="mt-4 text-sm leading-7 text-primary-400">{t('aboutPageSectionIntro')}</p>

        <MotionDiv className="mt-6 space-y-0 divide-y divide-secondary-100" variants={staggerContainer}>
          {events.map(({ titleKey, textKey }, i) => (
            <motion.div key={titleKey} className="flex gap-4 py-5 first:pt-0 last:pb-0" variants={fadeUp}>
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-primary-500">{t(titleKey)}</h3>
                <p className="mt-1.5 text-sm leading-7 text-primary-400">{t(textKey)}</p>
              </div>
            </motion.div>
          ))}
        </MotionDiv>
      </MotionDiv>

      {/* ── Impact ── */}
      <MotionDiv className="mt-6 rounded-3xl bg-primary-900 px-6 py-8 shadow-sm sm:px-8" variants={fadeUp}>
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-secondary-500" />
          <MotionH2 className="text-xl font-bold text-white" variants={fadeLeft}>{t('aboutPageImpactTitle')}</MotionH2>
        </div>
        <p className="mt-3 text-sm text-white/60">{t('aboutPageImpactIntro')}</p>
        <motion.ul className="mt-5 grid gap-3 sm:grid-cols-2" variants={staggerContainer}>
          {impactItems.map((item) => (
            <MotionLi key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3" variants={fadeUp}>
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-secondary-400" />
              <span className="text-sm leading-6 text-white/80">{item}</span>
            </MotionLi>
          ))}
        </motion.ul>
      </MotionDiv>

      </MotionDiv>
    </SectionContainer>
  )
}

export default AboutPage