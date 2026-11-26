import { useState } from 'react'
import { X, LogOut, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, IconButton, Heading, Text } from '@/components/ui'

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50"
            onClick={loading ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
            className="relative z-10 w-full max-w-sm bg-surface border border-border p-6 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
