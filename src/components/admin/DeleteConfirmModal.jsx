import { useEffect } from 'react'

/**
 * Reusable delete confirmation modal.
 *
 * Props:
 *  - isOpen       {boolean}   - whether the modal is visible
 *  - onCancel     {function}  - called when user clicks "Cancel" or overlay
 *  - onConfirm    {function}  - called when user confirms deletion
 *  - isPending    {boolean}   - disables buttons while mutation is running
 *  - title        {string}    - modal heading (e.g. "Delete category?")
 *  - description  {string}    - body text explaining consequences
 *  - itemName     {string?}   - optional name of the item being deleted
 */
export default function DeleteConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  isPending = false,
  title = 'Confirmer la suppression',
  description = 'Cette action est irréversible.',
  itemName,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-primary-100 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-primary-600">{title}</h3>

        {/* Item name badge */}
        {itemName && (
          <p className="mb-3 inline-block rounded-lg bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-500">
            « {itemName} »
          </p>
        )}

        {/* Description */}
        <p className="mb-6 text-sm text-primary-400">{description}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-xl border border-primary-200 px-5 py-2 text-sm font-semibold text-primary-500 transition hover:bg-primary-50 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {isPending && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  )
}
