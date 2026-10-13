import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** Silme gibi geri alınamaz işlemlerden önce onay ister */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Evet, sil',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="card animate-pop-in w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-3xl">🗑️</div>
        <h2 id="confirm-title" className="text-xl font-bold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink-700">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button ref={cancelRef} type="button" className="btn-secondary" onClick={onCancel}>
            Vazgeç
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
