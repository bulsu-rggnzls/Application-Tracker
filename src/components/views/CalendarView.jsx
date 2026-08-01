import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import formatTime from '../../utils/formatTime'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const categoryStyles = {
  interview: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
  followup: 'bg-amber-100 text-amber-900 border border-amber-300',
  rejection: 'bg-rose-100 text-rose-900 border border-rose-300',
  general: 'bg-blue-100 text-blue-900 border border-blue-300',
}

function getCategory(stageName) {
  const s = (stageName || '').toLowerCase()
  if (s.includes('screen') || s.includes('technical') || s.includes('phone') || s.includes('on-site') || s.includes('final') || s.includes('interview')) return 'interview'
  if (s.includes('follow')) return 'followup'
  if (s.includes('reject') || s.includes('decline')) return 'rejection'
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

export default function CalendarView({ applications, onSelect }) {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const events = useMemo(() => {
    const map = {}
    let totalCount = 0
    applications.forEach(app => {
      ;(app.interviews || []).forEach(iv => {
        const key = parseDateKey(iv.date)
        if (!key) return
        if (!map[key]) map[key] = []
        map[key].push({
          ...iv,
          id: iv.id || `${app.id}-${iv.stageName}-${iv.date}`,
          company: app.company,
          role: app.role,
          applicationId: app.id,
          type: getCategory(iv.stageName),
        })
        totalCount++
      })
    })
    map._total = totalCount
    return map
  }, [applications])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const grid = getMonthGrid(year, month)

  const prevMonth = () => setCursor(new Date(year, month - 1, 1))
  const nextMonth = () => setCursor(new Date(year, month + 1, 1))

  const totalEvents = events._total || 0

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="border border-slate-200 rounded-lg p-2 text-center bg-white shadow-sm">
            <div className="text-[10px] uppercase tracking-wider font-bold text-rose-500">
              {today.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </div>
            <div className="text-lg font-black text-slate-800">{today.getDate()}</div>
          </div>
          <h2 className="text-xl font-bold text-slate-800">{formatMonth(year, month)}</h2>
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            {totalEvents} events
          </span>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-5 shrink-0">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-medium text-slate-400 uppercase tracking-wider py-1 border-b border-slate-100">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr min-h-0 px-5 pb-5 pt-1">
        {grid.map((cell, i) => {
          if (!cell) return <div key={i} />
          const { day, current, key: cellKey } = cell
          const isToday = cellKey === todayKey
          const eventsForDay = events[cellKey] || []

          return (
            <div
              key={i}
              className={`min-h-0 border-r border-b border-slate-100 p-1.5 flex flex-col gap-1 overflow-hidden transition-colors ${
                current ? 'bg-white' : 'bg-slate-50/50'
              } ${eventsForDay.length > 0 ? 'cursor-pointer hover:bg-indigo-50/30' : ''}`}
              onClick={() => eventsForDay.length > 0 && onSelect?.(
                applications.find(a => a.id === eventsForDay[0].applicationId)
              )}
            >
              {day && (
                <>
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full shrink-0 ${
                    isToday ? 'bg-indigo-600 text-white' : current ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5 min-h-0 overflow-hidden">
                    {eventsForDay.slice(0, 3).map((ev, ei) => (
<div
                          key={ev.id || ei}
                          className={`px-1.5 py-0.5 rounded-[4px] text-[11px] font-medium flex items-center justify-between gap-1 leading-tight ${
                            new Date(ev.date) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                      >
                        <span className="truncate min-w-0">{ev.company}</span>
                        {ev.time && (
                          <span className="shrink-0 text-[9px] opacity-75 font-semibold">{formatTime(ev.time)}</span>
                        )}
                      </div>
                    ))}
                    {eventsForDay.length > 3 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect?.(applications.find(a => a.id === eventsForDay[0].applicationId))
                        }}
                        className="text-slate-500 hover:text-slate-800 text-xs font-medium text-left"
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
    </div>
  )
}
