import { StatStrip } from '../ui'

export default function AnalyticsBar({ applications }) {
  const total = applications.length
  const totalApplied = applications.filter(a => a.status !== 'wishlist').length
  const interviews = applications.filter(a => a.status === 'interviewing').length
  const offers = applications.filter(a => a.status === 'offer').length
  const responseRate = totalApplied > 0 ? Math.round(((interviews + offers) / totalApplied) * 100) : 0

  return (
    <StatStrip
      items={[
        { label: 'Total', value: total, sub: `${totalApplied} applied`, color: 'indigo' },
        { label: 'Interviews', value: interviews, color: 'violet' },
        { label: 'Response Rate', value: `${responseRate}%`, color: 'emerald' },
        { label: 'Offers', value: offers, color: 'amber' },
      ]}
    />
  )
}
