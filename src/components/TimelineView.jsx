import { useMemo } from 'react'
import { History, ArrowRight, CalendarCheck, XCircle, CheckCircle, PlusCircle, FileText } from 'lucide-react'
import getRelativeTime from '../utils/getRelativeTime'

const actionConfig = {
  status_change: { icon: ArrowRight, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' },
  interview_scheduled: { icon: CalendarCheck, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' },
  interview_completed: { icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' },
  offer_accepted: { icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' },
  offer_rejected: { icon: XCircle, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30' },
  note_added: { icon: FileText, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' },
}

const actionLabels = {
  status_change: 'Status changed',
  interview_scheduled: 'Interview scheduled',
  interview_completed: 'Interview completed',
  offer_accepted: 'Offer accepted',
  offer_rejected: 'Offer rejected',
  note_added: 'Note added',
}

export default function TimelineView({ applications, onSelect }) {
  const entries = useMemo(() => {
    const all = []
    applications.forEach(app => {
      ;(app.activityLog || []).forEach(log => {
        all.push({ ...log, company: app.company, applicationId: app.id })
      })
    })
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [applications])

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-12 text-center">
        <History size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm text-slate-400 dark:text-slate-500">No activity yet. Start tracking your applications!</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
        <History size={16} className="text-indigo-600 dark:text-indigo-400" />
        Activity Timeline
      </h3>
      <div className="relative pl-8">
        <div className="absolute left-3 top-1 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-5">
          {entries.map((entry) => {
            const config = actionConfig[entry.action] || { icon: PlusCircle, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50' }
            const Icon = config.icon
            return (
              <div key={entry.id} className="relative group">
                <div className={`absolute -left-[22px] p-1.5 rounded-lg ${config.color}`}>
                  <Icon size={12} />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" onClick={() => onSelect?.(applications.find(a => a.id === entry.applicationId))}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{entry.company}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{getRelativeTime(entry.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{entry.details || actionLabels[entry.action] || entry.action}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}