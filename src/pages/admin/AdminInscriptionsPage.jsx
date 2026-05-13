import { useMemo, useState } from 'react'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import { useAdminInscriptions } from '../../hooks/useAdminInscriptions'
import { useUpdateInscriptionPaymentStatus } from '../../hooks/useUpdateInscriptionPaymentStatus'

const profileLabels = {
  investisseur: 'Investisseur',
  entrepreneur: 'Entrepreneur',
  porteur_de_projet: 'Porteur de projet',
  chef_d_entreprise: 'Chef d\'entreprise',
  institutionnel: 'Institutionnel',
  media_presse: 'Média / Presse',
  autre: 'Autre',
}

const sectorLabels = {
  tourisme: 'Tourisme',
  hotellerie_bivouacs: 'Hôtellerie & bivouacs',
  evenementiel: 'Événementiel',
  immobilier: 'Immobilier',
  artisanat: 'Artisanat',
  commerce: 'Commerce',
  services: 'Services',
  autre: 'Autre',
}

const activityLabels = {
  conferences_networking: 'Conférences & networking',
  excursion_desert: 'Excursion désert',
  soiree_bivouac: 'Soirée bivouac',
  observation_astronomique: 'Observation astronomique',
}

function normalizeList(values, labelsMap, fallbackValue) {
  const safeValues = Array.isArray(values) ? values : []
  const mapped = safeValues.map((value) => labelsMap[value] || value)

  if (fallbackValue) {
    mapped.push(`Autre: ${fallbackValue}`)
  }

  return mapped.length > 0 ? mapped.join(', ') : '-'
}

function normalizeActivities(values) {
  const safeValues = Array.isArray(values) ? values : []
  const mapped = safeValues.map((value) => activityLabels[value] || value)
  return mapped.length > 0 ? mapped.join(', ') : '-'
}

function formatBirthDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString('fr-FR')
}

function ParticipantDetailsModal({ participant, onClose }) {
  if (!participant) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="participant-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-primary-100 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="participant-modal-title" className="text-xl font-black text-primary-500">
              {participant.full_name}
            </h3>
            <p className="mt-1 text-sm text-primary-400">Détails du participant</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-primary-200 px-3 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
          >
            Fermer
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">Informations personnelles</p>
            <p className="mt-2 text-sm text-primary-500"><span className="font-semibold">Nom:</span> {participant.full_name || '-'}</p>
            <p className="mt-1 text-sm text-primary-500"><span className="font-semibold">Date de naissance:</span> {formatBirthDate(participant.birth_date)}</p>
            <p className="mt-1 text-sm text-primary-500"><span className="font-semibold">Ville:</span> {participant.city || '-'}</p>
            <p className="mt-1 text-sm text-primary-500"><span className="font-semibold">Téléphone:</span> {participant.phone || '-'}</p>
            <p className="mt-1 text-sm text-primary-500"><span className="font-semibold">Email:</span> {participant.email || '-'}</p>
            <p className="mt-1 text-sm text-primary-500"><span className="font-semibold">Profession:</span> {participant.profession || '-'}</p>
            <p className="mt-1 text-sm text-primary-500"><span className="font-semibold">Organisation:</span> {participant.organization || '-'}</p>
          </div>

          <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">Profil et participation</p>
            <p className="mt-2 text-sm text-primary-500">
              <span className="font-semibold">Profil:</span> {normalizeList(participant.participant_profiles, profileLabels, participant.participant_profile_other)}
            </p>
            <p className="mt-1 text-sm text-primary-500">
              <span className="font-semibold">Intérêts:</span> {normalizeList(participant.investment_sectors, sectorLabels, participant.investment_sector_other)}
            </p>
            <p className="mt-1 text-sm text-primary-500">
              <span className="font-semibold">Activités:</span> {normalizeActivities(participant.confirmed_activities)}
            </p>
            <p className="mt-3 text-sm text-primary-500">
              <span className="font-semibold">Paiement:</span> {participant.is_paid ? 'Payé' : 'Non payé'}
            </p>
            <p className="mt-1 text-sm text-primary-500">
              <span className="font-semibold">Tarif:</span> {participant.participation_fee} DH
            </p>
            <p className="mt-1 text-sm text-primary-500">
              <span className="font-semibold">Conditions acceptées:</span> {participant.is_terms_accepted ? 'Oui' : 'Non'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminInscriptionsPage() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const { data, isLoading, isError, error } = useAdminInscriptions()
  const updatePaymentMutation = useUpdateInscriptionPaymentStatus()

  const items = useMemo(() => {
    const all = data || []

    if (filter === 'paid') {
      return all.filter((item) => item.is_paid)
    }

    if (filter === 'unpaid') {
      return all.filter((item) => !item.is_paid)
    }

    return all
  }, [data, filter])

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return items
    }

    return items.filter((item) => {
      const fullName = String(item.full_name || '').toLowerCase()
      const email = String(item.email || '').toLowerCase()
      const phone = String(item.phone || '').toLowerCase()

      return fullName.includes(query) || email.includes(query) || phone.includes(query)
    })
  }, [items, searchTerm])

  return (
    <section className="w-full space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-8 shadow-md">
        <h2 className="text-2xl font-black text-primary-500">Inscriptions</h2>
        <p className="mt-1 text-sm text-primary-400">Suivez les inscriptions et mettez à jour le statut de paiement.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase transition ${
              filter === 'all'
                ? 'bg-secondary-500 text-white'
                : 'border border-primary-200 bg-white text-primary-500 hover:border-secondary-300 hover:text-secondary-500'
            }`}
          >
            Tous
          </button>
          <button
            type="button"
            onClick={() => setFilter('paid')}
            className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase transition ${
              filter === 'paid'
                ? 'bg-secondary-500 text-white'
                : 'border border-primary-200 bg-white text-primary-500 hover:border-secondary-300 hover:text-secondary-500'
            }`}
          >
            Payés
          </button>
          <button
            type="button"
            onClick={() => setFilter('unpaid')}
            className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase transition ${
              filter === 'unpaid'
                ? 'bg-secondary-500 text-white'
                : 'border border-primary-200 bg-white text-primary-500 hover:border-secondary-300 hover:text-secondary-500'
            }`}
          >
            Non payés
          </button>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Rechercher par nom, email ou téléphone"
            className="w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-primary-500 shadow-sm outline-none transition focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20 md:max-w-md"
          />
        </div>
      </div>

      {isLoading ? <LoadingState /> : null}
      {isError ? <ErrorState error={error} /> : null}

      {!isLoading && !isError ? (
        <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Paiement</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-primary-400">
                      Aucune inscription trouvée.
                    </td>
                  </tr>
                ) : null}

                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-primary-100 align-top">
                    <td className="px-4 py-4 text-primary-500">
                      <button
                        type="button"
                        onClick={() => setSelectedParticipant(item)}
                        className="w-full cursor-pointer text-left"
                      >
                        <p className="font-bold text-primary-500 underline decoration-primary-300 underline-offset-2">{item.full_name}</p>
                        <p className="text-xs text-primary-400">{item.city || '-'}</p>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-primary-500">
                      <p>{item.email}</p>
                      <p>{item.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      {item.is_paid ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">Payé</span>
                      ) : (
                        <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold uppercase text-secondary-700">Non payé</span>
                      )}
                      <p className="mt-2 text-xs text-primary-400">
                        Tarif: {item.participation_fee} DH
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => updatePaymentMutation.mutate({ id: item.id, is_paid: !item.is_paid })}
                        disabled={updatePaymentMutation.isPending || item.is_paid}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${
                          item.is_paid
                            ? 'cursor-not-allowed bg-primary-300 opacity-60'
                            : 'cursor-pointer bg-primary-500 hover:bg-primary-600'
                        }`}
                      >
                        {item.is_paid ? 'Marquer non payé' : 'Marquer payé'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <ParticipantDetailsModal participant={selectedParticipant} onClose={() => setSelectedParticipant(null)} />
    </section>
  )
}

export default AdminInscriptionsPage
