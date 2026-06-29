import { useTranslation } from 'react-i18next'
import SectionContainer from '../components/SectionContainer'

function ParticipationConditionsPage() {
  const { t } = useTranslation()

  const participationIncludesItems = [
    t('conditionsIncludesItem1'),
    t('conditionsIncludesItem2'),
    t('conditionsIncludesItem3'),
    t('conditionsIncludesItem4'),
    t('conditionsIncludesItem5'),
    t('conditionsIncludesItem6'),
    t('conditionsIncludesItem7'),
    t('conditionsIncludesItem8'),
    t('conditionsIncludesItem9'),
  ]

  const generalConditionsItems = [
    t('conditionsGeneralItem1'),
    t('conditionsGeneralItem2'),
    t('conditionsGeneralItem3'),
    t('conditionsGeneralItem4'),
    t('conditionsGeneralItem5'),
    t('conditionsGeneralItem6'),
  ]

  const officialProgramLinkText = t('conditionsOfficialProgramLinkText')

  const responsibilityItems = [
    t('conditionsResponsibilityItem1'),
    t('conditionsResponsibilityItem2'),
    t('conditionsResponsibilityItem3'),
    t('conditionsResponsibilityItem4'),
    t('conditionsResponsibilityItem5'),
  ]

  return (
    <SectionContainer>
      <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-primary-100 bg-white p-6 text-primary-500 shadow-sm md:p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-primary-600">{t('conditionsPageTitle')}</h1>
          <p className="font-semibold">{t('conditionsEventName')}</p>
          <p className="text-sm text-primary-400">{t('conditionsEventDate')}</p>
        </header>

        <section className="space-y-3 text-sm leading-7 text-primary-500">
          <p>{t('conditionsIntro1')}</p>
          <p>{t('conditionsIntro2')}</p>
          <p>{t('conditionsIntro3')}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary-600">{t('conditionsIncludesTitle')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-primary-500">
            {participationIncludesItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary-600">{t('conditionsGeneralTitle')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-primary-500">
            {generalConditionsItems.map((item, index) => {
              if (index !== 3 || !item.includes(officialProgramLinkText)) {
                return <li key={item}>{item}</li>
              }

              const [before, after] = item.split(officialProgramLinkText)

              return (
                <li key={item}>
                  {before}
                  {/* <Link
                    to="/programme"
                    className="font-semibold text-secondary-600 underline underline-offset-2 hover:text-secondary-700"
                  >
                    {officialProgramLinkText}
                  </Link> */}
                  <span className="font-semibold text-secondary-600">{officialProgramLinkText}</span>
                  {after}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-7 text-primary-500">
          <h2 className="text-lg font-semibold text-primary-600">{t('conditionsInsuranceTitle')}</h2>
          <p>{t('conditionsInsuranceIntro1')}</p>
          <p>{t('conditionsInsuranceIntro2')}</p>
          <ul className="list-disc space-y-1 pl-5">
            {responsibilityItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{t('conditionsInsuranceIntro3')}</p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-primary-500">
          <h2 className="text-lg font-semibold text-primary-600">{t('conditionsImageRightsTitle')}</h2>
          <p>{t('conditionsImageRightsText')}</p>
        </section>

        <div className="rounded-xl border border-secondary-100 bg-secondary-50 p-4">
          <p className="text-sm text-primary-500">{t('conditionsContinueHint')}</p>
          {/* <div className="mt-3">
            <Link
              to="/inscription"
              className="inline-flex items-center rounded-lg bg-secondary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600"
            >
              {t('conditionsContinueButton')}
            </Link>
          </div> */}
        </div>

      </div>
    </SectionContainer>
  )
}

export default ParticipationConditionsPage
