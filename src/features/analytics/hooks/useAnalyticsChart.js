import { useState, useMemo } from 'react'
import { STATUS_CHART_COLORS } from '@/lib/status'

export default function useAnalyticsChart(applications) {
  const [tab, setTab] = useState('status')

  const statusData = useMemo(() => {
    const counts = {}
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: STATUS_CHART_COLORS[name] || 'var(--brand)',
    }))
  }, [applications])

  const monthlyData = useMemo(() => {
    const months = {}
    applications.forEach(app => {
      if (!app.dateApplied) return
      const d = new Date(app.dateApplied)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months[key] = (months[key] || 0) + 1
    })
    return Object.entries(months).sort().map(([name, count]) => ({ name, count }))
  }, [applications])

  return {
    tab,
    setTab,
    statusData,
    monthlyData,
    total: applications.length,
  }
}
