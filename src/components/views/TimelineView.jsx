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
import { Text } from '../ui'
import WelcomeEmpty from '../ui/WelcomeEmpty'

const STATUS_COLORS = {
  wishlist: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  applied: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  interviewing: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
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
  if (d.includes('moved') || d.includes('→')) return { icon: ArrowRight, dot: 'bg-violet-500', soft: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400', chip: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800', label: 'Update' }
  return { icon: ArrowRight, dot: 'bg-slate-500', soft: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400', chip: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', label: 'Update' }
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

export default function TimelineView({ applications, onSelect, onAdd }) {
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

  if (entries.length === 0 && applications.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <WelcomeEmpty
          icon={History}
          title="Your story starts with the first application"
          description="Every move you make — adding a job, scheduling an interview, landing an offer — shows up here as a timeline."
          actionLabel="+ Add your first application"
          onAction={onAdd}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-5 pt-4 pb-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 via-white to-amber-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Activity log</p>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">Timeline</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">{entries.length} activities tracked</p>
          </div>
          <div className="flex p-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            {filterChips.map(chip => (
              <button
                key={chip.id}
                type="button"
                onClick={() => { setFilter(chip.id); setVisibleCount(15) }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  filter === chip.id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {chip.label}
                <span className={`ml-1.5 tabular-nums ${filter === chip.id ? 'opacity-60' : 'text-slate-400 dark:text-slate-500'}`}>
                  {filterCounts[chip.id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-5">
        {filteredEntries.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <WelcomeEmpty
              icon={History}
              title="No activity in this filter"
              description="Try another filter, or add a new application to get things moving."
              compact
            />
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(group => (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {group.label}
                  </span>
                  <span className="flex-1 h-px bg-slate-200 dark:bg-slate-800/80" />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">{group.items.length}</span>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-indigo-300 via-indigo-200 to-transparent dark:from-indigo-700 dark:via-indigo-800 dark:to-transparent" />
                  <div className="space-y-2">
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
                          <span className={`absolute -left-[24px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-[#090D16] ${config.dot}`} />

                          <div className="flex items-start gap-3 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150 group/row">
                            <div className="mt-0.5 relative">
                              <Favicon domain={entry.domain} />
                              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${config.soft} border border-white dark:border-[#090D16] flex items-center justify-center`}>
                                <Icon size={9} />
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Text variant="body" className="!font-semibold !text-slate-900 dark:!text-white truncate">{entry.company}</Text>
                                <span className={`!text-[10px] !px-1.5 !py-0.5 !rounded-md !border !font-medium ${config.chip}`}>
                                  {config.label}
                                </span>
                                {entry.role && (
                                  <Text variant="muted-sm" className="truncate">· {entry.role}</Text>
                                )}
                              </div>

                              <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                                {transition ? (
                                  <>
                                    {transition.from && (
                                      <span className={`!text-[10px] !px-1.5 !py-0.5 !rounded-md !border !font-medium ${STATUS_COLORS[transition.from]}`}>
                                        {STATUS_LABELS[transition.from] || transition.from}
                                      </span>
                                    )}
                                    {transition.from && <ArrowRight size={11} className="text-slate-400 dark:text-slate-500 shrink-0" />}
                                    <span className={`!text-[10px] !px-1.5 !py-0.5 !rounded-md !border !font-medium ${STATUS_COLORS[transition.to]}`}>
                                      {STATUS_LABELS[transition.to] || transition.to}
                                    </span>
                                  </>
                                ) : (
                                  <Text variant="subtle" className="leading-snug">
                                    {entry.details || 'Activity logged'}
                                  </Text>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {entry.jobUrl && (
                                <button
                                  type="button"
                                  onClick={e => { e.stopPropagation(); window.open(entry.jobUrl, '_blank', 'noopener,noreferrer') }}
                                  className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover/row:opacity-100 focus:opacity-100 cursor-pointer bg-transparent border-0"
                                  title="Open job posting"
                                >
                                  <ExternalLink size={13} />
                                </button>
                              )}
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap tabular-nums">
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
                type="button"
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="w-full py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer bg-transparent"
              >
                Load more ({filteredEntries.length - visibleCount} remaining)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
