import { Skeleton } from '@/components/ui'
import { layout } from '@/lib/layout'

export default function DashboardSkeleton() {
  return (
    <div
      aria-label="Loading dashboard"
      role="status"
      className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900"
    >
      {/* Sidebar Skeleton (desktop) */}
      <div className="hidden md:flex flex-col items-center py-4 px-3 bg-chrome shrink-0 border-r border-white/[0.04] w-16 justify-between">
        <div className="flex flex-col items-center gap-6 w-full">
          <Skeleton className="w-10 h-10 rounded-xl bg-white/10" />
          <div className="flex flex-col items-center gap-3 w-full">
            <Skeleton className="w-9 h-9 rounded-lg bg-white/10" />
            <Skeleton className="w-9 h-9 rounded-lg bg-white/10" />
            <Skeleton className="w-9 h-9 rounded-lg bg-white/10" />
            <Skeleton className="w-9 h-9 rounded-lg bg-white/10" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
      </div>

      {/* Main Content Column */}
      <div className={layout.mainColumn}>
        {/* TopBar Skeleton */}
        <header className={layout.topBar}>
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded-md md:hidden" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-full md:hidden" />
          </div>
        </header>

        {/* Page Body */}
        <div className={`flex-1 min-h-0 flex flex-col ${layout.pageGutter} pt-3 sm:pt-4`}>
          <div className={layout.containerWide}>
            {/* Controls Bar Skeleton */}
            <div className="flex items-center justify-between w-full gap-2 mb-3">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>

            {/* Stat Strip Skeleton */}
            <div className="grid grid-cols-4 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-surface/80 backdrop-blur-sm p-2.5 sm:p-3.5 gap-2 sm:gap-4 mb-3 sm:mb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5 px-1 sm:px-2">
                  <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-20" />
                  <Skeleton className="h-4 sm:h-7 w-10 sm:w-16" />
                </div>
              ))}
            </div>

            {/* Board Filter Toolbar Skeleton */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <Skeleton className="h-9 w-48 sm:w-72 rounded-xl" />
              <div className="hidden sm:flex items-center gap-2">
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>

            {/* Desktop Kanban Columns Skeleton */}
            <div className="hidden md:grid md:grid-cols-5 gap-3 flex-1 min-h-0 pb-4">
              {[3, 2, 2, 1, 1].map((cardCount, colIdx) => (
                <div
                  key={colIdx}
                  className="flex flex-col min-h-0 border-x border-slate-200/50 dark:border-slate-700/30 bg-white/40 dark:bg-slate-900/30 rounded-b-lg p-2 space-y-2.5 overflow-hidden"
                >
                  <Skeleton className="h-8 w-full rounded-lg" />
                  {[...Array(cardCount)].map((_, cardIdx) => (
                    <div
                      key={cardIdx}
                      className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-surface/90 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-3.5 w-3/4" />
                          <Skeleton className="h-2.5 w-1/2" />
                        </div>
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <Skeleton className="h-4 w-14 rounded-full" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Mobile Column Skeleton */}
            <div className="flex flex-col flex-1 min-h-0 md:hidden pb-4 space-y-2.5">
              <div className="flex gap-1.5 overflow-hidden pb-1">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full shrink-0" />
                ))}
              </div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-surface/90 shadow-xs space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-2.5 w-1/3" />
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

