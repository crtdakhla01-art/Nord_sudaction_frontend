import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../../components/ErrorState'
import InputField from '../../components/InputField'
import LoadingState from '../../components/LoadingState'
import RichTextEditor from '../../components/RichTextEditor'
import TextareaField from '../../components/TextareaField'
import { getImageUrl } from '../../api/client'
import { useAdminPostsCRUD } from '../../hooks/useAdminPostsCRUD'
import { formatDateLabel, toDateInputValue } from '../../utils/date'

const initialValues = {
  title: '',
  description: '',
  content: '',
  external_link: '',
  status: 'draft',
  is_featured: false,
  published_at: '',
  media: null,
}

function AdminPostsPage() {
  const [values, setValues] = useState(initialValues)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filters = useMemo(
    () => ({
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      per_page: 10,
    }),
    [search, statusFilter, page],
  )

  const { postsQuery, createMutation, updateMutation, deleteMutation } = useAdminPostsCRUD(filters)
  const saveMutation = editingId ? updateMutation : createMutation

  const list = postsQuery.data?.data || []
  const currentPage = postsQuery.data?.current_page || 1
  const lastPage = postsQuery.data?.last_page || 1

  const onChange = (event) => {
    const { name, value, type, checked, files } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value,
    }))
  }

  const onEdit = (item) => {
    setEditingId(item.id)
    setValues({
      title: item.title || '',
      description: item.description || '',
      content: item.content || '',
      external_link: item.external_link || '',
      status: item.status || 'draft',
      is_featured: Boolean(item.is_featured),
      published_at: toDateInputValue(item.published_at),
      media: null,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setValues(initialValues)
  }

  const onSubmit = async (event) => {
    event.preventDefault()

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
          <h2 className="text-2xl font-black text-primary-500">News Management</h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="cursor-pointer rounded-xl border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
            >
              Cancel edit
            </button>
          ) : null}
        </div>

        <InputField label="Title" name="title" value={values.title} onChange={onChange} required />
        <TextareaField label="Description" name="description" rows={3} value={values.description} onChange={onChange} />
        <RichTextEditor label="Content" value={values.content} onChange={(content) => setValues((prev) => ({ ...prev, content }))} />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block text-sm font-medium text-primary-500">
            <span>Status</span>
            <select
              className="mt-2 block w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-primary-500 shadow-sm outline-none transition focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20"
              name="status"
              value={values.status}
              onChange={onChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="External link"
            name="external_link"
            value={values.external_link}
            onChange={onChange}
          />
          <InputField label="Publish date" type="date" name="published_at" value={values.published_at} onChange={onChange} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField label="Media" type="file" name="media" accept="image/*,video/*" onChange={onChange} />

          <label className="inline-flex items-center gap-3 text-sm font-medium text-primary-500">
            <input
              type="checkbox"
              name="is_featured"
              checked={values.is_featured}
              onChange={onChange}
              className="h-4 w-4 rounded border-primary-300 text-secondary-500 focus:ring-secondary-500"
            />
            Featured post
          </label>
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
          className="cursor-pointer rounded-xl bg-secondary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-600"
        >
          {saveMutation.isPending ? 'Saving...' : editingId ? 'Update post' : 'Create post'}
        </button>
      </form>

      <div className="w-full rounded-2xl border border-primary-100 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField label="Search" name="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />

          <label className="block text-sm font-medium text-primary-500">
            <span>Status filter</span>
            <select
              className="mt-2 block w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-primary-500 shadow-sm outline-none"
              value={statusFilter}
              onChange={(event) => { setStatusFilter(event.target.value); setPage(1) }}
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
      </div>

      {postsQuery.isLoading ? <LoadingState /> : null}
      {postsQuery.isError ? <ErrorState message={postsQuery.error?.message} /> : null}

      {!postsQuery.isLoading && !postsQuery.isError ? (
        <div className="space-y-4">
          {list.length === 0 ? (
            <p className="rounded-2xl border border-primary-100 bg-white px-4 py-5 text-sm text-primary-400 shadow-md">
              No posts found.
            </p>
          ) : null}

          {list.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-50">
                  {item.media ? (
                    /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(item.media) ? (
                      <video src={getImageUrl(item.media)} className="h-full w-full object-cover" muted />
                    ) : (
                      <img src={getImageUrl(item.media)} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                    )
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">NSA</span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-primary-500">{item.title}</h3>
                  <p className="mt-1 text-xs uppercase text-secondary-500">{item.status}</p>
                  <p className="mt-1 text-sm text-primary-400">{item.description}</p>
                  <p className="mt-2 text-xs text-primary-400">{formatDateLabel(item.published_at || item.created_at, 'fr')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/actualites/${item.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer rounded-lg border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
                >
                  Preview
                </Link>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="cursor-pointer rounded-lg border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:border-secondary-300 hover:text-secondary-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer rounded-lg bg-secondary-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-secondary-600"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="cursor-pointer rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs font-semibold text-primary-400">{currentPage} / {lastPage}</span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
              disabled={currentPage >= lastPage}
              className="cursor-pointer rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default AdminPostsPage
