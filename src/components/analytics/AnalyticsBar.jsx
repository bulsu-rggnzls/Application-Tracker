import { useState } from 'react'
import { BarChart3, ChevronDown, ChevronUp, Briefcase, Clock, TrendingUp, Award } from 'lucide-react'
import AnalyticsChart from './AnalyticsChart'
import { StatCard } from '../ui'

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
        <StatCard label="Total" value={total} icon={Briefcase} color="indigo" />
        <StatCard label="Interviews" value={interviews} icon={Clock} color="orange" />
        <StatCard label="Response Rate" value={`${responseRate}%`} icon={TrendingUp} color="emerald" />
        <StatCard label="Offers" value={offers} icon={Award} color="amber" />
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
