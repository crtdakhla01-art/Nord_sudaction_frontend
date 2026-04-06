import { useState } from 'react'
import ErrorState from '../../components/ErrorState'
import InputField from '../../components/InputField'
import LoadingState from '../../components/LoadingState'
import { useActivitiesCRUD } from '../../hooks/useActivitiesCRUD'
import usePreventDoubleSubmit from '../../hooks/usePreventDoubleSubmit'
import { getImageUrl } from '../../api/client'

const emptyValues = { title: '', link: '', image: '' }

function ActivityModal({ values, onChange, onImageChange, imageFile, onSubmit, onClose, isPending, errors }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-lg font-bold text-primary-500">
          {values.id ? 'Modifier l\'activité' : 'Ajouter une activité'}
        </h2>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <InputField
            label="Titre"
            name="title"
            value={values.title}
            onChange={onChange}
            error={errors.title}
            required
          />
          <InputField
            label="Lien (URL)"
            name="link"
            type="url"
            value={values.link}
            onChange={onChange}
            error={errors.link}
            required
          />
          <div>
            <label className="mb-1 block text-sm font-semibold text-primary-500">
              Image <span className="font-normal text-primary-300">(optionnel)</span>
            </label>
            {values.image && !imageFile ? (
              <img
                src={getImageUrl(values.image)}
                alt="Aperçu actuel"
                className="mb-2 h-24 w-full rounded-lg object-cover"
              />
            ) : null}
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Aperçu"
                className="mb-2 h-24 w-full rounded-lg object-cover"
              />
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="w-full text-sm text-primary-400"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-500 transition hover:bg-primary-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-secondary-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600 disabled:opacity-50"
            >
              {isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdminActivitiesPage() {
  const { activitiesQuery, createMutation, updateMutation, deleteMutation } = useActivitiesCRUD()
  const [modalOpen, setModalOpen] = useState(false)
  const [formValues, setFormValues] = useState(emptyValues)
  const [formErrors, setFormErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)

  const saveMutation = formValues.id ? updateMutation : createMutation
  const activities = activitiesQuery.data || []

  const validate = () => {
    const errs = {}
    if (!formValues.title.trim()) errs.title = 'Ce champ est requis.'
    if (!formValues.link.trim()) {
      errs.link = 'Ce champ est requis.'
    } else {
      try {
        new URL(formValues.link)
      } catch {
        errs.link = 'Veuillez entrer une URL valide.'
      }
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const { wrap } = usePreventDoubleSubmit()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = wrap(async (e) => {
    e.preventDefault()
    if (!validate()) return

    if (formValues.id) {
      const fd = new FormData()
      fd.append('title', formValues.title)
      fd.append('link', formValues.link)
      if (imageFile) fd.append('image', imageFile)
      await updateMutation.mutateAsync({ id: formValues.id, formData: fd })
    } else {
      const fd = new FormData()
      fd.append('title', formValues.title)
      fd.append('link', formValues.link)
      if (imageFile) fd.append('image', imageFile)
      await createMutation.mutateAsync(fd)
    }

    setModalOpen(false)
    setFormValues(emptyValues)
    setImageFile(null)
    setFormErrors({})
  })

  const openAdd = () => {
    setFormValues(emptyValues)
    setFormErrors({})
    setImageFile(null)
    setModalOpen(true)
  }

  const openEdit = (activity) => {
    setFormValues({ id: activity.id, title: activity.title, link: activity.link, image: activity.image || '' })
    setFormErrors({})
    setImageFile(null)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette activité ?')) return
    await deleteMutation.mutateAsync(id)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-500">Médias</h1>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-xl bg-secondary-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary-600"
        >
          + Ajouter une activité
        </button>
      </div>

      {activitiesQuery.isLoading ? <LoadingState /> : null}
      {activitiesQuery.isError ? (
        <ErrorState message={activitiesQuery.error?.message} />
      ) : null}

      {!activitiesQuery.isLoading && !activitiesQuery.isError ? (
        activities.length === 0 ? (
          <p className="text-primary-400">Aucune activité disponible.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-primary-100 bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Titre</th>
                  <th className="px-5 py-3 text-left font-semibold">Image</th>
                  <th className="px-5 py-3 text-left font-semibold">Lien</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary-500">{activity.title}</td>
                    <td className="px-5 py-4">
                      {activity.image ? (
                        <img
                          src={getImageUrl(activity.image)}
                          alt={activity.title}
                          className="h-10 w-16 rounded object-cover"
                        />
                      ) : (
                        <span className="text-xs text-primary-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate">
                      <a
                        href={activity.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary-500 hover:underline"
                      >
                        {activity.link}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(activity)}
                          className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 transition hover:border-primary-300 hover:bg-primary-50"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(activity.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}

      {saveMutation.isError ? (
        <div className="mt-4">
          <ErrorState message={saveMutation.error?.message} />
        </div>
      ) : null}

      {modalOpen ? (
        <ActivityModal
          values={formValues}
          onChange={handleChange}
          onImageChange={(e) => setImageFile(e.target.files[0] || null)}
          imageFile={imageFile}
          onSubmit={handleSubmit}
          onClose={() => { setModalOpen(false); setImageFile(null) }}
          isPending={saveMutation.isPending}
          errors={formErrors}
        />
      ) : null}
    </div>
  )
}

export default AdminActivitiesPage
