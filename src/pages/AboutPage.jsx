import { useTranslation } from 'react-i18next'
import SectionContainer from '../components/SectionContainer'
import logo from '../assets/logo.jpeg'

const events = [
  { titleKey: 'aboutPageForumTitle', textKey: 'aboutPageForumText' },
  { titleKey: 'aboutPageRaidTitle', textKey: 'aboutPageRaidText' },
  { titleKey: 'aboutPageCongressTitle', textKey: 'aboutPageCongressText' },
  { titleKey: 'aboutPagePressTripsTitle', textKey: 'aboutPagePressTripsText' },
  { titleKey: 'aboutPageConferencesTitle', textKey: 'aboutPageConferencesText' },
]

function AboutPage() {
  const { t } = useTranslation()
  const impactItems = t('aboutPageImpactItems', { returnObjects: true })

  return (
    <SectionContainer>
      <div className="mx-auto w-full max-w-6xl space-y-6">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-secondary-500 px-6 py-10 shadow-lg sm:px-10 sm:py-14">
        <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">{t('aboutPageEyebrow')}</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">{t('brand')}</h1>
            <p className="mt-4 text-sm leading-7 text-white/80">{t('heroSubtitleBold')}</p>
          </div>
          <img src={logo} alt={t('brand')} className="h-32 w-48 flex-shrink-0 rounded-2xl bg-white object-contain p-3 shadow-md sm:h-40 sm:w-60" />
        </div>
        {/* decorative circle */}
        <span className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <span className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />
      </div>

      {/* ── Mission ── */}
      <div className="mt-6 rounded-3xl border border-primary-100 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-secondary-500" />
          <h2 className="text-xl font-bold text-primary-500">{t('introTitle')}</h2>
        </div>
        <p className="mt-4 text-base leading-8 text-primary-400">
          {t('heroSubtitle')}<strong className="font-semibold text-primary-500">{t('heroSubtitleBold')}</strong>{t('heroSubtitlePost')}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <p className="rounded-2xl bg-primary-50 px-5 py-4 text-sm leading-7 text-primary-400">{t('heroSubtitle2')}</p>
          <p className="rounded-2xl bg-primary-50 px-5 py-4 text-sm leading-7 text-primary-400">{t('heroSubtitle3')}</p>
        </div>
      </div>

      {/* ── Flagship events ── */}
      <div className="mt-6 rounded-3xl border border-primary-100 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-secondary-500" />
          <h2 className="text-xl font-bold text-primary-500">{t('aboutPageSectionTitle')}</h2>
        </div>
        <p className="mt-4 text-sm leading-7 text-primary-400">{t('aboutPageSectionIntro')}</p>

        <div className="mt-6 space-y-0 divide-y divide-primary-100">
          {events.map(({ titleKey, textKey }, i) => (
            <div key={titleKey} className="flex gap-4 py-5 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-primary-500">{t(titleKey)}</h3>
                <p className="mt-1.5 text-sm leading-7 text-primary-400">{t(textKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Impact ── */}
      <div className="mt-6 rounded-3xl bg-primary-900 px-6 py-8 shadow-sm sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-secondary-500" />
          <h2 className="text-xl font-bold text-white">{t('aboutPageImpactTitle')}</h2>
        </div>
        <p className="mt-3 text-sm text-white/60">{t('aboutPageImpactIntro')}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {impactItems.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-secondary-400" />
              <span className="text-sm leading-6 text-white/80">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      </div>
    </SectionContainer>
  )
}

export default AboutPage