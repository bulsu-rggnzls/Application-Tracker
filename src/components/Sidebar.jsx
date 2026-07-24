import { LayoutDashboard, Calendar, History, BarChart2 } from 'lucide-react'
import { SidebarNavButton } from './ui'

const navItems = [
  { id: 'board', icon: LayoutDashboard, label: 'Board' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'timeline', icon: History, label: 'Timeline' },
]

export default function Sidebar({ activeView, onViewChange, applications }) {
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length

  return (
    <aside className="w-14 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 gap-1 shrink-0">
      <div className="text-sm font-bold text-slate-900 dark:text-white mb-5 tracking-tight">J</div>
      {navItems.map((item) => (
        <SidebarNavButton
          key={item.id}
          active={activeView === item.id}
          icon={item.icon}
          label={item.label}
          onClick={() => onViewChange(item.id)}
          badge={item.id === 'calendar' ? interviewingCount : null}
        />
      ))}
    </aside>
  )
}
