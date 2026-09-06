import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Inbox, CalendarDays, CalendarClock, CalendarRange, List } from 'lucide-react'
import { Badge, Card, Heading, IconButton, Text } from '../ui'
import WelcomeEmpty from '../ui/WelcomeEmpty'
import StatStrip from '../ui/StatStrip'
import formatTime from '../../utils/formatTime'
import extractDomain from '../../utils/extractDomain'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const categoryStyles = {
  interview: { pill: 'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/60', dot: 'bg-violet-500', label: 'Interview' },
  offer: { pill: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60', dot: 'bg-emerald-500', label: 'Offer' },
  application: { pill: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60', dot: 'bg-blue-500', label: 'Applied' },
  deadline: { pill: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/60', dot: 'bg-orange-500', label: 'Deadline' },
  followup: { pill: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60', dot: 'bg-amber-500', label: 'Follow-up' },
  rejection: { pill: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60', dot: 'bg-rose-500', label: 'Rejection' },
  general: { pill: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60', dot: 'bg-slate-500', label: 'General' },
}

function getCategory(stageName, status) {
  const s = (stageName || '').toLowerCase()
  if (s.includes('screen') || s.includes('technical') || s.includes('phone') || s.includes('on-site') || s.includes('final') || s.includes('interview')) return 'interview'
  if (s.includes('follow')) return 'followup'
  if (s.includes('reject') || s.includes('decline')) return 'rejection'
  if (status === 'offer') return 'offer'
  if (status === 'applied') return 'application'
  return 'general'
}

function parseDateKey(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('T')[0].split('-')
  if (parts.length !== 3) return null
  return `${parseInt(parts[0])}-${parseInt(parts[1]) - 1}-${parseInt(parts[2])}`
}

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days = []
  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, i - startPad + 1)
    days.push({ day: d.getDate(), date: d, current: false, key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    days.push({ day: d, date, current: true, key: `${year}-${month}-${d}` })
  }
  let nextDay = 1
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, nextDay++)
    days.push({ day: d.getDate(), date: d, current: false, key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` })
  }
  return days
}

function formatMonth(year, month) {
  return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function startOfWeek(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

function CompanyAvatar({ domain, size = 'w-3.5 h-3.5', rounded = 'rounded-[3px]' }) {
  if (!domain) return null
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt=""
      onError={(e) => { e.currentTarget.style.display = 'none' }}
      className={`${size} ${rounded} object-contain shrink-0`}
    />
  )
}

function EventPill({ ev, todayRef }) {
  const s = categoryStyles[ev.type] || categoryStyles.general
  const isPast = new Date(ev.date) < todayRef
  return (
    <div
      className={`!text-[10px] !px-1.5 !py-0.5 !rounded-[4px] !leading-tight flex items-center gap-1 border font-medium cursor-pointer hover:brightness-95 transition-all truncate ${s.pill} ${isPast ? 'opacity-50' : ''}`}
      onClick={(e) => e.stopPropagation()}
      title={`${s.label}: ${ev.company}${ev.time ? ` at ${formatTime(ev.time)}` : ''}`}
    >
      <CompanyAvatar domain={ev.domain} />
      <span className={`w-1 h-1 rounded-full shrink-0 ${s.dot}`} />
      <span className="truncate min-w-0">{ev.company}</span>
      {ev.time && (
        <span className="shrink-0 text-[9px] opacity-75 font-semibold ml-auto tabular-nums">{formatTime(ev.time)}</span>
      )}
    </div>
  )
}

function DayNumber({ date, current, isToday }) {
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 text-[11px] font-semibold rounded-full shrink-0 tabular-nums ${
      isToday
        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
        : current
          ? 'text-slate-700 dark:text-slate-200'
          : 'text-slate-300 dark:text-slate-600'
    }`}>
      {date.getDate()}
    </span>
  )
}

const CELL_BASE = 'min-h-0 relative p-1.5 flex flex-col gap-1 overflow-hidden transition-colors duration-150 border-b border-r border-slate-100 dark:border-slate-800/70'

function MonthGrid({ grid, events, todayKey, todayStart, applications, onSelect }) {
  return (
    <div className="flex-1 grid grid-cols-7 auto-rows-fr min-h-0">
      {grid.map((cell, i) => {
        if (!cell) return <div key={i} />
        const { day, current, key: cellKey, date } = cell
        const isToday = cellKey === todayKey
        const eventsForDay = events[cellKey] || []
        const isWeekend = date.getDay() === 0 || date.getDay() === 6

        return (
          <div
            key={i}
            className={`${CELL_BASE} ${
              !current
                ? 'bg-slate-50/60 dark:bg-slate-900/40'
                : isWeekend
                  ? 'bg-slate-50/40 dark:bg-slate-900/30'
                  : 'bg-white dark:bg-[#090D16]'
            } ${eventsForDay.length > 0 ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40' : ''}`}
            onClick={() => eventsForDay.length > 0 && onSelect?.(
              applications.find(a => a.id === eventsForDay[0].applicationId)
            )}
          >
            {day && (
              <>
                <div className="flex items-center justify-between">
                  <DayNumber date={date} current={current} isToday={isToday} />
                  {eventsForDay.length > 3 && (
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">{eventsForDay.length}</span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 min-h-0 overflow-hidden">
                  {eventsForDay.slice(0, 3).map((ev, ei) => (
                    <EventPill key={ev.id || ei} ev={ev} todayRef={todayStart} />
                  ))}
                  {eventsForDay.length > 3 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect?.(applications.find(a => a.id === eventsForDay[0].applicationId))
                      }}
                      className="!p-0 !h-auto !text-[9px] !font-semibold text-left uppercase tracking-wider !text-slate-400 dark:!text-slate-500 hover:!text-indigo-600 dark:hover:!text-indigo-400 cursor-pointer bg-transparent border-0"
                    >
                      +{eventsForDay.length - 3} more
                    </button>
                  )}
                </div>
                {isToday && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

function WeekGrid({ weekStart, events, todayKey, todayStart, applications, onSelect }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  return (
    <div className="flex-1 grid grid-cols-7 auto-rows-fr min-h-0">
      {days.map((d, i) => {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        const isToday = key === todayKey
        const isWeekend = d.getDay() === 0 || d.getDay() === 6
        const eventsForDay = events[key] || []

        return (
          <div
            key={i}
            className={`${CELL_BASE} ${
              isWeekend ? 'bg-slate-50/40 dark:bg-slate-900/30' : 'bg-white dark:bg-[#090D16]'
            } ${eventsForDay.length > 0 ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40' : ''}`}
            onClick={() => eventsForDay.length > 0 && onSelect?.(
              applications.find(a => a.id === eventsForDay[0].applicationId)
            )}
          >
            <div className="flex items-center justify-between">
              <DayNumber date={d} current={true} isToday={isToday} />
              {isToday && <span className="text-[9px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Today</span>}
            </div>
            <div className="flex flex-col gap-1 min-h-0 overflow-y-auto scrollbar-thin">
              {eventsForDay.map((ev, ei) => (
                <EventPill key={ev.id || ei} ev={ev} todayRef={todayStart} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayView({ date, events, todayStart, applications, onSelect }) {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  const eventsForDay = (events[key] || []).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  const isToday = key === `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`

  return (
    <div className="flex-1 min-h-0 p-5 overflow-y-auto scrollbar-thin">
      {eventsForDay.length === 0 ? (
        <WelcomeEmpty
          icon={Inbox}
          title="Nothing scheduled this day"
          description="Interviews you book will show up here."
          compact
        />
      ) : (
        <div className="space-y-1.5">
          {eventsForDay.map((ev, ei) => {
            const s = categoryStyles[ev.type] || categoryStyles.general
            const isPast = new Date(ev.date) < todayStart
            return (
              <div
                key={ev.id || ei}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border bg-white dark:bg-[#090D16] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer ${isPast ? 'opacity-60' : ''}`}
                onClick={() => onSelect?.(applications.find(a => a.id === ev.applicationId))}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                <CompanyAvatar domain={ev.domain} size="w-6 h-6" rounded="rounded-md" />
                <div className="min-w-0 flex-1">
                  <Text variant="body" className="!font-semibold !text-slate-900 dark:!text-white truncate">{ev.company}</Text>
                  <Text variant="subtle" className="truncate">{ev.stageName || ev.role}</Text>
                </div>
                {ev.time && (
                  <Text variant="body" className="!font-semibold !text-slate-600 dark:!text-slate-300 shrink-0 tabular-nums">{formatTime(ev.time)}</Text>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AgendaView({ allEvents, todayStart, applications, onSelect, onAdd }) {
  const grouped = useMemo(() => {
    const map = {}
    allEvents.forEach(ev => {
      const key = `${ev.date.split('T')[0]}`
      if (!map[key]) map[key] = []
      map[key].push(ev)
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }, [allEvents])

  return (
    <div className="flex-1 min-h-0 p-5 overflow-y-auto scrollbar-thin">
      {grouped.length === 0 ? (
        applications.length === 0 ? (
          <WelcomeEmpty
            icon={CalendarDays}
            title="No interviews scheduled yet"
            description="Once you add applications and schedule interviews, they’ll appear here so you never miss a round."
            actionLabel="+ Add your first application"
            onAction={onAdd}
          />
        ) : (
          <WelcomeEmpty
            icon={CalendarDays}
            title="Nothing on the agenda"
            description="No interviews in this period. Schedule one by dragging a card into the Interviewing column."
            compact
          />
        )
      ) : (
        <div className="space-y-5">
          {grouped.map(([dateKey, evs]) => {
            const [y, m, d] = dateKey.split('-').map(Number)
            const date = new Date(y, m - 1, d)
            return (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex-1 h-px bg-slate-200 dark:bg-slate-800/80" />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">{evs.length}</span>
                </div>
                <div className="space-y-1">
                  {evs.map((ev, ei) => {
                    const s = categoryStyles[ev.type] || categoryStyles.general
                    const isPast = new Date(ev.date) < todayStart
                    return (
                      <div
                        key={ev.id || ei}
                        className={`flex items-center gap-3 px-3.5 py-2 rounded-lg border bg-white dark:bg-[#090D16] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer ${isPast ? 'opacity-60' : ''}`}
                        onClick={() => onSelect?.(applications.find(a => a.id === ev.applicationId))}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                        <CompanyAvatar domain={ev.domain} size="w-5 h-5" rounded="rounded-md" />
                        <Text variant="body" className="!font-medium truncate !text-slate-700 dark:!text-slate-200">{ev.company}</Text>
                        <Text variant="subtle" className="truncate hidden sm:block">{ev.stageName || ev.role}</Text>
                        {ev.time && (
                          <Text variant="body" className="!font-semibold !text-slate-600 dark:!text-slate-300 ml-auto shrink-0 tabular-nums">{formatTime(ev.time)}</Text>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CalendarView({ applications, onSelect, onAdd }) {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [view, setView] = useState('month')

  const { events, allEvents } = useMemo(() => {
    const map = {}
    const list = []
    let totalCount = 0
    applications.forEach(app => {
      ;(app.interviews || []).forEach(iv => {
        const key = parseDateKey(iv.date)
        if (!key) return
        const ev = {
          ...iv,
          id: iv.id || `${app.id}-${iv.stageName}-${iv.date}`,
          company: app.company,
          role: app.role,
          domain: extractDomain(app.jobUrl),
          applicationId: app.id,
          type: getCategory(iv.stageName, app.status),
        }
        if (!map[key]) map[key] = []
        map[key].push(ev)
        list.push(ev)
        totalCount++
      })
    })
    map._total = totalCount
    return { events: map, allEvents: list.sort((a, b) => new Date(a.date) - new Date(b.date)) }
  }, [applications])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const grid = getMonthGrid(year, month)

  const stats = useMemo(() => ({
    interviews: applications.filter(a => a.status === 'interviewing').length,
    awaiting: applications.filter(a => a.status === 'applied' || a.status === 'wishlist').length,
    offers: applications.filter(a => a.status === 'offer').length,
  }), [applications])

  const handleNav = (dir) => {
    if (view === 'month') {
      setCursor(new Date(year, month + dir, 1))
    } else if (view === 'week') {
      const ws = startOfWeek(cursor)
      ws.setDate(ws.getDate() + dir * 7)
      setCursor(ws)
    } else if (view === 'day') {
      const d = new Date(cursor)
      d.setDate(cursor.getDate() + dir)
      setCursor(d)
    }
  }

  const viewTitle = useMemo(() => {
    if (view === 'month') return formatMonth(year, month)
    if (view === 'week') {
      const ws = startOfWeek(cursor)
      const we = new Date(ws)
      we.setDate(ws.getDate() + 6)
      const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return `${fmt(ws)} – ${fmt(we)}`
    }
    return cursor.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }, [view, year, month, cursor])

  const viewButtons = [
    { id: 'month', icon: CalendarDays, label: 'Month' },
    { id: 'week', icon: CalendarRange, label: 'Week' },
    { id: 'day', icon: CalendarClock, label: 'Day' },
    { id: 'agenda', icon: List, label: 'Agenda' },
  ]

  return (
    <Card className="flex flex-col h-full !shadow-none !rounded-xl !border-slate-200 dark:!border-slate-800 !bg-white dark:!bg-[#090D16] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-5 pt-4 pb-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 via-white to-amber-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Job search calendar</p>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">{viewTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex p-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              {viewButtons.map(vb => (
                <button
                  key={vb.id}
                  type="button"
                  onClick={() => setView(vb.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    view === vb.id
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <vb.icon size={13} />
                  <span className="hidden lg:inline">{vb.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <IconButton onClick={() => handleNav(-1)} className="border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700" title="Previous"><ChevronLeft size={16} /></IconButton>
              <IconButton onClick={() => handleNav(1)} className="border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700" title="Next"><ChevronRight size={16} /></IconButton>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4">
          <StatStrip
            items={[
              { label: 'Interviews', value: stats.interviews, color: 'violet' },
              { label: 'Awaiting response', value: stats.awaiting, color: 'blue' },
              { label: 'Offers', value: stats.offers, color: 'emerald' },
            ]}
          />
        </div>
      </div>

      {/* Weekday headers */}
      {view === 'month' && (
        <div className="grid grid-cols-7 shrink-0 border-b border-slate-200 dark:border-slate-800">
          {WEEKDAYS.map(d => (
            <span key={d} className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center py-2">
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Body */}
      {view === 'month' && (
        <MonthGrid grid={grid} events={events} todayKey={todayKey} todayStart={todayStart} applications={applications} onSelect={onSelect} />
      )}
      {view === 'week' && (
        <WeekGrid weekStart={startOfWeek(cursor)} events={events} todayKey={todayKey} todayStart={todayStart} applications={applications} onSelect={onSelect} />
      )}
      {view === 'day' && (
        <DayView date={cursor} events={events} todayStart={todayStart} applications={applications} onSelect={onSelect} />
      )}
      {view === 'agenda' && (
        <AgendaView allEvents={allEvents} todayStart={todayStart} applications={applications} onSelect={onSelect} onAdd={onAdd} />
      )}
    </Card>
  )
}
