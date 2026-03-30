import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { useActivities } from '../hooks/useActivities'

function ActivitiesPage() {
  const { data: activities, isLoading, isError, error } = useActivities()

  return (
    <SectionContainer>
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-primary-500 md:text-5xl">Activités</h1>

        <div className="mt-8">
          {isLoading ? <LoadingState /> : null}
          {isError ? <ErrorState message={error?.message} /> : null}

          {!isLoading && !isError ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {(activities || []).length === 0 ? (
                <p className="text-primary-400">Aucune activité disponible.</p>
              ) : null}
              {(activities || []).map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-primary-100 bg-white shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <h3 className="text-base font-bold leading-snug text-primary-500">{activity.title}</h3>
                    <a
                      href={activity.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 block w-full rounded-xl bg-secondary-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-secondary-600"
                    >
                      Voir l'activité
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </SectionContainer>
  )
}

export default ActivitiesPage
