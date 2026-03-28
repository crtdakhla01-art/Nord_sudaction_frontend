import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorState from '../../components/ErrorState'
import InputField from '../../components/InputField'
import LoadingState from '../../components/LoadingState'
import { getImageUrl } from '../../api/client'
import { useAdvertisementsCRUD } from '../../hooks/useAdvertisementsCRUD'
import { formatDateLabel } from '../../utils/date'

const createInitialValues = () => ({
  image: null,
  existingImage: '',
  link: '',
  begin_date: '',
  end_date: '',
})

const isActiveNow = (item) => {
  const now = new Date()
  const begin = new Date(item.begin_date)
  const end = new Date(item.end_date)

  if (Number.isNaN(begin.getTime()) || Number.isNaN(end.getTime())) {
    return false
  }

  begin.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return begin <= now && now <= end
}

function AdminAdvertisementsPage() {
  const { t, i18n } = useTranslation()
  const [values, setValues] = useState(createInitialValues)
  const [editingId, setEditingId] = useState(null)
  const { advertisementsQuery, createMutation, updateMutation, deleteMutation } = useAdvertisementsCRUD()

  const saveMutation = editingId ? updateMutation : createMutation
  const ads = useMemo(() => advertisementsQuery.data || [], [advertisementsQuery.data])

  const onChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const onFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setValues((prev) => ({
      ...prev,
      image: file,
      existingImage: file ? '' : prev.existingImage,
    }))
  }

  const resetForm = () => {
    setEditingId(null)
    setValues(createInitialValues())
  }

  const onEdit = (ad) => {
    setEditingId(ad.id)
    setValues({
      image: null,
      existingImage: ad.image || '',
      link: ad.link || '',
      begin_date: ad.begin_date,
      end_date: ad.end_date,
    })
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!editingId && !values.image) {
      return
    }

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, values })
    } else {
      await createMutation.mutateAsync(values)
    }

    resetForm()
  }

  return (
    <section className="w-full space-y-6">
      <form className="w-full space-y-6 rounded-2xl border border-primary-100 bg-white p-8 shadow-md" onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-primary-500">{t('adsManagement')}</h2>
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

        <label className="block text-sm font-medium text-primary-500">
          <span>{t('adImage')}</span>
          <input
            className="mt-2 block min-h-12 w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-primary-500 shadow-sm outline-none transition-all duration-300 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            required={!editingId}
          />
          {values.image ? <span className="mt-2 block text-xs text-primary-400">{t('selectedFile')}: {values.image.name}</span> : null}
          {!values.image && values.existingImage ? (
            <span className="mt-2 block text-xs text-primary-400">{t('currentFile')}: {values.existingImage.split('/').pop()}</span>
          ) : null}
        </label>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <InputField label={t('adLink')} name="link" value={values.link} onChange={onChange} />
          <InputField label={t('adBeginDate')} type="date" name="begin_date" value={values.begin_date} onChange={onChange} required />
          <InputField label={t('adEndDate')} type="date" name="end_date" value={values.end_date} onChange={onChange} required />
        </div>

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

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="rounded-xl bg-secondary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-600"
        >
          {saveMutation.isPending ? t('saving') : editingId ? t('updateAd') : t('createAd')}
        </button>
      </form>

      {advertisementsQuery.isLoading ? <LoadingState /> : null}
      {advertisementsQuery.isError ? <ErrorState message={advertisementsQuery.error?.message} /> : null}

      {!advertisementsQuery.isLoading && !advertisementsQuery.isError ? (
        <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-md">
          <table className="w-full min-w-[700px] table-fixed border-collapse">
            <thead className="bg-primary-50 text-left text-xs uppercase tracking-wide text-primary-400">
              <tr>
                <th className="px-4 py-3">{t('adImage')}</th>
                <th className="px-4 py-3">{t('adLink')}</th>
                <th className="px-4 py-3">{t('adBeginDate')}</th>
                <th className="px-4 py-3">{t('adEndDate')}</th>
                <th className="px-4 py-3">{t('status')}</th>
                <th className="px-4 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((item) => {
                const active = isActiveNow(item)

                return (
                  <tr key={item.id} className={`border-t border-primary-100 ${active ? 'bg-[#eef2ff]' : 'bg-white'}`}>
                    <td className="px-4 py-4">
                      <img src={getImageUrl(item.image)} alt="Advertisement" className="h-20 w-[140px] rounded-lg object-cover" />
                    </td>
                    <td className="px-4 py-4 text-sm text-primary-500">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="font-semibold text-[#2563EB] hover:text-blue-700">
                          {t('openLink')}
                        </a>
                      ) : (
                        <span className="text-primary-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-primary-500">{formatDateLabel(item.begin_date, i18n.language)}</td>
                    <td className="px-4 py-4 text-sm text-primary-500">{formatDateLabel(item.end_date, i18n.language)}</td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      <span className={`rounded-full px-3 py-1 text-xs ${active ? 'bg-[#4F46E5] text-white' : 'bg-primary-100 text-primary-500'}`}>
                        {active ? t('activeAd') : t('inactiveAd')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-lg border border-primary-200 px-3 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
                        >
                          {t('edit')}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg bg-secondary-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-secondary-600"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {ads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-sm text-primary-400">
                    {t('noAdvertisementsFound')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default AdminAdvertisementsPage
