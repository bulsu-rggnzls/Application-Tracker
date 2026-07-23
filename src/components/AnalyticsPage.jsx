import { useState, useMemo } from 'react'
import {
  BarChart2,
  Download, Filter
} from 'lucide-react'
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

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4">
    <p className="text-xs text-slate-500 font-medium">{label}</p>
    <p className="text-xl font-semibold text-slate-900 mt-0.5">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
)

const ChartCard = ({ title, children, action }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {action && <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{action}</button>}
    </div>
    <div className="p-5">{children}</div>
  </div>
)

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

  if (filteredApps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center p-12">
          <BarChart2 size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No data yet</h3>
          <p className="text-slate-500">Add some applications to see analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-500 text-sm mt-0.5">Track your job search performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Applications"
            value={stats.total}
            sub={`${stats.applied} actively applied`}
          />
          <StatCard
            label="Response Rate"
            value={`${stats.responseRate}%`}
            sub={`${prevStats ? `prev ${timeRange === 'all' ? 'period' : timeRange}: ${prevStats.responseRate}%` : 'No prior data'}`}
          />
          <StatCard
            label="Offer Rate"
            value={`${stats.offerRate}%`}
            sub={`${stats.offers} offers from ${stats.applied} applications`}
          />
          <StatCard
            label="Avg. Time to Offer"
            value={stats.avgTimeToOffer ? `${stats.avgTimeToOffer}d` : 'N/A'}
            sub="From application to offer"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartCard title="Application Status">
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={v => [v, 'applications']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Pipeline Funnel">
            <div className="space-y-3">
              {conversionFunnel.map((f, i) => (
                <div key={f.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{f.stage}</span>
                    <span className="text-slate-500">{f.count} <span className="font-normal">({f.pct}%)</span></span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${f.pct}%`, backgroundColor: i === 0 ? '#6366f1' : STATUS_COLORS[Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k] === f.stage)?.toLowerCase()] || '#6366f1' }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [v, 'applications']} />
                <Area type="monotone" dataKey="count" fill="url(#colorApplications)" stroke="#6366f1" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Interviews Scheduled" action={<Filter size={13} className="text-slate-400 hover:text-slate-600" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interviewsByMonth.length > 0 ? interviewsByMonth : [{ name: 'No data', count: 0 }]}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [v, 'interviews']} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarWidth={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Technologies & Tags">
            <div className="space-y-3">
              {topTags.length > 0 ? (
                topTags.map((t, i) => (
                  <div key={t.tag} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-mono">{i + 1}</span>
                        {t.tag}
                      </span>
                      <span className="text-slate-500">{t.count} applications</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(t.count / topTags[0].count) * 100}%`, backgroundColor: STATUS_COLORS[Object.keys(STATUS_COLORS)[i % Object.keys(STATUS_COLORS).length]] }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">No tags yet</p>
              )}
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Activity by Day of Week">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={activityByWeekday}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [v, 'applications']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarWidth={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Conversion Rates">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Application → Interview</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.applied > 0 ? Math.round((stats.interviewing / stats.applied) * 100) : 0}%</p>
                  <p className="text-xs text-slate-400 mt-1">{stats.interviewing} of {stats.applied} applications</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Interview → Offer</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.interviewing > 0 ? Math.round((stats.offers / stats.interviewing) * 100) : 0}%</p>
                  <p className="text-xs text-slate-400 mt-1">{stats.offers} of {stats.interviewing} interviews</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-3">Pipeline Health</p>
                <div className="space-y-3">
                  {pipelineData.map((p) => (
                    <div key={p.stage}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.stage}
                        </span>
                        <span className="text-slate-500">{p.count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
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