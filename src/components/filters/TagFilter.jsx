import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Popover from './Popover'

export default function TagFilter({ availableTags, selectedTags, onChange }) {
  const [query, setQuery] = useState('')
  const hasSelection = selectedTags.length > 0
  const filtered = query
    ? availableTags.filter(t => t.toLowerCase().includes(query.toLowerCase()))
    : availableTags

  function toggleTag(tag) {
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <Popover
      align="left"
      trigger={
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
          hasSelection
            ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}>
          <span className="relative">
            Tags
            {hasSelection && <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-pink-500" />}
          </span>
          <ChevronDown size={12} />
        </div>
      }
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tags</p>
          {hasSelection && (
            <button onClick={() => onChange([])} className="text-pink-600 dark:text-pink-400 hover:underline text-[11px] font-medium">
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 text-xs text-slate-600 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-slate-400 dark:text-slate-500 text-[11px] py-1">No tags match</p>
          )}
          {filtered.map(tag => {
            const active = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                  active
                    ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent hover:border-pink-200 dark:hover:border-pink-700'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>
    </Popover>
  )
}
