import { useState } from 'react'
import { Search, Bell, Calendar, Clock, Check } from 'lucide-react'
import { Badge, Heading, IconButton, Input, Text } from '../ui'
import formatTime from '../../utils/formatTime'

function parseInterviewDate(iv) {
  if (!iv.date) return null
  const d = new Date(iv.date)
  if (isNaN(d.getTime())) return null
  if (iv.time && !iv.date.includes('T')) {
    const [h, m] = iv.time.split(':').map(Number)
    if (!isNaN(h) && !isNaN(m)) d.setHours(h, m, 0, 0)
  }
  return d
}

function getUpcomingInterviews(applications, hours = 24) {
  const now = Date.now()
  const limit = now + hours * 3600 * 1000
  const list = []
  applications.forEach(app => {
    ;(app.interviews || []).forEach(iv => {
      const datetime = parseInterviewDate(iv)
      if (!datetime) return
      const ts = datetime.getTime()
      if (ts > now && ts <= limit) {
        list.push({ ...iv, company: app.company, role: app.role, datetime })
      }
    })
  })
  return list.sort((a, b) => a.datetime - b.datetime)
}

function formatTimeLeft(dt) {
  const mins = Math.max(0, Math.round((dt.getTime() - Date.now()) / 60000))
  if (mins < 60) return `${mins}m left`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  if (hrs < 24) return remMins ? `${hrs}h ${remMins}m left` : `${hrs}h left`
  return `${Math.floor(hrs / 24)}d left`
}

export default function TopBar({ search, onSearchChange, applications }) {
  const [notifOpen, setNotifOpen] = useState(false)

  const upcoming = getUpcomingInterviews(applications || [])

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 shrink-0">
        <Heading size="sm">Applications</Heading>
      </div>
      <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
        <Input
          containerClassName="relative w-full max-w-xs min-w-0"
          icon={<Search size={14} />}
          type="text"
          placeholder="Search company, role, or tag..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="relative">
          <IconButton
            onClick={() => setNotifOpen(prev => !prev)}
            className={notifOpen ? '!bg-slate-100 dark:!bg-slate-800 !text-slate-700 dark:!text-slate-200' : '!text-slate-500 dark:!text-slate-400 hover:!text-slate-700 dark:hover:!text-slate-200'}
            title="Notifications"
          >
            <Bell size={18} />
            {upcoming.length > 0 && (
              <Badge variant="count" className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 !bg-rose-500">
                {upcoming.length}
              </Badge>
            )}
          </IconButton>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <Heading size="sm">Notifications</Heading>
                  {upcoming.length > 0 && (
                    <Badge variant="count-pill" className="!text-[11px] !font-medium !text-rose-600 dark:!text-rose-400 !bg-rose-50 dark:!bg-rose-900/20">Upcoming 24h</Badge>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {upcoming.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Check size={20} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <Text variant="body">No interviews in the next 24 hours</Text>
                      <Text variant="muted-sm" className="mt-0.5">You're all caught up!</Text>
                    </div>
                  ) : (
                    upcoming.map(iv => (
                      <div key={iv.id} className="px-4 py-3 flex gap-3 border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Calendar size={15} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <Text variant="body" className="!font-medium !text-slate-800 dark:!text-slate-200 truncate">
                            Interview at {iv.company}
                          </Text>
                          <Text variant="subtle" className="truncate">{iv.role}{iv.stageName ? ` · ${iv.stageName}` : ''}</Text>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {iv.datetime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                              {' · '}
                              {formatTime(iv.time)}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 self-start text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          {formatTimeLeft(iv.datetime)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <button
          className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          title="Profile"
        >
          RG
        </button>
      </div>
    </header>
  )
}