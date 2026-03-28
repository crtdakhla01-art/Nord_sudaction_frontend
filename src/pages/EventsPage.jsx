import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EventCard from '../components/EventCard'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { useEvents } from '../hooks/useEvents'

function EventsPage() {
  const { t } = useTranslation()
  const { data: events, isLoading, isError, error } = useEvents()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [page, setPage] = useState(1)
  const itemsPerPage = 16

  const tabClass = (tab) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
      activeTab === tab
        ? 'bg-secondary-500 text-white shadow'
        : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500'
    }`

  const timelineEvents = useMemo(() => {
    const list = events || []

    return list.filter((event) => {
      if (activeTab === 'upcoming') {
        return !event.is_it_passed
      }

      return Boolean(event.is_it_passed)
    })
  }, [activeTab, events])

  const totalItems = timelineEvents.length
  const shouldPaginate = totalItems > itemsPerPage
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return timelineEvents.slice(start, start + itemsPerPage)
  }, [page, timelineEvents])

  return (
    <SectionContainer>
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-primary-500 md:text-5xl">{t('eventsPageTitle')}</h1>

        <div className="mt-6 w-full overflow-x-auto pb-1">
          <div className="inline-flex min-w-max items-center gap-1 rounded-xl border border-primary-100 bg-white p-1 shadow-sm">
            <button
              type="button"
              className={tabClass('upcoming')}
              onClick={() => {
                setActiveTab('upcoming')
                setPage(1)
              }}
            >
              {t('eventsUpcomingTab')}
            </button>
            <button
              type="button"
              className={tabClass('passed')}
              onClick={() => {
                setActiveTab('passed')
                setPage(1)
              }}
            >
              {t('eventsPassedTab')}
            </button>
          </div>
        </div>

        {isLoading ? <LoadingState /> : null}
        {isError ? <ErrorState message={error?.message} /> : null}

        {!isLoading && !isError ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {timelineEvents.length === 0 ? <p className="text-primary-400">{t('emptyEvents')}</p> : null}
              {paginatedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {shouldPaginate ? (
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                  className="cursor-pointer rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs font-semibold text-primary-400">{page} / {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="cursor-pointer rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </SectionContainer>
  )
}

export default EventsPage
