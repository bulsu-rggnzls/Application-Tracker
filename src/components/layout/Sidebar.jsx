import { useState } from 'react'
import { LayoutDashboard, BarChart2, Calendar, History } from 'lucide-react'
import {
  IconBriefcase,
  IconChartBar,
  IconCalendarMonth,
  IconTimeline,
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'board', icon: IconBriefcase, activeIcon: LayoutDashboard, label: 'Board' },
  { id: 'analytics', icon: IconChartBar, activeIcon: BarChart2, label: 'Analytics' },
  { id: 'calendar', icon: IconCalendarMonth, activeIcon: Calendar, label: 'Calendar' },
  { id: 'timeline', icon: IconTimeline, activeIcon: History, label: 'Timeline' },
]

export default function AppSidebar({ activeView, onViewChange, applications }) {
  const [open, setOpen] = useState(false)
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-3">
            {navItems.map((item) => (
              <SidebarLink
                key={item.id}
                link={{
                  label: item.label,
                  href: '#',
                  icon: (
                    <div className="relative">
                      <item.icon className={cn(
                        'h-5 w-5 shrink-0',
                        activeView === item.id
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-neutral-700 dark:text-neutral-200'
                      )} />
                      {item.id === 'calendar' && interviewingCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                          {interviewingCount}
                        </span>
                      )}
                    </div>
                  ),
                }}
                className={cn(
                  activeView === item.id && 'bg-neutral-200/60 dark:bg-neutral-700/60 rounded-lg'
                )}
                onClick={(e) => { e.preventDefault(); onViewChange(item.id) }}
              />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-[11px] font-bold text-white">
        J
      </div>
      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
        Jobs
      </span>
    </div>
  )
}

function LogoIcon() {
  return (
    <div className="flex items-center py-1">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-[11px] font-bold text-white">
        J
      </div>
    </div>
  )
}
