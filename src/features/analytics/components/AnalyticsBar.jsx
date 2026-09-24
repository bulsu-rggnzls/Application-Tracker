import { StatStrip } from '@/components/ui'
import useAnalyticsBar from '../hooks/useAnalyticsBar'

export default function AnalyticsBar({ applications }) {
  const { total, totalApplied, interviews, offers, responseRate } = useAnalyticsBar(applications)

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
