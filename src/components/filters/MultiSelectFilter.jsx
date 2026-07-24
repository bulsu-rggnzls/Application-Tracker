import { ChevronDown } from 'lucide-react'
import Popover from './Popover'

const COLOR_MAP = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800',
    dot: 'bg-teal-500', check: 'text-teal-600', focus: 'focus:ring-teal-500/20', itemBg: 'bg-teal-50/50 dark:bg-teal-900/20',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500', check: 'text-purple-600', focus: 'focus:ring-purple-500/20', itemBg: 'bg-purple-50/50 dark:bg-purple-900/20',
  },
}

export default function MultiSelectFilter({ title, options, selectedValues, onChange, color = 'teal' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.teal
  const hasSelection = selectedValues.length > 0

  return (
    <Popover
      align="left"
      trigger={
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
          hasSelection
            ? `${c.bg} ${c.text} ${c.border}`
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}>
          <span className="relative">
            {title}
            {hasSelection && <span className={`absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full ${c.dot}`} />}
          </span>
          <ChevronDown size={12} />
        </div>
      }
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          {hasSelection && (
            <button onClick={() => onChange([])} className={`${c.text} hover:underline text-[11px] font-medium`}>
              Clear
            </button>
          )}
        </div>
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {options.map(opt => {
            const checked = selectedValues.includes(opt.value)
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                  checked ? c.itemBg : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onChange(
                      checked
                        ? selectedValues.filter(v => v !== opt.value)
                        : [...selectedValues, opt.value]
                    )
                  }}
                  className={`rounded border-slate-300 dark:border-slate-600 ${c.check} ${c.focus} cursor-pointer`}
                />
                {opt.badge ? (
                  <span className={opt.badge}>{opt.label}</span>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300">{opt.label}</span>
                )}
              </label>
            )
          })}
        </div>
        {options.length > 1 && (
          <button
            onClick={() => onChange(selectedValues.length === options.length ? [] : options.map(o => o.value))}
            className={`w-full text-center text-[11px] font-medium ${c.text} hover:underline pt-2 mt-1 border-t border-slate-100 dark:border-slate-800`}
          >
            {selectedValues.length === options.length ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>
    </Popover>
  )
}
