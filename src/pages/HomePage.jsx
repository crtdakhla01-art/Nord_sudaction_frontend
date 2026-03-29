import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import EventCard from '../components/EventCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import heroImage from '../assets/hero.png'
import Button from '../components/Button'
import SectionContainer from '../components/SectionContainer'
import AdvertisementsTable from '../components/AdvertisementsTable'
import { useAdvertisements } from '../hooks/useAdvertisements'

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

function HomePage() {
  const { t } = useTranslation()
  const { data: events, isLoading, isError, error } = useEvents()
  const { data: advertisements } = useAdvertisements()

  const featuredEvents = (events || []).slice(0, 3)
  const shouldSlidePartners = partners.length > 10
  const firstRowPartners = partners.filter((_, index) => index % 2 === 0)
  const secondRowPartners = partners.filter((_, index) => index % 2 !== 0)
  const firstRowItems = shouldSlidePartners ? [...firstRowPartners, ...firstRowPartners] : firstRowPartners
  const secondRowItems = shouldSlidePartners ? [...secondRowPartners, ...secondRowPartners] : secondRowPartners
  return (
    <div>
      <SectionContainer className="pb-3 pt-0 lg:pt-0">
        <div className="mx-auto w-full max-w-6xl">
          <AdvertisementsTable advertisements={advertisements || []} />
        </div>
      </SectionContainer>

      <SectionContainer className="pb-6 pt-2 md:pt-4 lg:-mt-4 lg:pt-0">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-2">
          <img
            className="order-1 hidden h-[320px] w-full rounded-3xl object-cover shadow-xl md:block md:h-[420px] lg:order-2"
            src={heroImage}
            alt="Humanitarian work"
          />
          <div className="order-2 lg:order-1">
            {/* <p className="mb-4 inline-block rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-600">
              NGO Platform
            </p> */}
            <h1 className="text-2xl font-extrabold leading-[1.1] text-primary-500 md:text-[36px] lg:text-[38px]">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-primary-400">
              {t('heroSubtitle')}<strong className="font-bold italic">{t('heroSubtitleBold')}</strong>{t('heroSubtitlePost')}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-400">{t('heroSubtitle2')}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-400">{t('heroSubtitle3')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button as={Link} to="/opportunities">
                {t('heroCtaPrimary')}
              </Button>
              <Button as={Link} to="/events" variant="secondary">
                {t('heroCtaSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="bg-white/70">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-primary-100 bg-white p-6 shadow-md md:grid-cols-2 md:p-10">
          <img
            src="/la_cope.jpeg"
            alt="La Cope"
            className="h-auto w-full rounded-2xl object-cover"
          />
          <div>
            <p className="text-base font-semibold text-primary-400">{t('laCopeEdition')}</p>
            <h2 className="mt-2 text-3xl font-bold text-primary-500">{t('laCopeTitre')}</h2>
            <p className="mt-4 text-lg font-semibold text-secondary-500">{t('laCopeDates')}</p>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold text-primary-500">{t('featuredEventsTitle')}</h2>
            <Link to="/events" className="text-sm font-semibold text-secondary-500 transition hover:text-accent-500">
              {t('viewAllEvents')}
            </Link>
          </div>

          {isLoading ? <LoadingState /> : null}
          {isError ? <ErrorState message={error?.message} /> : null}

          {!isLoading && !isError ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {featuredEvents.length === 0 ? <p className="text-primary-400">{t('emptyEvents')}</p> : null}
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : null}
        </div>
      </SectionContainer>

      <SectionContainer className="pt-0 pb-4">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 rounded-3xl bg-primary-500 px-8 py-10 text-white md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold">{t('homeCtaTitle')}</h3>
            <p className="mt-2 max-w-2xl text-sm text-primary-200">{t('homeCtaText')}</p>
          </div>
          <Button as={Link} to="/opportunities" className="bg-secondary-500! text-white! hover:bg-secondary-600!">
            {t('heroCtaPrimary')}
          </Button>
        </div>
      </SectionContainer>

      <SectionContainer className="pb-4 pt-2">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-primary-100 bg-white px-4 py-6 shadow-sm sm:px-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-secondary-500" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary-500">{t('partnersTitle')}</h3>
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
        </div>
      </SectionContainer>
    </div>
  )
}

export default HomePage
