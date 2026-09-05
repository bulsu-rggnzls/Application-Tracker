import { motion } from 'framer-motion'

export default function WelcomeEmpty({
  icon: Icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={compact ? 'py-10' : 'py-16'}
    >
      <div className={`mx-auto text-center px-6 ${compact ? 'max-w-sm' : 'max-w-md'}`}>
        <div className={`mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center ${compact ? 'w-11 h-11' : 'w-14 h-14'}`}>
          {Icon && <Icon size={compact ? 20 : 26} />}
        </div>
        <h3 className={`font-bold text-slate-800 dark:text-slate-100 ${compact ? 'mt-3 text-sm' : 'mt-4 text-lg'}`}>
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
        {(actionLabel && onAction) || (secondaryLabel && onSecondaryAction) ? (
          <div className={`flex items-center justify-center gap-2.5 ${compact ? 'mt-4' : 'mt-5'}`}>
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-px cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${compact ? 'px-4 py-2' : 'px-5 py-2.5'}`}
              >
                {actionLabel}
              </button>
            )}
            {secondaryLabel && onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold bg-white dark:bg-slate-800 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-px cursor-pointer ${compact ? 'px-4 py-2' : 'px-5 py-2.5'}`}
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
