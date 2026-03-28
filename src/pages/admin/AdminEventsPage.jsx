import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorState from '../../components/ErrorState'
import InputField from '../../components/InputField'
import LoadingState from '../../components/LoadingState'
import TextareaField from '../../components/TextareaField'
import { getImageUrl } from '../../api/client'
import { useEventsCRUD } from '../../hooks/useEventsCRUD'
import { formatDateLabel, toDateInputValue } from '../../utils/date'
import { createEmptyGalleryItem, getFeaturedGalleryMedia, getGalleryItems } from '../../utils/eventGallery'

const createInitialValues = () => ({
  title: '',
  description: '',
  date: '',
  location: '',
  is_it_passed: false,
  gallery: [createEmptyGalleryItem()],
})

function AdminEventsPage() {
  const { t, i18n } = useTranslation()
  const [values, setValues] = useState(createInitialValues)
  const [editingId, setEditingId] = useState(null)
  const { eventsQuery, createMutation, updateMutation, deleteMutation } = useEventsCRUD()

  const saveMutation = editingId ? updateMutation : createMutation

  const sortedEvents = useMemo(() => eventsQuery.data || [], [eventsQuery.data])

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const onGalleryChange = (index, field, value) => {
    setValues((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }))
  }

  const onGalleryFileChange = (index, field, file) => {
    setValues((prev) =>
      ({
        ...prev,
        gallery: prev.gallery.map((item, itemIndex) => {
          if (itemIndex !== index) {
            return item
          }

          return {
            ...item,
            [field]: file || null,
            [field === 'image' ? 'existingImage' : 'existingVedio']: file
              ? ''
              : item[field === 'image' ? 'existingImage' : 'existingVedio'],
          }
        }),
      }))
  }

  const addGalleryItem = () => {
    setValues((prev) => ({
      ...prev,
      gallery: [...prev.gallery, createEmptyGalleryItem()],
    }))
  }

  const removeGalleryItem = (index) => {
    setValues((prev) => ({
      ...prev,
      gallery: prev.gallery.length === 1 ? [createEmptyGalleryItem()] : prev.gallery.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const onEdit = (eventItem) => {
    setEditingId(eventItem.id)
    setValues({
      title: eventItem.title,
      description: eventItem.description,
      date: toDateInputValue(eventItem.date),
      location: eventItem.location,
      is_it_passed: Boolean(eventItem.is_it_passed),
      gallery: getGalleryItems(eventItem),
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setValues(createInitialValues())
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        values,
      })
    } else {
      await createMutation.mutateAsync(values)
    }

    resetForm()
  }

  return (
    <section className="w-full space-y-6">
      <form className="w-full space-y-6 rounded-2xl border border-primary-100 bg-white p-8 shadow-md" onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-primary-500">{t('eventsManagement')}</h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
            >
              {t('cancelEdit')}
            </button>
          ) : null}
        </div>

        <InputField label={t('formTitle')} name="title" value={values.title} onChange={onChange} />
        <TextareaField label={t('formDescription')} name="description" rows={4} value={values.description} onChange={onChange} />

        <div className="grid grid-cols-2 gap-5">
          <InputField label={t('cardDate')} type="date" name="date" value={values.date} onChange={onChange} />
          <InputField label={t('formLocation')} name="location" value={values.location} onChange={onChange} />
        </div>

        <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary-500">{t('gallerySection')}</h3>
            <button
              type="button"
              onClick={addGalleryItem}
              className="rounded-xl bg-accent-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-600"
            >
              {t('addGalleryItem')}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {values.gallery.map((galleryItem, index) => (
              <div key={`${editingId || 'new'}-${index}`} className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4">
                  <label className="block text-sm font-medium text-primary-500">
                    <span>{t('formImage')}</span>
                    <input
                      className="mt-2 block min-h-12 w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-primary-500 shadow-sm outline-none transition-all duration-300 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20"
                      type="file"
                      accept="image/*"
                      onChange={(event) => onGalleryFileChange(index, 'image', event.target.files?.[0] || null)}
                    />
                    {galleryItem.image ? (
                      <span className="mt-2 block text-xs text-primary-400">{t('selectedFile')}: {galleryItem.image.name}</span>
                    ) : null}
                    {!galleryItem.image && galleryItem.existingImage ? (
                      <span className="mt-2 block text-xs text-primary-400">{t('currentFile')}: {galleryItem.existingImage.split('/').pop()}</span>
                    ) : null}
                  </label>

                  <label className="block text-sm font-medium text-primary-500">
                    <span>{t('formVideo')}</span>
                    <input
                      className="mt-2 block min-h-12 w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-primary-500 shadow-sm outline-none transition-all duration-300 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20"
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={(event) => onGalleryFileChange(index, 'vedio', event.target.files?.[0] || null)}
                    />
                    {galleryItem.vedio ? (
                      <span className="mt-2 block text-xs text-primary-400">{t('selectedFile')}: {galleryItem.vedio.name}</span>
                    ) : null}
                    {!galleryItem.vedio && galleryItem.existingVedio ? (
                      <span className="mt-2 block text-xs text-primary-400">{t('currentFile')}: {galleryItem.existingVedio.split('/').pop()}</span>
                    ) : null}
                  </label>

                  <InputField
                    label={t('formLink')}
                    name={`gallery-link-${index}`}
                    value={galleryItem.link}
                    onChange={(event) => onGalleryChange(index, 'link', event.target.value)}
                  />

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="rounded-xl border border-primary-200 px-4 py-3 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
                    >
                      {t('removeGalleryItem')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <label className="inline-flex items-center gap-3 text-sm font-medium text-primary-500">
          <input
            type="checkbox"
            name="is_it_passed"
            checked={values.is_it_passed}
            onChange={onChange}
            className="h-4 w-4 rounded border-primary-300 text-secondary-500 focus:ring-secondary-500"
          />
          {t('eventPassed')}
        </label>

        {(createMutation.isError || updateMutation.isError) ? (
          <ErrorState
            message={
              createMutation.error?.response?.data?.message ||
              updateMutation.error?.response?.data?.message ||
              createMutation.error?.message ||
              updateMutation.error?.message
            }
          />
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-xl bg-secondary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-600"
          >
            {saveMutation.isPending ? t('saving') : editingId ? t('updateEvent') : t('createEvent')}
          </button>
        </div>
      </form>

      {eventsQuery.isLoading ? <LoadingState /> : null}
      {eventsQuery.isError ? <ErrorState message={eventsQuery.error?.message} /> : null}

      {!eventsQuery.isLoading && !eventsQuery.isError ? (
        <div className="grid grid-cols-2 gap-6">
          {sortedEvents.map((eventItem) => {
            const featuredMedia = getFeaturedGalleryMedia(eventItem)

            return (
            <article key={eventItem.id} className="flex min-h-[260px] flex-col justify-between rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
              <div className="flex gap-5">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-50">
                  {featuredMedia.type === 'image' ? (
                    <img
                      src={getImageUrl(featuredMedia.path)}
                      alt={eventItem.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}

                  {featuredMedia.type === 'video' ? (
                    <video src={getImageUrl(featuredMedia.path)} className="h-full w-full object-cover" controls preload="metadata" />
                  ) : null}

                  {!featuredMedia.type ? (
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary-300">NSA</span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-primary-500">{eventItem.title}</h3>
                  <p className="mt-1 text-sm text-primary-400">{eventItem.description}</p>
                  <p className="mt-2 text-xs font-semibold uppercase text-secondary-500">
                    {formatDateLabel(eventItem.date, i18n.language)} · {eventItem.location}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase text-primary-400">
                    {eventItem.is_it_passed ? t('passed') : t('upcoming')}
                  </p>

                  {featuredMedia.link ? (
                    <a
                      href={featuredMedia.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-xs font-semibold text-secondary-500 transition hover:text-secondary-600"
                    >
                      {t('openLink')}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(eventItem)}
                  className="rounded-lg border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
                >
                  {t('edit')}
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(eventItem.id)}
                  disabled={deleteMutation.isPending}
                  className="rounded-lg bg-secondary-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-secondary-600"
                >
                  {t('delete')}
                </button>
              </div>
            </article>
          )})}

          {sortedEvents.length === 0 ? (
            <p className="col-span-2 rounded-2xl border border-primary-100 bg-white px-4 py-5 text-sm text-primary-400 shadow-md">
              {t('noEventsFound')}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default AdminEventsPage
