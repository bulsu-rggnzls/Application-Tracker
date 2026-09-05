import { useState } from 'react'
import { LayoutDashboard, BarChart2, Calendar, History, Briefcase } from 'lucide-react'
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
          <Logo open={open} />
          <div className="mt-8 flex flex-col space-y-2">
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
                          ? 'text-indigo-400'
                          : 'text-slate-400'
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
                  activeView === item.id && 'bg-slate-800 text-white font-medium'
                )}
                onClick={(e) => { e.preventDefault(); onViewChange(item.id) }}
                active={activeView === item.id}
              />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  )
}

function Logo({ open }) {
  return (
    <div className={cn(
      'flex items-center py-1',
      open ? 'gap-2.5' : 'gap-2.5 justify-center'
    )}>
      <div className="flex h-10 w-8 flex-shrink-0 items-center justify-center">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 flex items-center justify-center">
          <Briefcase size={15} />
        </div>
      </div>
      <span className={`text-sm font-bold text-white tracking-tight whitespace-nowrap transition-all duration-200 ${open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
        AppTracker
      </span>
    </div>
  )
}
