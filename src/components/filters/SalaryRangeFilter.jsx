import { useState } from 'react'
import { ChevronDown, ArrowUpDown } from 'lucide-react'
import Popover from './Popover'

const PRESETS = [
  { label: 'Any Salary', value: '' },
  { label: 'Under $100k', value: '0-100' },
  { label: '$100k – $150k', value: '100-150' },
  { label: '$150k – $200k', value: '150-200' },
  { label: '$200k+', value: '200+' },
]

export default function SalaryRangeFilter({ minSalary, maxSalary, sortHigh, onChange }) {
  const [localMin, setLocalMin] = useState(minSalary || '')
  const [localMax, setLocalMax] = useState(maxSalary || '')
  const hasSelection = minSalary || maxSalary || sortHigh

  function applyPreset(value) {
    if (!value) {
      onChange({ min: '', max: '', sortHigh: false })
      setLocalMin('')
      setLocalMax('')
    } else if (value === '200+') {
      onChange({ min: '200', max: '', sortHigh: false })
      setLocalMin('200')
      setLocalMax('')
    } else {
      const [lo, hi] = value.split('-')
      onChange({ min: lo, max: hi, sortHigh: false })
      setLocalMin(lo)
      setLocalMax(hi)
    }
  }

  function applyCustom() {
    onChange({ min: localMin, max: localMax, sortHigh })
  }

  return (
    <Popover
      align="left"
      trigger={
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
          hasSelection
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}>
          <span className="relative">
            Salary
            {hasSelection && <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </span>
          <ChevronDown size={12} />
        </div>
      }
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Salary</p>
        <div className="space-y-0.5">
          {PRESETS.map(p => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                (!hasSelection && !p.value) || (p.value && minSalary === p.value.split('-')[0] && !sortHigh)
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-2">
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Custom Range</p>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={e => setLocalMin(e.target.value)}
              className="w-full px-2 py-1 text-xs text-slate-600 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <span className="text-slate-300 dark:text-slate-600">–</span>
            <input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={e => setLocalMax(e.target.value)}
              className="w-full px-2 py-1 text-xs text-slate-600 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <button
              onClick={applyCustom}
              className="px-2 py-1 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Go
            </button>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
          <label className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors">
            <input
              type="checkbox"
              checked={sortHigh}
              onChange={e => onChange({ min: minSalary, max: maxSalary, sortHigh: e.target.checked })}
              className="rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer"
            />
            <ArrowUpDown size={12} className="text-emerald-400" />
            <span className="text-xs text-slate-600 dark:text-slate-300">Sort by highest</span>
          </label>
        </div>
      </div>
    </Popover>
  )
}
