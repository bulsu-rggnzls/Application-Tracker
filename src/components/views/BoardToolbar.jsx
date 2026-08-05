import { Search, Star, Globe, ArrowDownWideNarrow } from 'lucide-react'
import { Input } from '../ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'remote', label: 'Remote', icon: Globe },
  { id: 'starred', label: 'Starred Only', icon: Star },
]

export default function BoardToolbar({ search, onSearchChange, filter, onFilterChange, sort, onSortChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <Input
        containerClassName="relative flex-1 min-w-[180px] max-w-xs"
        icon={<Search size={14} />}
        type="text"
        placeholder="Filter by title or company..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors cursor-pointer border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${
              filter === id
                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40'
            }`}
          >
            {Icon && <Icon size={12} />}
            {label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-1.5 ml-auto">
        <ArrowDownWideNarrow size={13} className="text-slate-400" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-2.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="salary">Salary High-to-Low</option>
        </select>
      </label>
    </div>
  )
}
