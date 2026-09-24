import { useState } from 'react'
import { X, LogOut, Loader2 } from 'lucide-react'
import { Button, IconButton, Heading, Text } from '@/components/ui'

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
  }

  return (
    <div className="modal-overlay backdrop-blur-sm" onClick={onClose}>
      <div className="modal-shell relative w-full max-w-sm p-6 animate-fade-in" onClick={e => e.stopPropagation()}>

        <IconButton
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 !rounded-lg !p-1 dark:hover:!bg-slate-800 disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={16} />
        </IconButton>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-100/60 dark:border-violet-800/40">
            <LogOut size={18} />
          </div>

          <div className="pt-0.5 min-w-0">
            <Heading size="sm">Sign out</Heading>
            <Text className="mt-1 !text-slate-500 dark:!text-slate-400 leading-normal">
              Are you sure you want to sign out of your account?
            </Text>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 !text-white dark:!bg-slate-900 dark:hover:!bg-slate-800 !rounded-lg shadow-sm !transition-ui active:scale-[0.98] disabled:opacity-70 inline-flex gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </div>
    </div>
  )
}
