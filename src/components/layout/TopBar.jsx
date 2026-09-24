import { Bell, Calendar, Check, Clock, Menu } from 'lucide-react'
import { Badge, Heading, IconButton, Text } from '@/components/ui'
import formatTime from '@/utils/formatTime'
import { useUpcomingInterviews } from '@/features/jobs'
import { layout } from '@/lib/layout'

export default function TopBar({ applications, onOpenMenu }) {
  const { notifOpen, toggleNotif, closeNotif, upcoming, formatTimeLeft } = useUpcomingInterviews(applications)

  return (
    <header className={layout.topBar}>
      <div className="flex items-center gap-2.5 min-w-0">
        <IconButton
          onClick={onOpenMenu}
          className="md:hidden !text-slate-500 dark:!text-slate-400"
          title="Menu"
        >
          <Menu size={18} />
        </IconButton>
      </div>
      <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
        <div className="relative">
          <IconButton
            onClick={toggleNotif}
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
              <div className="fixed inset-0 z-40" onClick={closeNotif} />
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
      </div>
    </header>
  )
}