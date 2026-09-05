import { useState, useMemo } from 'react'
import { BarChart2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid,
} from 'recharts'
import { Button, Card, Heading, Text } from '../ui'
import WelcomeEmpty from '../ui/WelcomeEmpty'

const STATUS_COLORS = {
  wishlist: '#f59e0b',
  applied: '#3B82F6',
  interviewing: '#8B5CF6',
  offer: '#10B981',
  rejected: '#EF4444',
}

const tooltipStyle = {
  backgroundColor: '#1e293b',
  borderRadius: '10px',
  border: 'none',
  padding: '8px 12px',
  fontSize: '12px',
  color: '#f8fafc',
  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
}
const tooltipItemStyle = { color: '#f8fafc' }
const axisTick = { fill: '#94A3B8', fontSize: 12 }
const gridStroke = '#F1F5F9'

const STATUS_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const ChartCard = ({ title, children, action }) => (
  <Card className="!bg-white dark:!bg-slate-900 border border-slate-100/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-white">{title}</h3>
      {action && <Button variant="ghost" className="!text-xs !text-indigo-600 hover:!text-indigo-700 !p-1"><span className="flex items-center gap-1">{action}</span></Button>}
    </div>
    <div className="flex-1 flex flex-col">{children}</div>
  </Card>
)

function FunnelBar({ funnel }) {
  const colors = ['#64748b', STATUS_COLORS.applied, STATUS_COLORS.interviewing, STATUS_COLORS.offer]
  const total = funnel[0]?.count || 1
  return (
    <div className="space-y-3.5">
      {funnel.map((f, i) => (
        <div key={f.stage}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
              {f.stage}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {f.count} <span className="text-slate-400 dark:text-slate-500 font-normal">({f.pct}%)</span>
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max((f.count / total) * 100, 6)}%`, backgroundColor: colors[i] }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage({ applications, onAdd }) {
  const [timeRange, setTimeRange] = useState('all')

  const filteredApps = useMemo(() => {
    if (timeRange === 'all') return applications
    const monthsBack = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - monthsBack)
    return applications.filter(app => app.dateApplied && new Date(app.dateApplied) >= cutoff)
  }, [applications, timeRange])

  const stats = useMemo(() => {
    const total = filteredApps.length
    const applied = filteredApps.filter(a => a.status !== 'wishlist').length
    const interviewing = filteredApps.filter(a => a.status === 'interviewing').length
    const offers = filteredApps.filter(a => a.status === 'offer').length
    return { total, applied, interviewing, offers }
  }, [filteredApps])

  const statusData = useMemo(() => {
    const counts = {}
    filteredApps.forEach(app => { counts[app.status] = (counts[app.status] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({
      name: STATUS_LABELS[name] || name,
      value,
      color: STATUS_COLORS[name] || '#64748B',
      key: name,
    }))
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

  const pipelineData = useMemo(() => {
    const stages = ['wishlist', 'applied', 'interviewing', 'offer']
    return stages.map(s => ({
      stage: STATUS_LABELS[s],
      count: filteredApps.filter(a => a.status === s).length,
      color: STATUS_COLORS[s],
    })).filter(s => s.count > 0 || ['wishlist', 'applied', 'interviewing', 'offer'].includes(s))
  }, [filteredApps])

  const topTags = useMemo(() => {
    const tagCounts = {}
    filteredApps.forEach(app => app.tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1))
    return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count }))
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

  const activityByWeekday = useMemo(() => {
    const days = Array(7).fill(0)
    filteredApps.forEach(app => {
      if (app.dateApplied) {
        const d = new Date(app.dateApplied)
        days[d.getDay()]++
      }
    })
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => ({ day, count: days[i] }))
  }, [filteredApps])

  if (applications.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
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
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
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
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-[96rem] mx-auto space-y-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
        </div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <ChartCard title="Pipeline Funnel">
              <FunnelBar funnel={conversionFunnel} />
            </ChartCard>
          </div>
          <ChartCard title="Conversion Rates">
            <div className="space-y-4">
              <Card className="!rounded-xl !p-4 !shadow-none !bg-slate-50 dark:!bg-slate-800/50">
                <Text variant="muted-sm" className="!uppercase !tracking-wider mb-2">Application → Interview</Text>
                <Heading size="sm" className="!text-3xl !font-bold" style={{ color: STATUS_COLORS.interviewing }}>{stats.applied > 0 ? Math.round((stats.interviewing / stats.applied) * 100) : 0}%</Heading>
                <Text variant="muted-sm" className="mt-1">{stats.interviewing} of {stats.applied} applications</Text>
              </Card>
              <Card className="!rounded-xl !p-4 !shadow-none !bg-slate-50 dark:!bg-slate-800/50">
                <Text variant="muted-sm" className="!uppercase !tracking-wider mb-2">Interview → Offer</Text>
                <Heading size="sm" className="!text-3xl !font-bold" style={{ color: STATUS_COLORS.offer }}>{stats.interviewing > 0 ? Math.round((stats.offers / stats.interviewing) * 100) : 0}%</Heading>
                <Text variant="muted-sm" className="mt-1">{stats.offers} of {stats.interviewing} interviews</Text>
              </Card>
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Application Status">
            {statusData.length > 0 ? (
              <div>
                <div className="relative h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        innerRadius={65}
                      >
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={(v, n) => [`${v} applications`, n]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">total</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                  {statusData.map(d => (
                    <div key={d.key} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                      <span className="ledger font-medium text-slate-400 dark:text-slate-500">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <Text variant="body" className="!text-slate-400">No data</Text>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Applications Over Time">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData.length > 0 ? monthlyData : [{ name: 'No data', count: 0 }]} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={axisTick} stroke="#e2e8f0" tickLine={false} axisLine={false} tickMargin={8} padding={{ left: 12, right: 12 }} />
                <YAxis width={32} domain={[0, dataMax => dataMax + 1]} tick={axisTick} stroke="#e2e8f0" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={v => [v, 'applications']} cursor={{ stroke: '#3B82F6', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="count" fill="url(#colorApps)" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Activity by Day of Week">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityByWeekday} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={axisTick} stroke="#e2e8f0" tickLine={false} axisLine={false} tickMargin={8} padding={{ left: 12, right: 12 }} />
                <YAxis domain={[0, dataMax => dataMax + 1]} allowDecimals={false} tick={axisTick} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={v => [v, 'applications']} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Technologies & Tags">
            {topTags.length > 0 ? (
              <div className="space-y-2">
                {topTags.map((t, i) => (
                  <div key={t.tag} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs flex items-center justify-center font-mono font-semibold shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{t.tag}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 shrink-0">{t.count} app{t.count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(t.count / topTags[0].count) * 100}%`, backgroundColor: STATUS_COLORS[Object.keys(STATUS_COLORS)[i % Object.keys(STATUS_COLORS).length]] }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                  <BarChart2 size={24} className="text-slate-400 dark:text-slate-500" />
                </div>
                <Text variant="body" className="!font-medium !text-slate-600 dark:!text-slate-400">No technologies tracked yet</Text>
                <Text variant="muted-sm" className="mt-1">Add tags to your applications to see them here</Text>
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}