import { AnimatePresence, motion } from 'framer-motion'

export default function MobileSheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[110] md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[111] md:hidden bg-white dark:bg-[#090D16] rounded-t-2xl shadow-2xl border-t border-x border-slate-200 dark:border-slate-800 max-h-[80vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div className="pt-2.5 pb-1 flex justify-center shrink-0">
              <span className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            {title && (
              <div className="px-5 pb-2 pt-1 shrink-0">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">{title}</h3>
              </div>
            )}
            <div
              className="overflow-y-auto scrollbar-thin overscroll-contain px-4"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
