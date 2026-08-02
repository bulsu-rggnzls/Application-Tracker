import { useMemo, useState } from 'react'
import {
  History,
  CalendarPlus,
  CheckCircle2,
  XCircle,
  Briefcase,
  FileText,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import getRelativeTime from '../../utils/getRelativeTime'
import extractDomain from '../../utils/extractDomain'

const STATUS_COLORS = {
  wishlist: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  applied: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  interviewing: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  offer: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
}

const STATUS_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

const actionConfig = {
  interview_scheduled: {
    icon: CalendarPlus,
    dot: 'bg-blue-500',
    soft: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    chip: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    label: 'Interview',
  },
  interview_completed: {
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    label: 'Completed',
  },
  offer_accepted: {
    icon: Briefcase,
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    chip: 'bg-emerald-500 text-white border-emerald-500',
    label: 'Offer Accepted',
  },
  offer_rejected: {
    icon: XCircle,
    dot: 'bg-rose-500',
    soft: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    chip: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
    label: 'Offer Declined',
  },
  note_added: {
    icon: FileText,
    dot: 'bg-slate-400',
    soft: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    chip: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    label: 'Note',
  },
}

function classifyStatusChange(details = '') {
  const d = details.toLowerCase()
  if (d.includes('offer')) return { icon: Briefcase, dot: 'bg-emerald-500', soft: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400', chip: 'bg-emerald-500 text-white border-emerald-500', label: 'Offer' }
  if (d.includes('reject') || d.includes('decline')) return { icon: XCircle, dot: 'bg-rose-500', soft: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400', chip: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800', label: 'Rejected' }
  if (d.includes('applied')) return { icon: Sparkles, dot: 'bg-blue-500', soft: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', chip: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800', label: 'Applied' }
  if (d.includes('moved') || d.includes('→')) return { icon: ArrowRight, dot: 'bg-purple-500', soft: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', chip: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800', label: 'Update' }
  return { icon: ArrowRight, dot: 'bg-indigo-500', soft: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400', chip: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800', label: 'Update' }
}

function getConfig(entry) {
  if (entry.action === 'status_change') return classifyStatusChange(entry.details)
  return actionConfig[entry.action] || { icon: FileText, dot: 'bg-slate-400', soft: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400', chip: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', label: 'Update' }
}

function getFilterGroup(entry) {
  if (entry.action === 'interview_scheduled' || entry.action === 'interview_completed') return 'interviews'
  if (entry.action === 'offer_accepted' || entry.action === 'offer_rejected') return 'offers'
  if (entry.action === 'status_change' && /offer|reject|decline/i.test(entry.details || '')) return 'offers'
  return 'updates'
}

function parseStatusTransition(details) {
  const match = details.match(/Moved from (\w+) to (\w+)/i)
  if (match) return { from: match[1], to: match[2] }
  const match2 = details.match(/Moved to (\w+)/i)
  if (match2) return { to: match2[1] }
  return null
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

function Favicon({ domain }) {
  if (!domain) return null
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt=""
      onError={(e) => { e.currentTarget.style.display = 'none' }}
      className="w-5 h-5 rounded-md object-contain shrink-0 bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
    />
  )
}

export default function TimelineView({ applications, onSelect }) {
  const [visibleCount, setVisibleCount] = useState(15)
  const [filter, setFilter] = useState('all')

  const entries = useMemo(() => {
    const all = []
    applications.forEach(app => {
      ;(app.activityLog || []).forEach(log => {
        all.push({
          ...log,
          company: app.company,
          role: app.role,
          domain: extractDomain(app.jobUrl),
          jobUrl: app.jobUrl,
          applicationId: app.id,
        })
      })
    })
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [applications])

  const filteredEntries = useMemo(() => {
    if (filter === 'all') return entries
    return entries.filter(e => getFilterGroup(e) === filter)
  }, [entries, filter])

  const filterCounts = useMemo(() => {
    return {
      all: entries.length,
      interviews: entries.filter(e => getFilterGroup(e) === 'interviews').length,
      offers: entries.filter(e => getFilterGroup(e) === 'offers').length,
      updates: entries.filter(e => getFilterGroup(e) === 'updates').length,
    }
  }, [entries])

  const groups = useMemo(() => {
    const result = []
    filteredEntries.slice(0, visibleCount).forEach(entry => {
      const key = dayKey(entry.timestamp)
      const last = result[result.length - 1]
      if (last && last.key === key) last.items.push(entry)
      else result.push({ key, label: dayLabel(entry.timestamp), items: [entry] })
    })
    return result
  }, [filteredEntries, visibleCount])

  const filterChips = [
    { id: 'all', label: 'All' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'offers', label: 'Offers' },
    { id: 'updates', label: 'Updates' },
  ]

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
          <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <History className="w-4.5 h-4.5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Activity Timeline</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Track every move in your job search</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 rounded-full">
          {entries.length} Activities
        </span>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {filterChips.map(chip => (
          <button
            key={chip.id}
            onClick={() => { setFilter(chip.id); setVisibleCount(15) }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
              filter === chip.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {chip.label}
            <span className={`ml-1.5 ${filter === chip.id ? 'text-white/70 dark:text-slate-900/60' : 'text-slate-400 dark:text-slate-500'}`}>
              ({filterCounts[chip.id] || 0})
            </span>
          </button>
        ))}
      </div>

      <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-2 space-y-6 scrollbar-thin">
        {groups.map(group => (
          <div key={group.key}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 sticky top-0 z-10 py-1">
              <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {group.label}
              </span>
            </h3>

            <div className="relative pl-9">
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-3">
                {group.items.map(entry => {
                  const config = getConfig(entry)
                  const Icon = config.icon
                  const transition = entry.action === 'status_change' ? parseStatusTransition(entry.details) : null

                  return (
                    <div
                      key={entry.id}
                      className="relative group cursor-pointer"
                      onClick={() => onSelect?.(applications.find(a => a.id === entry.applicationId))}
                    >
                      <span className={`absolute -left-[26px] top-3 w-4 h-4 rounded-full ${config.dot} ring-4 ring-white dark:ring-slate-900 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                      </span>

                      <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group/row">
                        <div className="mt-0.5 relative">
                          <Favicon domain={entry.domain} />
                          <span className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full ${config.soft} border border-white dark:border-slate-800 flex items-center justify-center`}>
                            <Icon size={9} />
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{entry.company}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.chip}`}>
                              {config.label}
                            </span>
                            {entry.role && (
                              <span className="text-xs text-slate-400 dark:text-slate-500 truncate">· {entry.role}</span>
                            )}
                          </div>

                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            {transition ? (
                              <>
                                {transition.from && (
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${STATUS_COLORS[transition.from]}`}>
                                    {STATUS_LABELS[transition.from] || transition.from}
                                  </span>
                                )}
                                {transition.from && <ArrowRight size={11} className="text-slate-400 dark:text-slate-500 shrink-0" />}
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${STATUS_COLORS[transition.to]}`}>
                                  {STATUS_LABELS[transition.to] || transition.to}
                                </span>
                              </>
                            ) : (
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                {entry.details || 'Activity logged'}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {entry.jobUrl && (
                            <a
                              href={entry.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors opacity-0 group-hover/row:opacity-100"
                              title="Open job posting"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap tabular-nums">
                            {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}

        {filteredEntries.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="w-full py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
          >
            Load More Activities ({filteredEntries.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </div>
  )
}
