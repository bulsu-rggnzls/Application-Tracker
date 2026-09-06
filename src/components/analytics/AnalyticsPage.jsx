import { useState, useMemo } from 'react'
import { BarChart2, ChevronRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from 'recharts'
import WelcomeEmpty from '../ui/WelcomeEmpty'
import StatStrip from '../ui/StatStrip'

const STATUS_COLORS = {
  wishlist: '#f59e0b',
  applied: '#3B82F6',
  interviewing: '#8B5CF6',
  offer: '#10B981',
  rejected: '#EF4444',
}

const STATUS_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

const STATUS_ORDER = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']

const RANGES = [
  { id: 'all', label: 'All' },
  { id: '1m', label: '1M' },
  { id: '3m', label: '3M' },
  { id: '6m', label: '6M' },
  { id: '12m', label: '1Y' },
]

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const WEEKS = 18

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: '6px',
  border: '1px solid #334155',
  padding: '6px 10px',
  fontSize: '12px',
  color: '#F8FAFC',
}
const tooltipItemStyle = { color: '#F8FAFC' }

const TONES = {
  blue: 'from-blue-50/80 to-transparent dark:from-blue-950/30 dark:to-transparent',
  violet: 'from-violet-50/80 to-transparent dark:from-violet-950/30 dark:to-transparent',
  amber: 'from-amber-50/80 to-transparent dark:from-amber-950/30 dark:to-transparent',
  emerald: 'from-emerald-50/80 to-transparent dark:from-emerald-950/30 dark:to-transparent',
  indigo: 'from-indigo-50/80 to-transparent dark:from-indigo-950/30 dark:to-transparent',
  rose: 'from-rose-50/80 to-transparent dark:from-rose-950/30 dark:to-transparent',
}

function ChartCard({ title, hint, tone = 'indigo', children }) {
  return (
    <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] flex flex-col overflow-hidden">
      <header className={`flex items-center justify-between gap-3 px-4 pt-3 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r ${TONES[tone]}`}>
        <h3 className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h3>
        {hint && (
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-500">{hint}</span>
        )}
      </header>
      <div className="p-4 flex-1 flex flex-col">{children}</div>
    </section>
  )
}

function FunnelBar({ funnel }) {
  const colors = ['#64748b', STATUS_COLORS.applied, STATUS_COLORS.interviewing, STATUS_COLORS.offer]
  const total = funnel[0]?.count || 1
  return (
    <div className="flex flex-col justify-center h-full">
      {funnel.map((f, i) => {
        const prev = funnel[i - 1]
        const advance = prev && prev.count > 0 ? Math.round((f.count / prev.count) * 100) : null
        return (
          <div key={f.stage} className={i > 0 ? 'mt-3' : ''}>
            {i > 0 && (
              <div className="flex items-center gap-1 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                <ChevronRight size={10} />
                {advance ?? 0}% advance
              </div>
            )}
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[i] }} />
                {f.stage}
              </span>
              <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                {f.count} <span className="text-slate-400 dark:text-slate-500 font-normal">({f.pct}%)</span>
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-[3px] overflow-hidden">
              <div
                className="h-full rounded-[3px] transition-all duration-500"
                style={{ width: `${Math.max((f.count / total) * 100, 5)}%`, backgroundColor: colors[i] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function heatColor(count, max, dark) {
  if (!count) return dark ? '#161D2B' : '#F1F5F9'
  if (count === 1) return dark ? '#312E81' : '#C7D2FE'
  const t = count / max
  if (t <= 0.34) return dark ? '#3730A3' : '#A5B4FC'
  if (t <= 0.67) return dark ? '#4F46E5' : '#818CF8'
  return dark ? '#818CF8' : '#4F46E5'
}

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

export default function AnalyticsPage({ applications, onAdd, dark = false }) {
  const [timeRange, setTimeRange] = useState('all')

  const axisTick = { fill: dark ? '#64748B' : '#94A3B8', fontSize: 11 }
  const gridStroke = dark ? '#1B2433' : '#EEF0F4'
  const axisStroke = dark ? '#1B2433' : '#E7EAEF'

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

  if (applications.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>
          <WelcomeEmpty
            icon={BarChart2}
            title="Your analytics will build themselves"
            description="Charts, funnel, and response rates appear here as you add applications and move them along the pipeline."
            actionLabel="+ Add your first application"
            onAction={onAdd}
          />
        </div>
      </div>
    )
  }

  if (filteredApps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>
          <WelcomeEmpty
            icon={BarChart2}
            title="Nothing in this time range"
            description="No applications were added in the selected period. Try switching back to All time."
            compact
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
      <div className="grid grid-cols-12 gap-4 pb-6">

        <div className="col-span-12 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Pipeline intelligence</p>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">Analytics</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              {stats.total} applications · {stats.interviewing} interviewing · {stats.offers} offers
            </p>
          </div>
          <div className="flex p-0.5 bg-white dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 rounded-lg">
            {RANGES.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setTimeRange(r.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  timeRange === r.id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12">
          <StatStrip
            items={[
              { label: 'Total', value: stats.total, sub: `${stats.applied} applied`, color: 'indigo' },
              { label: 'Interviews', value: stats.interviewing, sub: `${stats.applied > 0 ? Math.round((stats.interviewing / stats.applied) * 100) : 0}% of applied`, color: 'violet' },
              { label: 'Response Rate', value: `${stats.responseRate}%`, sub: `${stats.responses} of ${stats.applied}`, color: 'emerald' },
              { label: 'Offers', value: stats.offers, sub: `${stats.applied > 0 ? Math.round((stats.offers / stats.applied) * 100) : 0}% of applied`, color: 'amber' },
            ]}
          />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <ChartCard title="Pipeline funnel" hint="share of total" tone="blue">
            <FunnelBar funnel={conversionFunnel} />
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ChartCard title="Status breakdown" hint="current mix" tone="violet">
            <div className="flex flex-col justify-center h-full">
              <div className="flex gap-px h-2.5 rounded-[3px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {statusData.map(d => (
                  <div key={d.key} style={{ width: `${(d.value / stats.total) * 100}%`, backgroundColor: d.color }} />
                ))}
              </div>
              <div className="mt-2">
                {statusData.map(d => (
                  <div key={d.key} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0 text-[13px]">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="tabular-nums font-semibold text-slate-900 dark:text-white">
                      {d.value}
                      <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">
                        {Math.round((d.value / stats.total) * 100)}%
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <ChartCard title="Applications over time" tone="indigo">
            <ResponsiveContainer width="100%" height={188}>
              <AreaChart data={monthlyData.length > 0 ? monthlyData : [{ name: 'No data', count: 0 }]} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" tick={axisTick} stroke={axisStroke} tickLine={false} axisLine={false} tickMargin={8} padding={{ left: 8, right: 8 }} />
                <YAxis width={28} domain={[0, dataMax => dataMax + 1]} tick={axisTick} stroke={axisStroke} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={v => [v, 'applications']} cursor={{ stroke: '#3B82F6', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="count" fill="url(#colorApps)" stroke="#3B82F6" strokeWidth={1.5} dot={{ r: 2, strokeWidth: 0, fill: '#3B82F6' }} activeDot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ChartCard title="Application rhythm" hint="last 18 weeks" tone="violet">
            {heatmap ? (
              <div className="flex flex-col justify-center h-full">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white">{heatmap.avg}</span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">avg applications / week</span>
                </div>
                <div className="mt-4">
                  <div className="relative h-3">
                    {heatmap.labels.map((label, wi) => label ? (
                      <span key={wi} className="absolute top-0 text-[9px] font-medium text-slate-400 dark:text-slate-500" style={{ left: wi * 14 }}>{label}</span>
                    ) : null)}
                  </div>
                  <div className="flex gap-[3px] mt-1">
                    {heatmap.weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((count, di) => (
                          <div
                            key={di}
                            title={`${count} application${count === 1 ? '' : 's'}`}
                            className="w-[11px] h-[11px] rounded-[2px]"
                            style={{ backgroundColor: heatColor(count, heatmap.max, dark) }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                  <span>{heatmap.total} logged in range</span>
                  <span>{heatmap.range}</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-8 text-[13px] text-slate-400 dark:text-slate-500">
                No dated applications in range
              </div>
            )}
          </ChartCard>
        </div>

        <div className="col-span-12">
          <ChartCard title="Technologies & tags" hint={`${topTags.length} tracked`} tone="amber">
            {topTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {topTags.map((t, i) => (
                  <span
                    key={t.tag}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${
                      i === 0
                        ? 'border-indigo-200 bg-indigo-50/60 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'border-slate-200 text-slate-600 dark:border-slate-700/80 dark:text-slate-300'
                    }`}
                  >
                    {t.tag}
                    <span className="tabular-nums text-[10px] font-semibold text-slate-400 dark:text-slate-500">{t.count}</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="py-4 text-[13px] text-slate-400 dark:text-slate-500">
                Add tags to your applications to see them here.
              </div>
            )}
          </ChartCard>
        </div>

      </div>
    </div>
  )
}
