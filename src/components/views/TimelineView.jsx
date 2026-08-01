import { useMemo, useState } from 'react'
import { History, CalendarCheck, XCircle, CheckCircle, PlusCircle, FileText } from 'lucide-react'
import getRelativeTime from '../../utils/getRelativeTime'

const actionConfig = {
  status_change: { icon: PlusCircle, dot: 'bg-indigo-500' },
  interview_scheduled: { icon: CalendarCheck, dot: 'bg-purple-500' },
  interview_completed: { icon: CheckCircle, dot: 'bg-emerald-500' },
  offer_accepted: { icon: CheckCircle, dot: 'bg-emerald-500' },
  offer_rejected: { icon: XCircle, dot: 'bg-rose-500' },
  note_added: { icon: FileText, dot: 'bg-amber-500' },
}

const actionLabels = {
  status_change: 'Status changed',
  interview_scheduled: 'Interview scheduled',
  interview_completed: 'Interview completed',
  offer_accepted: 'Offer accepted',
  offer_rejected: 'Offer rejected',
  note_added: 'Note added',
}

function dayKey(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function dayLabel(ts) {
  const d = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((today - that) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return getRelativeTime(ts)
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function TimelineView({ applications, onSelect }) {
  const [visibleCount, setVisibleCount] = useState(15)

  const entries = useMemo(() => {
    const all = []
    applications.forEach(app => {
      ;(app.activityLog || []).forEach(log => {
        all.push({ ...log, company: app.company, applicationId: app.id })
      })
    })
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [applications])

  const groups = useMemo(() => {
    const result = []
    entries.slice(0, visibleCount).forEach(entry => {
      const key = dayKey(entry.timestamp)
      const last = result[result.length - 1]
      if (last && last.key === key) last.items.push(entry)
      else result.push({ key, label: dayLabel(entry.timestamp), items: [entry] })
    })
    return result
  }, [entries, visibleCount])

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-12 text-center">
        <History size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm text-slate-400 dark:text-slate-500">No activity yet. Start tracking your applications!</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Activity Timeline</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
          {entries.length} Activities
        </span>
      </div>

      <div className="max-h-[calc(100vh-260px)] overflow-y-auto pr-2 space-y-6 scrollbar-thin">
        {groups.map(group => (
          <div key={group.key}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 sticky top-0 bg-white dark:bg-slate-900 py-1 z-10">
              {group.label}
            </h3>

            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-3">
              {group.items.map(entry => {
                const config = actionConfig[entry.action] || { icon: PlusCircle, dot: 'bg-slate-400' }
                const Icon = config.icon
                return (
                  <div key={entry.id} className="relative group cursor-pointer flex items-center" onClick={() => onSelect?.(applications.find(a => a.id === entry.applicationId))}>
                    <span className={`absolute -left-[21px] w-3 h-3 rounded-full ${config.dot} ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform`} />
                    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-xl transition-all flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {entry.company}
                        <span className="font-normal text-slate-500 dark:text-slate-400">
                          {' '}— {entry.details || actionLabels[entry.action] || entry.action}
                        </span>
                      </p>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
                        <Icon size={12} className={config.dot.replace('bg-', 'text-')} />
                        {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          </div>
        ))}

        {entries.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="w-full py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
          >
            Load More Activities ({entries.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </div>
  )
}