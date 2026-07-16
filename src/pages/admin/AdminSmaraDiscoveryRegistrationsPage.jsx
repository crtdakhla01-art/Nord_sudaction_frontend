import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import { useAdminSmaraDiscoveryRegistrations } from '../../hooks/useAdminSmaraDiscoveryRegistrations'
import { useUser } from '../../hooks/useUser'
import { ADMIN_ROLE } from '../../constants/roles'
import { formatDateLabel } from '../../utils/date'

const ageGroupLabels = {
  under_25: 'smaraDiscoveryAgeUnder25',
  '25_34': 'smaraDiscoveryAge25_34',
  '35_44': 'smaraDiscoveryAge35_44',
  '45_54': 'smaraDiscoveryAge45_54',
  '55_plus': 'smaraDiscoveryAge55Plus',
}

const participantsLabels = {
  1: 'smaraDiscoveryParticipants1',
  2: 'smaraDiscoveryParticipants2',
  '3_or_more': 'smaraDiscoveryParticipants3Plus',
}

const interestLabels = {
  certainly: 'smaraDiscoveryInterestCertainly',
  probably: 'smaraDiscoveryInterestProbably',
  maybe: 'smaraDiscoveryInterestMaybe',
}

const durationLabels = {
  weekend: 'smaraDiscoveryDurationWeekend',
  '3_days': 'smaraDiscoveryDuration3Days',
  '4_days_plus': 'smaraDiscoveryDuration4Plus',
}

const activityLabels = {
  astrotourism: 'smaraDiscoveryActivityAstrotourism',
  bivouac: 'smaraDiscoveryActivityBivouac',
  hiking: 'smaraDiscoveryActivityHiking',
  archaeological_sites: 'smaraDiscoveryActivityArchaeology',
  hassani_culture: 'smaraDiscoveryActivityHassani',
  wildlife_observation: 'smaraDiscoveryActivityWildlife',
  quad_outing: 'smaraDiscoveryActivityQuad',
  photography: 'smaraDiscoveryActivityPhotography',
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-300">{label}</p>
      <p className="mt-1 text-sm text-primary-600">{value || '-'}</p>
    </div>
  )
}

function AdminSmaraDiscoveryRegistrationsPage() {
  const { t, i18n } = useTranslation()
  const { role } = useUser()
  const [search, setSearch] = useState('')
  const [interestFilter, setInterestFilter] = useState('all')
  const [notifyFilter, setNotifyFilter] = useState('all')
  const [visitedFilter, setVisitedFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const [deletePending, setDeletePending] = useState(null)

  const filters = useMemo(
    () => ({
      search: search || undefined,
      interest_level: interestFilter === 'all' ? undefined : interestFilter,
      notify_first_date: notifyFilter === 'all' ? undefined : notifyFilter === 'yes',
      has_visited_es_smara: visitedFilter === 'all' ? undefined : visitedFilter === 'yes',
      page,
      per_page: 15,
    }),
    [search, interestFilter, notifyFilter, visitedFilter, page],
  )

  const { listQuery, deleteMutation } = useAdminSmaraDiscoveryRegistrations(filters)
  const list = listQuery.data?.data || []
  const currentPage = listQuery.data?.meta?.current_page || listQuery.data?.current_page || 1
  const lastPage = listQuery.data?.meta?.last_page || listQuery.data?.last_page || 1

  const formatInterest = (value) => (interestLabels[value] ? t(interestLabels[value]) : value)
  const formatDuration = (value) => (durationLabels[value] ? t(durationLabels[value]) : value)
  const formatAgeGroup = (value) => (ageGroupLabels[value] ? t(ageGroupLabels[value]) : value)
  const formatParticipants = (value) => (participantsLabels[value] ? t(participantsLabels[value]) : value)
  const formatActivities = (activities = []) =>
    activities.map((activity) => (activityLabels[activity] ? t(activityLabels[activity]) : activity)).join(', ')

  const handleDelete = async () => {
    if (!deletePending) return
    await deleteMutation.mutateAsync(deletePending.id)
    setDeletePending(null)
    if (selectedItem?.id === deletePending.id) {
      setSelectedItem(null)
    }
  }

  return (
    <section className="w-full space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-8 shadow-md">
        <h2 className="text-2xl font-black text-primary-500">{t('smaraDiscoveryAdminTitle')}</h2>
        <p className="mt-1 text-sm text-primary-400">{t('smaraDiscoveryAdminSubtitle')}</p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder={t('smaraDiscoveryAdminSearch')}
            className="w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-primary-500 shadow-sm outline-none transition focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20"
          />

          <select
            value={interestFilter}
            onChange={(event) => {
              setInterestFilter(event.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-primary-500"
          >
            <option value="all">{t('smaraDiscoveryAdminFilterInterest')} — {t('smaraDiscoveryAdminAll')}</option>
            <option value="certainly">{t('smaraDiscoveryInterestCertainly')}</option>
            <option value="probably">{t('smaraDiscoveryInterestProbably')}</option>
            <option value="maybe">{t('smaraDiscoveryInterestMaybe')}</option>
          </select>

          <select
            value={notifyFilter}
            onChange={(event) => {
              setNotifyFilter(event.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-primary-500"
          >
            <option value="all">{t('smaraDiscoveryAdminFilterNotify')} — {t('smaraDiscoveryAdminAll')}</option>
            <option value="yes">{t('smaraDiscoveryYes')}</option>
            <option value="no">{t('smaraDiscoveryNo')}</option>
          </select>

          <select
            value={visitedFilter}
            onChange={(event) => {
              setVisitedFilter(event.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-primary-500"
          >
            <option value="all">{t('smaraDiscoveryAdminFilterVisited')} — {t('smaraDiscoveryAdminAll')}</option>
            <option value="yes">{t('smaraDiscoveryYes')}</option>
            <option value="no">{t('smaraDiscoveryNo')}</option>
          </select>
        </div>
      </div>

      {listQuery.isLoading ? <LoadingState /> : null}
      {listQuery.isError ? <ErrorState error={listQuery.error} /> : null}

      {!listQuery.isLoading && !listQuery.isError ? (
        <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                <tr>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColName')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColContact')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColCity')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColInterest')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColParticipants')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColDuration')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColPriority')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColDate')}</th>
                  <th className="px-4 py-3">{t('smaraDiscoveryAdminColActions')}</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-primary-400">
                      {t('smaraDiscoveryAdminNoResults')}
                    </td>
                  </tr>
                ) : (
                  list.map((item) => (
                    <tr key={item.id} className="border-t border-primary-100 hover:bg-primary-50/60">
                      <td className="px-4 py-3 font-medium text-primary-600">{item.full_name}</td>
                      <td className="px-4 py-3">
                        <p>{item.email}</p>
                        <p className="text-xs text-primary-400">{item.phone}</p>
                      </td>
                      <td className="px-4 py-3">{item.city}</td>
                      <td className="px-4 py-3">{formatInterest(item.interest_level)}</td>
                      <td className="px-4 py-3">{formatParticipants(item.participants_count)}</td>
                      <td className="px-4 py-3">{formatDuration(item.preferred_duration)}</td>
                      <td className="px-4 py-3">
                        {item.notify_first_date ? t('smaraDiscoveryYes') : t('smaraDiscoveryNo')}
                      </td>
                      <td className="px-4 py-3">{formatDateLabel(item.created_at, i18n.language)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
                          >
                            {t('smaraDiscoveryAdminDetail')}
                          </button>
                          {role === ADMIN_ROLE ? (
                            <button
                              type="button"
                              onClick={() => setDeletePending({ id: item.id, name: item.full_name })}
                              className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                            >
                              {t('smaraDiscoveryAdminDelete')}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {lastPage > 1 ? (
            <div className="flex items-center justify-between border-t border-primary-100 px-4 py-3">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:opacity-50"
              >
                {t('prev')}
              </button>
              <p className="text-xs text-primary-400">
                {currentPage} / {lastPage}
              </p>
              <button
                type="button"
                disabled={currentPage >= lastPage}
                onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:opacity-50"
              >
                {t('next')}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {selectedItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-primary-500">{t('smaraDiscoveryAdminDetail')}</h3>
                <p className="text-sm text-primary-400">{selectedItem.full_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg border border-primary-200 px-3 py-1 text-sm text-primary-500"
                aria-label={t('smaraDiscoveryAdminClose')}
              >
                ×
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <DetailRow label={t('smaraDiscoveryFullName')} value={selectedItem.full_name} />
              <DetailRow label={t('smaraDiscoveryResidenceCity')} value={selectedItem.city} />
              <DetailRow label={t('smaraDiscoveryEmail')} value={selectedItem.email} />
              <DetailRow label={t('smaraDiscoveryPhone')} value={selectedItem.phone} />
              <DetailRow label={t('smaraDiscoveryAgeGroup')} value={formatAgeGroup(selectedItem.age_group)} />
              <DetailRow
                label={t('smaraDiscoveryVisited')}
                value={selectedItem.has_visited_es_smara ? t('smaraDiscoveryYes') : t('smaraDiscoveryNo')}
              />
              <DetailRow label={t('smaraDiscoveryInterest')} value={formatInterest(selectedItem.interest_level)} />
              <DetailRow label={t('smaraDiscoveryParticipants')} value={formatParticipants(selectedItem.participants_count)} />
              <DetailRow label={t('smaraDiscoveryDuration')} value={formatDuration(selectedItem.preferred_duration)} />
              <DetailRow
                label={t('smaraDiscoveryNotify')}
                value={selectedItem.notify_first_date ? t('smaraDiscoveryYes') : t('smaraDiscoveryNo')}
              />
              <DetailRow
                label={t('smaraDiscoveryActivitiesField')}
                value={formatActivities(selectedItem.preferred_activities)}
                className="md:col-span-2"
              />
              <DetailRow
                label={t('smaraDiscoveryAdminCreatedAt')}
                value={formatDateLabel(selectedItem.created_at, i18n.language)}
              />
            </div>
          </div>
        </div>
      ) : null}

      <DeleteConfirmModal
        isOpen={Boolean(deletePending)}
        title={t('smaraDiscoveryAdminDeleteConfirm')}
        itemName={deletePending?.name}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeletePending(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}

export default AdminSmaraDiscoveryRegistrationsPage
