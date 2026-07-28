import { useState, useMemo } from 'react'
import { BarChart2, Sparkles, Rocket, Target, TrendingUp, Award, Clock, Briefcase } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts'

const STATUS_COLORS = {
  wishlist: '#f59e0b',
  applied: '#3b82f6',
  interviewing: '#8b5cf6',
  offer: '#10b981',
  rejected: '#f43f5e',
}

const STATUS_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CARD_STYLES = {
  total: { from: 'from-indigo-50', to: 'to-purple-50', border: 'border-indigo-200', darkFrom: 'dark:from-indigo-950/60', darkTo: 'dark:to-purple-950/60', darkBorder: 'dark:border-indigo-700' },
  response: { from: 'from-cyan-50', to: 'to-emerald-50', border: 'border-emerald-200', darkFrom: 'dark:from-cyan-950/60', darkTo: 'dark:to-emerald-950/60', darkBorder: 'dark:border-emerald-700' },
  offer: { from: 'from-yellow-50', to: 'to-amber-50', border: 'border-amber-300', darkFrom: 'dark:from-yellow-950/60', darkTo: 'dark:to-amber-950/60', darkBorder: 'dark:border-amber-600' },
  time: { from: 'from-amber-50', to: 'to-orange-50', border: 'border-orange-200', darkFrom: 'dark:from-amber-950/60', darkTo: 'dark:to-orange-950/60', darkBorder: 'dark:border-orange-700' },
}

const StatCard = ({ label, value, sub, variant }) => {
  const s = CARD_STYLES[variant] || CARD_STYLES.total
  return (
    <div className={`relative overflow-hidden rounded-lg p-4 shadow-sm border ${s.border} ${s.darkBorder} bg-gradient-to-br ${s.from} ${s.to} ${s.darkFrom} ${s.darkTo} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

const ChartCard = ({ title, children, action }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {action && <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{action}</button>}
    </div>
    <div className="p-5">{children}</div>
  </div>
)

function WarmUpState({ stats, applications }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-3">
        <Rocket className="text-indigo-600 dark:text-indigo-400" size={22} />
      </div>
      <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">You're just getting started!</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
        Add a few more applications to unlock full analytics.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700">
          <Briefcase size={14} className="text-indigo-500 mb-0.5" />
          <p className="text-base font-bold text-slate-900 dark:text-white">{stats.total}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Applications</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700">
          <TrendingUp size={14} className="text-emerald-500 mb-0.5" />
          <p className="text-base font-bold text-slate-900 dark:text-white">{stats.responseRate}%</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Response Rate</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700">
          <Target size={14} className="text-purple-500 mb-0.5" />
          <p className="text-base font-bold text-slate-900 dark:text-white">{stats.totalInterviews}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Interviews</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700">
          <Award size={14} className="text-amber-500 mb-0.5" />
          <p className="text-base font-bold text-slate-900 dark:text-white">{stats.offers}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Offers</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <Sparkles size={12} />
        <span>Drag cards on the Kanban board to track progress</span>
      </div>
    </div>
  )
}

function FunnelBar({ funnel }) {
  const colors = ['#6366f1', '#3b82f6', '#8b5cf6', '#10b981']
  const total = funnel[0]?.count || 1
  return (
    <div className="space-y-4">
      <div className="flex h-10 rounded-lg overflow-hidden bg-slate-100">
        {funnel.map((f, i) => {
          const width = (f.count / total) * 100
          return (
            <div
              key={f.stage}
              style={{ width: `${width}%`, backgroundColor: width > 0 ? colors[i] : 'transparent' }}
              className="h-full flex items-center justify-center text-[11px] font-semibold text-white transition-all duration-500 first:rounded-l-lg last:rounded-r-lg"
            >
              {width > 0 && f.count}
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {funnel.map((f, i) => (
          <div key={f.stage} className="text-center">
            <div className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
              <p className="text-xs font-semibold text-slate-700">{f.stage}</p>
            </div>
            <p className="text-[11px] text-slate-400">{f.count} ({f.pct}%)</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage({ applications }) {
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
    const rejected = filteredApps.filter(a => a.status === 'rejected').length
    const responseRate = applied > 0 ? Math.round(((interviewing + offers) / applied) * 100) : 0
    const offerRate = applied > 0 ? Math.round((offers / applied) * 100) : 0
    const avgTimeToOffer = calculateAvgTimeToOffer(filteredApps)
    const totalInterviews = filteredApps.reduce((sum, a) => sum + (a.interviews?.length || 0), 0)
    return { total, applied, interviewing, offers, rejected, responseRate, offerRate, avgTimeToOffer, totalInterviews }
  }, [filteredApps])

  const prevStats = useMemo(() => {
    if (timeRange === 'all') return null
    const monthsBack = timeRange === '3m' ? 6 : timeRange === '6m' ? 12 : 24
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - monthsBack)
    const start = new Date()
    start.setMonth(start.getMonth() - (timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12))
    const prevApps = applications.filter(app => app.dateApplied && new Date(app.dateApplied) >= cutoff && new Date(app.dateApplied) < start)
    if (prevApps.length === 0) return null
    const pApplied = prevApps.filter(a => a.status !== 'wishlist').length
    const pInterviewing = prevApps.filter(a => a.status === 'interviewing').length
    const pOffers = prevApps.filter(a => a.status === 'offer').length
    const pResponseRate = pApplied > 0 ? Math.round(((pInterviewing + pOffers) / pApplied) * 100) : 0
    const pOfferRate = pApplied > 0 ? Math.round((pOffers / pApplied) * 100) : 0
    return { responseRate: pResponseRate, offerRate: pOfferRate, total: prevApps.length }
  }, [applications, timeRange])

  const statusData = useMemo(() => {
    const counts = {}
    filteredApps.forEach(app => { counts[app.status] = (counts[app.status] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({
      name: STATUS_LABELS[name] || name,
      value,
      color: STATUS_COLORS[name] || '#6366f1',
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

  const interviewsByMonth = useMemo(() => {
    const months = {}
    filteredApps.forEach(app => {
      (app.interviews || []).forEach(iv => {
        const d = new Date(iv.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        months[key] = (months[key] || 0) + 1
      })
    })
    const sorted = Object.entries(months).sort()
    return sorted.map(([name, count]) => {
      const [year, month] = name.split('-')
      return { name: `${MONTH_LABELS[parseInt(month) - 1]} ${year}`, count }
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

  const maxMonthlyCount = Math.max(...monthlyData.map(d => d.count), 1)
  const yAxisDomain = maxMonthlyCount <= 3 ? [0, 5] : [0, 'auto']
  const yAxisTicks = maxMonthlyCount <= 3 ? [0, 1, 2, 3, 4, 5] : undefined

  const maxInterviewCount = Math.max(...interviewsByMonth.map(d => d.count), 1)
  const yAxisDomainInterviews = maxInterviewCount <= 3 ? [0, 5] : [0, 'auto']
  const yAxisTicksInterviews = maxInterviewCount <= 3 ? [0, 1, 2, 3, 4, 5] : undefined

  const maxWeekdayCount = Math.max(...activityByWeekday.map(d => d.count), 1)
  const yAxisDomainWeekday = maxWeekdayCount <= 3 ? [0, 5] : [0, 'auto']
  const yAxisTicksWeekday = maxWeekdayCount <= 3 ? [0, 1, 2, 3, 4, 5] : undefined

  if (filteredApps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-12">
          <BarChart2 size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No data yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Add some applications to see analytics</p>
        </div>
      </div>
    )
  }

  const isWarmUp = filteredApps.length < 5

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Track your job search performance</p>
          </div>
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

        {isWarmUp && (
          <WarmUpState stats={stats} applications={filteredApps} />
        )}

        {!isWarmUp && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Applications" value={stats.total} sub={`${stats.applied} actively applied`} variant="total" />
            <StatCard label="Response Rate" value={`${stats.responseRate}%`} sub={`${prevStats ? `prev ${timeRange === 'all' ? 'period' : timeRange}: ${prevStats.responseRate}%` : 'No prior data'}`} variant="response" />
            <StatCard label="Offer Rate" value={`${stats.offerRate}%`} sub={`${stats.offers} offers from ${stats.applied} applications`} variant="offer" />
            <StatCard label="Avg. Time to Offer" value={stats.avgTimeToOffer ? `${stats.avgTimeToOffer}d` : 'N/A'} sub="From application to offer" variant="time" />
          </div>
        )}

        {!isWarmUp && (
          <ChartCard title="Pipeline Funnel">
            <FunnelBar funnel={conversionFunnel} />
          </ChartCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartCard title="Application Status">
            {statusData.length > 0 ? (
              <div className="overflow-visible">
                <ResponsiveContainer width="100%" height={280}>
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={true}
                    >
                      {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={v => [v, 'applications']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">No data</div>
            )}
          </ChartCard>

          <ChartCard title="Pipeline Funnel">
            {isWarmUp ? (
              <FunnelBar funnel={conversionFunnel} />
            ) : (
              <div className="space-y-3">
                {conversionFunnel.map((f, i) => (
                  <div key={f.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{f.stage}</span>
                      <span className="text-slate-500 dark:text-slate-400">{f.count} <span className="font-normal">({f.pct}%)</span></span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${f.pct}%`, backgroundColor: i === 0 ? '#6366f1' : STATUS_COLORS[Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k] === f.stage)?.toLowerCase()] || '#6366f1' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>

          <ChartCard title="Applications Over Time">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData.length > 0 ? monthlyData : [{ name: 'No data', count: 0 }]}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <YAxis domain={yAxisDomain} ticks={yAxisTicks} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [v, 'applications']} />
                <Area type="monotone" dataKey="count" fill="url(#colorApplications)" stroke="#6366f1" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Interviews Scheduled">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interviewsByMonth.length > 0 ? interviewsByMonth : [{ name: 'No data', count: 0 }]}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <YAxis domain={yAxisDomainInterviews} ticks={yAxisTicksInterviews} allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [v, 'interviews']} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarWidth={40} />
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
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No technologies tracked yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Add tags to your applications to see them here</p>
              </div>
            )}
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Activity by Day of Week">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={activityByWeekday}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <YAxis domain={yAxisDomainWeekday} ticks={yAxisTicksWeekday} allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [v, 'applications']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarWidth={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Conversion Rates">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Application → Interview</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.applied > 0 ? Math.round((stats.interviewing / stats.applied) * 100) : 0}%</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stats.interviewing} of {stats.applied} applications</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Interview → Offer</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.interviewing > 0 ? Math.round((stats.offers / stats.interviewing) * 100) : 0}%</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stats.offers} of {stats.interviewing} interviews</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Pipeline Health</p>
                <div className="space-y-3">
                  {pipelineData.map((p) => (
                    <div key={p.stage}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.stage}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">{p.count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pipelineData[0]?.count > 0 ? (p.count / pipelineData[0].count) * 100 : 0}%`,
                            backgroundColor: p.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

function calculateAvgTimeToOffer(apps) {
  const offered = apps.filter(a => a.status === 'offer' && a.dateApplied && a.activityLog)
  if (offered.length === 0) return null
  let totalDays = 0
  let count = 0
  offered.forEach(app => {
    const applied = new Date(app.dateApplied)
    const offerLog = app.activityLog.find(l => l.action === 'status_change' && l.details?.toLowerCase().includes('offer'))
    if (offerLog) {
      const offerDate = new Date(offerLog.timestamp)
      totalDays += (offerDate - applied) / (1000 * 60 * 60 * 24)
      count++
    }
  })
  return count > 0 ? Math.round(totalDays / count) : null
}