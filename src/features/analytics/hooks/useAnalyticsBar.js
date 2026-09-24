import { useMemo } from 'react'

export default function useAnalyticsBar(applications) {
  return useMemo(() => {
    const total = applications.length
    const totalApplied = applications.filter(a => a.status !== 'wishlist').length
    const interviews = applications.filter(a => a.status === 'interviewing').length
    const offers = applications.filter(a => a.status === 'offer').length
    const responseRate = totalApplied > 0 ? Math.round(((interviews + offers) / totalApplied) * 100) : 0
    return { total, totalApplied, interviews, offers, responseRate }
  }, [applications])
}
