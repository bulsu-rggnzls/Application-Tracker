import { ChevronDown } from 'lucide-react'
import Popover from './Popover'

const PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'Past 7 Days', value: '7d' },
  { label: 'Past 30 Days', value: '30d' },
  { label: 'Past 90 Days', value: '90d' },
]

export default function DateRangeFilter({ value, onChange }) {
  const hasSelection = value && value !== 'all'

  return (
    <Popover
      align="left"
      trigger={
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
          hasSelection
            ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}>
          <span className="relative">
            Applied
            {hasSelection && <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-amber-500" />}
          </span>
          <ChevronDown size={12} />
        </div>
      }
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Date Range</p>
        {PRESETS.map(preset => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
              value === preset.value
                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </Popover>
  )
}
