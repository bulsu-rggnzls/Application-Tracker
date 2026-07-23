import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
}

function formatMonth(year, month) {
  return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export default function CalendarView({ applications, onSelect }) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const events = useMemo(() => {
    const map = {}
    applications.forEach(app => {
      ;(app.interviews || []).forEach(iv => {
        const d = new Date(iv.date)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        if (!map[key]) map[key] = []
        map[key].push({ ...iv, company: app.company, role: app.role, applicationId: app.id })
      })
    })
    return map
  }, [applications])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const grid = getMonthGrid(year, month)

  const prevMonth = () => setCursor(new Date(year, month - 1, 1))
  const nextMonth = () => setCursor(new Date(year, month + 1, 1))

  const getEventsForDay = (day) => {
    if (!day) return []
    const key = `${year}-${month}-${day}`
    return events[key] || []
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
          {formatMonth(year, month)}
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-700">
        {grid.map((day, i) => {
          const isToday = day && isSameDay(today, new Date(year, month, day))
          const eventsForDay = getEventsForDay(day)
          return (
            <div
              key={i}
              className={`min-h-[80px] border-r border-b border-slate-200 dark:border-slate-700 p-1.5 transition-colors ${
                day ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'
              } ${eventsForDay.length > 0 ? 'cursor-pointer hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20' : ''}`}
              onClick={() => eventsForDay.length > 0 && onSelect?.(applications.find(a => a.id === eventsForDay[0].applicationId))}
            >
              {day && (
                <>
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-5 h-5 rounded-full ${
                    isToday ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {eventsForDay.slice(0, 2).map((ev, ei) => (
                      <div key={ei} className="text-[10px] leading-tight px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 truncate font-medium">
                        {ev.time && `${ev.time}`} {ev.company}
                      </div>
                    ))}
                    {eventsForDay.length > 2 && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 px-1">+{eventsForDay.length - 2} more</div>
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