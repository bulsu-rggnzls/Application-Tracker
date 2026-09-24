import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button, Card } from '@/components/ui'
import useAnalyticsChart from '../hooks/useAnalyticsChart'

const tooltipStyle = {
  backgroundColor: 'var(--surface)',
  borderRadius: '10px',
  border: '1px solid var(--border)',
  padding: '8px 12px',
  fontSize: '12px',
  color: 'var(--text)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
}
const tooltipItemStyle = { color: 'var(--text)' }
const axisTick = { fill: 'var(--text-subtle)', fontSize: 12 }
const gridStroke = 'var(--border-subtle)'

export default function AnalyticsChart({ applications }) {
  const { tab, setTab, statusData, monthlyData, total } = useAnalyticsChart(applications)

  return (
    <Card padded>
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={() => setTab('status')}
          variant={tab === 'status' ? 'indigo' : 'secondary'}
          size="sm"
        >
          By Status
        </Button>
        <Button
          onClick={() => setTab('monthly')}
          variant={tab === 'monthly' ? 'indigo' : 'secondary'}
          size="sm"
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
                <span className="text-text-secondary">{d.name}</span>
                <span className="font-medium text-slate-400 dark:text-slate-500">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData.length > 0 ? monthlyData : [{ name: 'No data', count: 0 }]} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={axisTick} stroke="var(--border)" tickLine={false} axisLine={false} tickMargin={10} padding={{ left: 12, right: 12 }} />
            <YAxis allowDecimals={false} tick={axisTick} stroke="var(--border)" tickLine={false} axisLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={v => [v, 'applications']} cursor={{ fill: 'var(--brand-soft)' }} />
            <Bar dataKey="count" fill="var(--brand)" radius={[6, 6, 0, 0]} maxBarSize={42} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}