import { useState } from 'react'
import { Briefcase, Clock, TrendingUp, Award } from 'lucide-react'
import { StatCard } from '../ui'

export default function AnalyticsBar({ applications }) {
  const total = applications.length
  const totalApplied = applications.filter(a => a.status !== 'wishlist').length
  const interviews = applications.filter(a => a.status === 'interviewing').length
  const offers = applications.filter(a => a.status === 'offer').length
  const responseRate = totalApplied > 0 ? Math.round(((interviews + offers) / totalApplied) * 100) : 0

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total" value={total} icon={Briefcase} color="indigo" />
        <StatCard label="Interviews" value={interviews} icon={Clock} color="orange" />
        <StatCard label="Response Rate" value={`${responseRate}%`} icon={TrendingUp} color="emerald" />
        <StatCard label="Offers" value={offers} icon={Award} color="amber" />
      </div>
    </div>
  )
}
