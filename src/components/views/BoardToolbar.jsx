import { Search, Star, Globe, ArrowDownWideNarrow, Rows3, LayoutGrid } from 'lucide-react'
import { Input } from '../ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'remote', label: 'Remote', icon: Globe },
  { id: 'starred', label: 'Starred Only', icon: Star },
]

export default function BoardToolbar({ search, onSearchChange, filter, onFilterChange, sort, onSortChange, compact, onCompactChange }) {
  return (
    <div className="mb-2 sm:mb-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          containerClassName="relative flex-1 min-w-0 basis-40"
          icon={<Search size={14} />}
          type="text"
          placeholder="Filter by title or company..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className="flex items-center shrink-0 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
          {FILTERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onFilterChange(id)}
              title={label}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-medium transition-colors cursor-pointer border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${
                filter === id
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40'
              }`}
            >
              {Icon ? <Icon size={13} /> : <span className="sm:hidden font-semibold">All</span>}
              <span className={Icon ? 'hidden md:inline' : 'hidden sm:inline'}>{label}</span>
            </button>
          ))}
        </div>

        <label className="hidden sm:flex items-center gap-1.5 shrink-0">
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

        <div className="hidden sm:flex items-center rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" title="Toggle card density">
          <button
            type="button"
            onClick={() => onCompactChange(false)}
            title="Comfortable cards"
            className={`flex items-center px-2.5 py-2 transition-colors cursor-pointer ${
              !compact
                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
            }`}
          >
            <LayoutGrid size={13} />
          </button>
          <button
            type="button"
            onClick={() => onCompactChange(true)}
            title="Compact cards — fits more applications"
            className={`flex items-center px-2.5 py-2 transition-colors cursor-pointer border-l border-slate-200 dark:border-slate-700 ${
              compact
                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40'
            }`}
          >
            <Rows3 size={13} />
          </button>
        </div>
      </div>

      {/* Mobile sort row */}
      <div className="flex sm:hidden items-center gap-2 mt-2 max-w-full">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="min-w-0 flex-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
        >
          <option value="newest">Sort: Newest first</option>
          <option value="salary">Sort: Salary high-to-low</option>
        </select>
      </div>
    </div>
  )
}
