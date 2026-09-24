import { useMemo, useState } from 'react'
import { STATUS_CHART_COLORS, STATUS_LABELS as STATUS_LABELS_MAP } from '@/lib/status'

const STATUS_COLORS = STATUS_CHART_COLORS
const STATUS_LABELS = STATUS_LABELS_MAP

const STATUS_ORDER = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const WEEKS = 18

function buildHeatmap(apps) {
  const dated = apps
    .filter(a => a.dateApplied)
    .map(a => { const d = new Date(a.dateApplied); d.setHours(0, 0, 0, 0); return d })
  if (!dated.length) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const end = new Date(today); end.setDate(end.getDate() + (6 - today.getDay()))
  const start = new Date(end); start.setDate(start.getDate() - (WEEKS * 7 - 1))
  const weeks = Array.from({ length: WEEKS }, () => Array(7).fill(0))
  let max = 0
  dated.forEach(d => {
    const diff = Math.floor((d - start) / 86400000)
    if (diff < 0 || diff >= WEEKS * 7) return
    const w = Math.floor(diff / 7)
    weeks[w][d.getDay()]++
    if (weeks[w][d.getDay()] > max) max = weeks[w][d.getDay()]
  })
  const first = new Date(Math.min(...dated))
  const last = new Date(Math.max(...dated))
  const spanWeeks = Math.max(1, Math.ceil((last - first) / 86400000 / 7))
  const labels = weeks.map((_, w) => {
    const d = new Date(start); d.setDate(d.getDate() + w * 7)
    const prev = new Date(start); prev.setDate(prev.getDate() + (w - 1) * 7)
    return w === 0 || d.getMonth() !== prev.getMonth() ? MONTH_LABELS[d.getMonth()] : ''
  })
  return {
    weeks,
    max,
    labels,
    total: dated.length,
    avg: (dated.length / spanWeeks).toFixed(1),
    range: `${first.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
  }
}

export default function useAnalytics(applications) {
  const [timeRange, setTimeRange] = useState('all')

  const filteredApps = useMemo(() => {
    if (timeRange === 'all') return applications
    const monthsBack = timeRange === '1m' ? 1 : timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - monthsBack)
    return applications.filter(app => app.dateApplied && new Date(app.dateApplied) >= cutoff)
  }, [applications, timeRange])

  const stats = useMemo(() => {
    const total = filteredApps.length
    const applied = filteredApps.filter(a => a.status !== 'wishlist').length
    const interviewing = filteredApps.filter(a => a.status === 'interviewing').length
    const offers = filteredApps.filter(a => a.status === 'offer').length
    const responses = interviewing + offers
    const responseRate = applied > 0 ? Math.round((responses / applied) * 100) : 0
    return { total, applied, interviewing, offers, responses, responseRate }
  }, [filteredApps])

  const statusData = useMemo(() => {
    const counts = {}
    filteredApps.forEach(app => { counts[app.status] = (counts[app.status] || 0) + 1 })
    return STATUS_ORDER
      .map(key => ({ key, name: STATUS_LABELS[key], color: STATUS_COLORS[key], value: counts[key] || 0 }))
      .filter(d => d.value > 0)
  }, [filteredApps])

  const monthlyData = useMemo(() => {
    const months = {}
    filteredApps.forEach(app => {
      if (!app.dateApplied) return
      const d = new Date(app.dateApplied)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months[key] = (months[key] || 0) + 1
    })
    const sorted = Object.entries(months).sort()
    return sorted.map(([name, count]) => {
      const [year, month] = name.split('-')
      return { name: `${MONTH_LABELS[parseInt(month) - 1]} ${year}`, count, month: name }
    })
  }, [filteredApps])

  const conversionFunnel = useMemo(() => {
    const total = filteredApps.length
    const applied = filteredApps.filter(a => a.status !== 'wishlist').length
    const interviewing = filteredApps.filter(a => a.status === 'interviewing' || a.status === 'offer').length
    const offers = filteredApps.filter(a => a.status === 'offer').length
    return [
      { stage: 'Total', count: total, pct: 100 },
      { stage: 'Applied', count: applied, pct: total > 0 ? Math.round((applied / total) * 100) : 0 },
      { stage: 'Interviewing', count: interviewing, pct: total > 0 ? Math.round((interviewing / total) * 100) : 0 },
      { stage: 'Offers', count: offers, pct: total > 0 ? Math.round((offers / total) * 100) : 0 },
    ]
  }, [filteredApps])

  const topTags = useMemo(() => {
    const tagCounts = {}
    filteredApps.forEach(app => (app.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
    return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([tag, count]) => ({ tag, count }))
  }, [filteredApps])

  const heatmap = useMemo(() => buildHeatmap(filteredApps), [filteredApps])

  return {
    timeRange,
    setTimeRange,
    filteredApps,
    stats,
    statusData,
    monthlyData,
    conversionFunnel,
    topTags,
    heatmap,
  }
}
