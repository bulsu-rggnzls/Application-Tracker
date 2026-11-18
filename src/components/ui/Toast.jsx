import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { IconButton } from '@/components/ui'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const STYLES = {
  success: 'border-emerald-500/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200',
  error: 'border-rose-500/30 bg-rose-50 text-rose-900 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200',
  info: 'border-indigo-500/30 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/80 dark:border-indigo-800 dark:text-indigo-200',
}

const ICON_STYLES = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-rose-600 dark:text-rose-400',
  info: 'text-indigo-600 dark:text-indigo-400',
}

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast || !onClose) return
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const IconComponent = ICONS[toast.type] || Info
  const colorCls = STYLES[toast.type] || STYLES.info
  const iconCls = ICON_STYLES[toast.type] || ICON_STYLES.info

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none flex flex-col items-end">
      <AnimatePresence>
        <motion.div
          key={toast.id || toast.message}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md max-w-md ${colorCls}`}
          role="status"
          aria-live="polite"
        >
          <IconComponent size={18} className={`shrink-0 ${iconCls}`} />
          <p className="text-xs sm:text-sm font-medium leading-tight flex-1">
            {toast.message}
          </p>
          {onClose && (
            <IconButton
              type="button"
              onClick={onClose}
              aria-label="Close notification"
              className="!p-1 hover:!bg-black/5 dark:hover:!bg-white/10 shrink-0"
            >
              <X size={14} />
            </IconButton>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
