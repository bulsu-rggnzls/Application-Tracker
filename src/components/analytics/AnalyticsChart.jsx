import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts'
import { Button, Card } from '../ui'

const COLORS = {
  wishlist: '#f59e0b',
  applied: '#3b82f6',
  interviewing: '#8b5cf6',
  offer: '#10b981',
  rejected: '#f43f5e',
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

export default function AnalyticsChart({ applications }) {
  const [tab, setTab] = useState('status')

  const statusData = useMemo(() => {
    const counts = {}
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name] || '#6366f1',
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

  const total = applications.length

  return (
    <Card className="!rounded-xl !p-5">
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={() => setTab('status')}
          variant={tab === 'status' ? 'indigo' : 'secondary'}
          className="!rounded-lg !text-xs"
        >
          By Status
        </Button>
        <Button
          onClick={() => setTab('monthly')}
          variant={tab === 'monthly' ? 'indigo' : 'secondary'}
          className="!rounded-lg !text-xs"
        >
          Over Time
        </Button>
      </div>

      {tab === 'status' ? (
        <div className="relative h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={65}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={(v, n) => [`${v} applications`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{total}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">total</span>
          </div>
          <div className="absolute -bottom-1 inset-x-0 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                <span className="font-medium text-slate-400 dark:text-slate-500">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData.length > 0 ? monthlyData : [{ name: 'No data', count: 0 }]} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={axisTick} stroke="#e2e8f0" tickLine={false} axisLine={false} tickMargin={10} padding={{ left: 12, right: 12 }} />
            <YAxis allowDecimals={false} tick={axisTick} stroke="#e2e8f0" tickLine={false} axisLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={v => [v, 'applications']} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={42} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}