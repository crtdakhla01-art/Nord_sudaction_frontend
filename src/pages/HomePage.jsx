import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import EventCard from '../components/EventCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import heroImage from '../assets/hero.png'
import aboutImage from '../assets/logo.jpeg'
import Button from '../components/Button'
import SectionContainer from '../components/SectionContainer'
import AdvertisementsTable from '../components/AdvertisementsTable'
import { useAdvertisements } from '../hooks/useAdvertisements'

const partners = [
  { name: 'Louisiana Baptists Convention', mark: 'LB', bg: 'bg-[#14293d]', fg: 'text-white' },
  { name: 'Jefferson Baptist', mark: 'JB', bg: 'bg-white', fg: 'text-[#175a8f]' },
  { name: 'Mount Bethel', mark: 'MB', bg: 'bg-[#3f93a5]', fg: 'text-white' },
  { name: 'First Baptist Atlanta', mark: 'FBA', bg: 'bg-[#f7f7f7]', fg: 'text-[#4d7685]' },
  { name: 'Graves Overhead Doors', mark: 'GO', bg: 'bg-black', fg: 'text-white' },
  { name: 'Graves Fireplaces', mark: 'GF', bg: 'bg-[#0f0f0f]', fg: 'text-white' },
  { name: 'First Baptist Church of Woodstock', mark: 'W', bg: 'bg-white', fg: 'text-[#1f1f1f]' },
  { name: 'Haggai International', mark: 'HI', bg: 'bg-[#4f8bc0]', fg: 'text-white' },
  { name: 'Mercy Bridge Alliance', mark: 'MBA', bg: 'bg-[#17324d]', fg: 'text-white' },
  { name: 'Hopewell Ministries', mark: 'HM', bg: 'bg-[#f3f7fb]', fg: 'text-[#2f5f86]' },
  { name: 'Global Relief Network', mark: 'GRN', bg: 'bg-[#2f8aa0]', fg: 'text-white' },
  { name: 'Faith & Works Coalition', mark: 'FW', bg: 'bg-[#ececec]', fg: 'text-[#254455]' },
  { name: 'Northgate Outreach', mark: 'NO', bg: 'bg-[#0f1720]', fg: 'text-white' },
  { name: 'Open Hands Foundation', mark: 'OH', bg: 'bg-[#1f2937]', fg: 'text-white' },
  { name: 'Woodland Fellowship Center', mark: 'WFC', bg: 'bg-white', fg: 'text-[#202020]' },
  { name: 'Covenant Impact Group', mark: 'CI', bg: 'bg-[#4d87b8]', fg: 'text-white' },
  { name: 'Bridgepoint Mission', mark: 'BM', bg: 'bg-[#1f4c6b]', fg: 'text-white' },
  { name: 'Kingdom Builders Initiative', mark: 'KBI', bg: 'bg-[#f6f6f6]', fg: 'text-[#274d68]' },
  { name: 'Community Care Hub', mark: 'CCH', bg: 'bg-[#2f7e95]', fg: 'text-white' },
  { name: 'Harvest Partners', mark: 'HP', bg: 'bg-[#f9f9f9]', fg: 'text-[#3e6374]' },
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
      <SectionContainer className="pb-8 pt-8 lg:pt-10">
        <div className="mx-auto w-full max-w-6xl">
          <AdvertisementsTable advertisements={advertisements || []} />
        </div>
      </SectionContainer>

      <SectionContainer className="pb-10 pt-8 lg:pt-12">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <img
            className="order-1 hidden h-[320px] w-full rounded-3xl object-cover shadow-xl md:block md:h-[420px] lg:order-2"
            src={heroImage}
            alt="Humanitarian work"
          />
          <div className="order-2 lg:order-1">
            <p className="mb-4 inline-block rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-600">
              NGO Platform
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-primary-500 md:text-5xl">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-primary-400">{t('heroSubtitle')}</p>
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
            src={aboutImage}
            alt="Association logo"
            className="h-auto w-full rounded-2xl object-contain"
          />
          <div>
            <h2 className="text-3xl font-bold text-primary-500">{t('introTitle')}</h2>
            <p className="mt-4 text-base leading-7 text-primary-400">{t('introText')}</p>
            <p className="mt-4 text-sm leading-6 text-primary-300">{t('aboutDetail')}</p>
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

      <SectionContainer className="pt-0">
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

      <SectionContainer className="pb-8 pt-2">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-primary-100 bg-white px-4 py-6 shadow-sm sm:px-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-secondary-500" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary-500">Nos partenaires</h3>
          </div>

          {shouldSlidePartners ? (
            <div className="space-y-4">
              <div className="partners-marquee">
                <div className="partners-track gap-4">
                  {firstRowItems.map((partner, index) => (
                    <div key={`r1-${partner.name}-${index}`} className="flex min-w-[100px] flex-col items-center text-center sm:min-w-[180px]">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-100 text-lg font-black shadow-sm sm:h-28 sm:w-28 sm:rounded-3xl sm:text-2xl ${partner.bg} ${partner.fg}`}>
                        {partner.mark}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="partners-marquee">
                <div className="partners-track partners-track-reverse gap-4">
                  {secondRowItems.map((partner, index) => (
                    <div key={`r2-${partner.name}-${index}`} className="flex min-w-[100px] flex-col items-center text-center sm:min-w-[180px]">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-100 text-lg font-black shadow-sm sm:h-28 sm:w-28 sm:rounded-3xl sm:text-2xl ${partner.bg} ${partner.fg}`}>
                        {partner.mark}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((partner) => (
                <div key={partner.name} className="flex flex-col items-center text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-100 text-lg font-black shadow-sm sm:h-28 sm:w-28 sm:rounded-3xl sm:text-2xl ${partner.bg} ${partner.fg}`}>
                    {partner.mark}
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
