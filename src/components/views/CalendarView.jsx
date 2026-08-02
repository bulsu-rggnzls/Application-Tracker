import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Zap, Inbox, Award, CalendarClock, CalendarDays, CalendarRange, List } from 'lucide-react'
import formatTime from '../../utils/formatTime'
import extractDomain from '../../utils/extractDomain'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const categoryStyles = {
  interview: { pill: 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100', dot: 'bg-emerald-500', label: 'Interview' },
  offer: { pill: 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100', dot: 'bg-emerald-600', label: 'Offer' },
  application: { pill: 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100', dot: 'bg-blue-500', label: 'Applied' },
  deadline: { pill: 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100', dot: 'bg-orange-500', label: 'Deadline' },
  followup: { pill: 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100', dot: 'bg-amber-500', label: 'Follow-up' },
  rejection: { pill: 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100', dot: 'bg-rose-500', label: 'Rejection' },
  general: { pill: 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100', dot: 'bg-purple-500', label: 'General' },
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

function EventPill({ ev, todayRef }) {
  const s = categoryStyles[ev.type] || categoryStyles.general
  const isPast = new Date(ev.date) < todayRef
  return (
    <div
      className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium flex items-center gap-1 leading-tight transition-all duration-150 hover:shadow-sm hover:-translate-y-px cursor-pointer ${s.pill} ${isPast ? 'opacity-60' : ''}`}
      onClick={(e) => e.stopPropagation()}
      title={`${s.label}: ${ev.company}${ev.time ? ` at ${formatTime(ev.time)}` : ''}`}
    >
      {ev.domain && (
        <img
          src={`https://logo.clearbit.com/${ev.domain}`}
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className="w-3 h-3 rounded-[3px] object-contain shrink-0"
        />
      )}
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      <span className="truncate min-w-0">{ev.company}</span>
      {ev.time && (
        <span className="shrink-0 text-[8px] opacity-75 font-semibold ml-auto">{formatTime(ev.time)}</span>
      )}
    </div>
  )
}

function DayHeader({ date, current, isToday }) {
  return (
    <div className={`flex items-center gap-1 mb-1 ${isToday ? 'rounded-lg' : ''}`}>
      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full shrink-0 ${
        isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : current ? 'text-slate-700' : 'text-slate-300'
      }`}>
        {date.getDate()}
      </span>
    </div>
  )
}

function MonthGrid({ grid, events, todayKey, todayStart, applications, onSelect }) {
  return (
    <div className="flex-1 grid grid-cols-7 auto-rows-fr min-h-0 px-5 pb-5 pt-1">
      {grid.map((cell, i) => {
        if (!cell) return <div key={i} />
        const { day, current, key: cellKey, date } = cell
        const isToday = cellKey === todayKey
        const eventsForDay = events[cellKey] || []

        return (
          <div
            key={i}
            className={`min-h-0 relative p-1.5 flex flex-col gap-1 overflow-hidden transition-all duration-200 ${
              current ? 'bg-white' : 'bg-slate-50/50'
            } ${isToday ? 'bg-indigo-50/40' : ''} border-r border-b border-slate-100/80 ${
              isToday ? 'border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'
            } ${eventsForDay.length > 0 ? 'cursor-pointer hover:bg-indigo-50/40 hover:shadow-inner' : 'hover:bg-slate-50/60'}`}
            onClick={() => eventsForDay.length > 0 && onSelect?.(
              applications.find(a => a.id === eventsForDay[0].applicationId)
            )}
          >
            {day && (
              <>
                <DayHeader date={date} current={current} isToday={isToday} />
                <div className="flex flex-col gap-0.5 min-h-0 overflow-hidden">
                  {eventsForDay.slice(0, 3).map((ev, ei) => (
                    <EventPill key={ev.id || ei} ev={ev} todayRef={todayStart} />
                  ))}
                  {eventsForDay.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect?.(applications.find(a => a.id === eventsForDay[0].applicationId))
                      }}
                      className="text-slate-500 hover:text-indigo-600 text-[10px] font-medium text-left transition-colors"
                    >
                      +{eventsForDay.length - 3} more...
                    </button>
                  )}
                </div>
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
    <div className="flex-1 grid grid-cols-7 auto-rows-fr min-h-0 px-5 pb-5 pt-1">
      {days.map((d, i) => {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        const isToday = key === todayKey
        const isWeekend = d.getDay() === 0 || d.getDay() === 6
        const eventsForDay = events[key] || []

        return (
          <div
            key={i}
            className={`min-h-0 p-1.5 flex flex-col gap-1 overflow-hidden transition-all duration-200 border-r border-b border-slate-100/80 ${
              isToday ? 'bg-indigo-50/40 border-l-2 border-l-indigo-500' : isWeekend ? 'bg-slate-50/50' : 'bg-white'
            } ${isToday ? '' : 'border-l-2 border-l-transparent'} ${eventsForDay.length > 0 ? 'cursor-pointer hover:bg-indigo-50/40' : 'hover:bg-slate-50/60'}`}
            onClick={() => eventsForDay.length > 0 && onSelect?.(
              applications.find(a => a.id === eventsForDay[0].applicationId)
            )}
          >
            <DayHeader date={d} current={true} isToday={isToday} />
            <div className="flex flex-col gap-0.5 min-h-0 overflow-hidden">
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
    <div className="flex-1 min-h-0 px-5 pb-5 pt-2 overflow-y-auto">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-bold text-slate-800 capitalize">
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>
        {isToday && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5">Today</span>
        )}
      </div>
      {eventsForDay.length === 0 ? (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No events scheduled for this day</div>
      ) : (
        <div className="space-y-1.5">
          {eventsForDay.map((ev, ei) => (
            <div
              key={ev.id || ei}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-colors cursor-pointer"
              onClick={() => onSelect?.(applications.find(a => a.id === ev.applicationId))}
            >
              {ev.domain && (
                <img
                  src={`https://logo.clearbit.com/${ev.domain}`}
                  alt=""
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="w-6 h-6 rounded-md object-contain shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{ev.company}</p>
                <p className="text-xs text-slate-500 truncate">{ev.stageName || ev.role}</p>
              </div>
              {ev.time && (
                <span className="text-xs font-semibold text-slate-600 shrink-0">{formatTime(ev.time)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AgendaView({ allEvents, todayStart, applications, onSelect }) {
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
    <div className="flex-1 min-h-0 px-5 pb-5 pt-2 overflow-y-auto">
      {grouped.length === 0 ? (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No events scheduled</div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([dateKey, evs]) => {
            const [y, m, d] = dateKey.split('-').map(Number)
            const date = new Date(y, m - 1, d)
            return (
              <div key={dateKey}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h4>
                <div className="space-y-1">
                  {evs.map((ev, ei) => (
                    <div
                      key={ev.id || ei}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-colors cursor-pointer"
                      onClick={() => onSelect?.(applications.find(a => a.id === ev.applicationId))}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${(categoryStyles[ev.type] || categoryStyles.general).dot}`} />
                      {ev.domain && (
                        <img
                          src={`https://logo.clearbit.com/${ev.domain}`}
                          alt=""
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                          className="w-5 h-5 rounded-md object-contain shrink-0"
                        />
                      )}
                      <span className="text-sm font-medium text-slate-800 truncate">{ev.company}</span>
                      <span className="text-xs text-slate-500 truncate">{ev.stageName || ev.role}</span>
                      {ev.time && (
                        <span className="text-xs font-semibold text-slate-600 ml-auto shrink-0">{formatTime(ev.time)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CalendarView({ applications, onSelect }) {
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

  const interviewingCount = applications.filter(a => a.status === 'interviewing').length
  const awaitingCount = applications.filter(a => a.status === 'applied' || a.status === 'wishlist').length
  const offersCount = applications.filter(a => a.status === 'offer').length

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

  const totalEvents = events._total || 0

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col h-full">
      {/* Hero header */}
      <div className="shrink-0 px-5 pt-5 pb-4 bg-gradient-to-br from-indigo-50 via-white to-amber-50/40 rounded-t-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-500 mb-0.5">Job Search Calendar</p>
            <h2 className="text-xl font-bold text-slate-900">{viewTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex border border-slate-200 bg-white rounded-lg overflow-hidden shadow-sm">
              {viewButtons.map(vb => (
                <button
                  key={vb.id}
                  onClick={() => setView(vb.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    view === vb.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <vb.icon size={13} />
                  <span className="hidden lg:inline">{vb.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleNav(-1)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => handleNav(1)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center gap-2.5 bg-white/80 border border-indigo-100 rounded-lg px-3 py-2 shadow-sm">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Zap size={15} /></span>
            <div>
              <p className="text-base font-bold text-slate-900 leading-none">{interviewingCount}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Interviews Scheduled</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white/80 border border-blue-100 rounded-lg px-3 py-2 shadow-sm">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Inbox size={15} /></span>
            <div>
              <p className="text-base font-bold text-slate-900 leading-none">{awaitingCount}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Awaiting Response</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white/80 border border-emerald-100 rounded-lg px-3 py-2 shadow-sm">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Award size={15} /></span>
            <div>
              <p className="text-base font-bold text-slate-900 leading-none">{offersCount}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Offers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      {view === 'month' && (
        <div className="grid grid-cols-7 px-5 shrink-0">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[11px] font-medium text-slate-400 uppercase tracking-wider py-1.5 border-b border-slate-100">
              {d}
            </div>
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
        <AgendaView allEvents={allEvents} todayStart={todayStart} applications={applications} onSelect={onSelect} />
      )}
    </div>
  )
}
