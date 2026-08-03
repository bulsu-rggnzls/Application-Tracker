import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Button, Card } from '../ui'

const COLORS = {
  wishlist: '#f59e0b',
  applied: '#3b82f6',
  interviewing: '#8b5cf6',
  offer: '#10b981',
  rejected: '#f43f5e',
}

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
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
