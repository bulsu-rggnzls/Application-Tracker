import { useState } from 'react'
import { X, LogOut, Loader2 } from 'lucide-react'

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in" onClick={e => e.stopPropagation()}>

        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-100/60 dark:border-violet-800/40">
            <LogOut size={18} />
          </div>

          <div className="pt-0.5 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Sign out</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-normal">
              Are you sure you want to sign out of your account?
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-70 inline-flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  )
}
