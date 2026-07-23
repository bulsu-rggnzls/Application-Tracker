import { useState } from 'react'
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import AnalyticsChart from './AnalyticsChart'

export default function AnalyticsBar({ applications }) {
  const [chartOpen, setChartOpen] = useState(false)

  const total = applications.length
  const totalApplied = applications.filter(a => a.status !== 'wishlist').length
  const interviews = applications.filter(a => a.status === 'interviewing').length
  const offers = applications.filter(a => a.status === 'offer').length
  const responseRate = totalApplied > 0 ? Math.round(((interviews + offers) / totalApplied) * 100) : 0

  return (
    <div className="mb-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Total</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{total}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Interviews</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{interviews}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Response Rate</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{responseRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Offers</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{offers}</p>
        </div>
      </div>
      <button
        onClick={() => setChartOpen(prev => !prev)}
        className="flex items-center gap-1 mt-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
      >
        <BarChart3 size={13} />
        {chartOpen ? 'Hide charts' : 'Show charts'}
        {chartOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {chartOpen && (
        <div className="mt-2">
          <AnalyticsChart applications={applications} />
        </div>
      )}
    </div>
  )
}