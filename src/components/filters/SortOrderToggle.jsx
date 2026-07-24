import { ArrowUpAZ, ArrowDownZA } from 'lucide-react'
import Popover from './Popover'

const COLOR_MAP = {
  indigo: { active: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800', hover: 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10', icon: 'text-indigo-400' },
  sky:    { active: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800', hover: 'hover:bg-sky-50/50 dark:hover:bg-sky-900/10', icon: 'text-sky-400' },
}

export default function SortOrderToggle({ label, currentSort, onSortChange, color = 'indigo' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.indigo
  const isActive = currentSort?.key === label.toLowerCase()

  return (
    <Popover
      trigger={
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
          isActive
            ? `${c.active} border`
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}>
          {label}
          {isActive ? (
            currentSort.dir === 'asc' ? <ArrowUpAZ size={13} /> : <ArrowDownZA size={13} />
          ) : (
            <ArrowUpAZ size={13} className="opacity-40" />
          )}
        </div>
      }
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Sort by {label}</p>
        <button
          onClick={() => onSortChange(label.toLowerCase(), 'asc')}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
            isActive && currentSort.dir === 'asc'
              ? `${c.active} font-medium`
              : `text-slate-600 dark:text-slate-300 ${c.hover}`
          }`}
        >
          <ArrowUpAZ size={14} className={c.icon} /> A → Z
        </button>
        <button
          onClick={() => onSortChange(label.toLowerCase(), 'desc')}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
            isActive && currentSort.dir === 'desc'
              ? `${c.active} font-medium`
              : `text-slate-600 dark:text-slate-300 ${c.hover}`
          }`}
        >
          <ArrowDownZA size={14} className={c.icon} /> Z → A
        </button>
      </div>
    </Popover>
  )
}
