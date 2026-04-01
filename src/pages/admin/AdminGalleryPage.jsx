import { useRef, useState } from 'react'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import { useAdminGalleryCRUD } from '../../hooks/useAdminGalleryCRUD'

const resolveUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  const base =
    (import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8000/api`).replace(
      /\/api\/?$/,
      '',
    )
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`
}

function AdminGalleryPage() {
  const [page, setPage] = useState(1)
  const { galleryQuery, uploadMutation, deleteMutation } = useAdminGalleryCRUD(page)
  const fileInputRef = useRef(null)

  const payload = galleryQuery.data ?? {}
  const images = Array.isArray(payload.data) ? payload.data : []
  const lastPage = payload.last_page ?? 1

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    await uploadMutation.mutateAsync(files)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette image ?')) return
    await deleteMutation.mutateAsync(id)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-500">Galerie</h1>

        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition ${
            uploadMutation.isPending
              ? 'bg-secondary-400 cursor-wait'
              : 'bg-secondary-500 hover:bg-secondary-600'
          }`}
        >
          {uploadMutation.isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Compression en cours…
            </>
          ) : (
            '+ Ajouter des images'
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploadMutation.isPending}
          />
        </label>
      </div>

      {uploadMutation.isError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {uploadMutation.error?.message || 'Erreur lors de l\'upload.'}
        </div>
      )}

      {galleryQuery.isLoading ? <LoadingState /> : null}
      {galleryQuery.isError ? <ErrorState message={galleryQuery.error?.message} /> : null}

      {!galleryQuery.isLoading && !galleryQuery.isError && (
        <>
          {images.length === 0 ? (
            <p className="text-primary-400">Aucune image dans la galerie.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-xl border border-primary-100 bg-white shadow-sm">
                  <img
                    src={resolveUrl(img.url)}
                    alt={img.filename}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    disabled={deleteMutation.isPending}
                    className="absolute right-2 top-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600 disabled:opacity-50"
                    title="Supprimer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <div className="p-2">
                    <p className="truncate text-xs text-primary-400">{img.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {lastPage > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-primary-200 px-3 py-1.5 text-sm font-medium text-primary-500 transition hover:bg-primary-50 disabled:opacity-40"
              >
                ← Précédent
              </button>
              <span className="text-sm text-primary-400">
                {page} / {lastPage}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="rounded-lg border border-primary-200 px-3 py-1.5 text-sm font-medium text-primary-500 transition hover:bg-primary-50 disabled:opacity-40"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminGalleryPage
