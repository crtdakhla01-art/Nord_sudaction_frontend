import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionContainer from '../components/SectionContainer'
import programmePdf from '../assets/programme.pdf'

function OfficialProgramPage() {
  const { t } = useTranslation()

  const featureItems = [
    t('officialProgramFeature1'),
    t('officialProgramFeature2'),
    t('officialProgramFeature3'),
    t('officialProgramFeature4'),
    t('officialProgramFeature5'),
    t('officialProgramFeature6'),
    t('officialProgramFeature7'),
    t('officialProgramFeature8'),
  ]

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
    <SectionContainer>
      <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-primary-100 bg-white p-6 text-primary-500 shadow-sm md:p-8">
        <header className="rounded-2xl border border-secondary-100 bg-gradient-to-r from-secondary-50 to-primary-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">{t('officialProgramEyebrow')}</p>
          <h1 className="mt-2 text-2xl font-semibold text-primary-600 md:text-3xl">{t('officialProgramHeroTitle')}</h1>
          <p className="mt-2 text-sm font-medium text-primary-400">{t('officialProgramHeroDate')}</p>
          <p className="mt-4 text-base leading-7 text-primary-600">
            {t('officialProgramHeroQuestion')}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4 rounded-2xl border border-primary-100 bg-white p-5">
            <p className="text-sm leading-7 text-primary-500">{t('officialProgramIntro1')}</p>
            <p className="text-sm leading-7 text-primary-500">{t('officialProgramIntro2')}</p>
            <ul className="grid gap-2 text-sm text-primary-500 sm:grid-cols-2">
              {featureItems.map((item) => (
                <li key={item} className="rounded-lg border border-primary-100 bg-primary-50/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4 rounded-2xl border border-secondary-100 bg-secondary-50 p-5">
            <p className="text-sm font-semibold text-primary-600">{t('officialProgramFee')}</p>
            <p className="text-sm text-primary-500">{t('officialProgramDeparture')}</p>
            <p className="text-sm text-primary-500">{t('officialProgramEventDate')}</p>
            <p className="text-sm font-semibold text-secondary-700">{t('officialProgramLimitedPlaces')}</p>

            <div className="space-y-2 text-sm">
              <p className="text-primary-500">
                {t('officialProgramRegistrationsLabel')}{' '}
                <a
                  href="https://www.nordsudaction.ma/inscription"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-secondary-600 underline underline-offset-2 hover:text-secondary-700"
                >
                  https://www.nordsudaction.ma/inscription
                </a>
              </p>
              <p className="text-primary-500">
                {t('officialProgramInfoLabel')}{' '}
                <a href="mailto:contact@nordsudaction.org" className="font-semibold text-secondary-600 underline underline-offset-2 hover:text-secondary-700">
                  contact@nordsudaction.org
                </a>
              </p>
            </div>
          </aside>
        </section>

        <div className="rounded-xl border border-secondary-100 bg-secondary-50 p-4">
          <p className="text-sm text-primary-500">{t('officialProgramDownloadHint')}</p>
          <button
            type="button"
            onClick={handleDownloadProgram}
            className="mt-3 inline-flex cursor-pointer items-center rounded-lg bg-secondary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600"
          >
            {t('officialProgramDownloadButton')}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/conditions-participation" className="text-sm font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700">
            {t('officialProgramBackToConditions')}
          </Link>
          <Link
            to="/inscription"
            className="inline-flex cursor-pointer items-center rounded-lg bg-secondary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600"
          >
            {t('conditionsContinueButton')}
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}

export default OfficialProgramPage
