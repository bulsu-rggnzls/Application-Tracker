import { LayoutDashboard, Calendar, History, BarChart2 } from 'lucide-react'

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
      {navItems.map((item) => {
        const isActive = activeView === item.id
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isActive
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title={item.label}
          >
            <item.icon size={18} />
            {item.id === 'calendar' && interviewingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[8px] font-bold flex items-center justify-center">
                {interviewingCount}
              </span>
            )}
          </button>
        )
      })}
    </aside>
  )
}