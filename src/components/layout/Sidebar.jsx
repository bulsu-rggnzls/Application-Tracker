import { useState } from 'react'
import { LayoutDashboard, BarChart2, Calendar, History, Briefcase, LogOut } from 'lucide-react'
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

function getInitials(user) {
  const name = user?.user_metadata?.full_name || user?.email || ''
  const parts = name.trim().split(/[\s@._]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase()
  return 'AT'
}

export default function AppSidebar({ activeView, onViewChange, applications, user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'
  const email = user?.email || ''

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-4">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto scrollbar-thin">
          <Logo open={open} />
          <div className="mt-8">
            <p className={cn(
              'px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500',
              open ? 'block' : 'hidden'
            )}>
              Workspace
            </p>
            <nav className="flex flex-col space-y-1.5">
              {navItems.map((item) => (
                <SidebarLink
                  key={item.id}
                  link={{
                    label: item.label,
                    href: '#',
                    icon: (
                      <div className="relative">
                        <item.icon className={cn(
                          'h-5 w-5 shrink-0 transition-colors duration-200',
                          activeView === item.id
                            ? 'text-white'
                            : 'text-slate-400 group-hover/sidebar:text-white'
                        )} />
                        {item.id === 'calendar' && interviewingCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-[#090D16] text-[8px] font-bold text-white">
                            {interviewingCount}
                          </span>
                        )}
                      </div>
                    ),
                  }}
                  className={cn(
                    activeView === item.id && 'bg-white/10 text-white font-medium'
                  )}
                  onClick={(e) => { e.preventDefault(); onViewChange(item.id) }}
                  active={activeView === item.id}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* User footer */}
        <div className="shrink-0 border-t border-white/[0.06] pt-3">
          <div className={cn('flex items-center gap-2.5 rounded-xl px-1.5 py-1', !open && 'justify-center')}>
            <span
              title={email}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25 ring-1 ring-white/10"
            >
              {getInitials(user)}
            </span>
            {open && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate leading-tight">{displayName}</p>
                  <p className="text-[10px] text-slate-500 truncate leading-tight">{email}</p>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors duration-150 cursor-pointer bg-transparent border-0"
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
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
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30 flex items-center justify-center">
          <Briefcase size={15} />
        </div>
      </div>
      <div className={cn('transition-all duration-200 whitespace-nowrap', open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden')}>
        <span className="text-sm font-bold text-white tracking-tight block leading-tight">AppTracker</span>
        <span className="text-[9px] font-semibold uppercase tracking-widest text-indigo-400 block leading-tight">Job hunt HQ</span>
      </div>
    </div>
  )
}
