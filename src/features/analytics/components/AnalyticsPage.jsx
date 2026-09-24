import { BarChart2, ChevronRight } from 'lucide-react'
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from 'recharts'
import WelcomeEmpty from '@/components/ui/WelcomeEmpty'
import StatStrip from '@/components/ui/StatStrip'
import { Heading, Text } from '@/components/ui'
import useAnalytics from '../hooks/useAnalytics'
import { STATUS_CHART_COLORS } from '@/lib/status'

const STATUS_COLORS = STATUS_CHART_COLORS

const RANGES = [
  { id: 'all', label: 'All' },
  { id: '1m', label: '1M' },
  { id: '3m', label: '3M' },
  { id: '6m', label: '6M' },
  { id: '12m', label: '1Y' },
]

const tooltipStyle = {
  backgroundColor: 'var(--surface)',
  borderRadius: '6px',
  border: '1px solid var(--border)',
  padding: '6px 10px',
  fontSize: '12px',
  color: 'var(--text)',
}
const tooltipItemStyle = { color: 'var(--text)' }

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
    <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface flex flex-col overflow-hidden">
      <header className={`flex items-center justify-between gap-3 px-4 pt-3 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r ${TONES[tone]}`}>
        <Heading size="sm" className="!text-[13px] tracking-tight">{title}</Heading>
        {hint && (
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-500">{hint}</span>
        )}
      </header>
      <div className="p-4 flex-1 flex flex-col">{children}</div>
    </section>
  )
}

function FunnelBar({ funnel }) {
  const colors = ['var(--text-subtle)', STATUS_COLORS.applied, STATUS_COLORS.interviewing, STATUS_COLORS.offer]
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
                className="h-full rounded-[3px] transition-ui duration-500"
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
  if (!count) return 'var(--border-subtle)'
  if (count === 1) return dark ? '#312E81' : '#C7D2FE'
  const t = count / max
  if (t <= 0.34) return dark ? '#3730A3' : '#A5B4FC'
  if (t <= 0.67) return dark ? '#4F46E5' : '#818CF8'
  return dark ? '#818CF8' : '#4F46E5'
}

export default function AnalyticsPage({ applications, onAdd, dark = false }) {
  const {
    timeRange,
    setTimeRange,
    filteredApps,
    stats,
    statusData,
    monthlyData,
    conversionFunnel,
    topTags,
    heatmap,
  } = useAnalytics(applications)

  const axisTick = { fill: 'var(--text-subtle)', fontSize: 11 }
  const gridStroke = 'var(--border-subtle)'
  const axisStroke = 'var(--border)'

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
            <Text variant="subtle-sm" className="!text-indigo-600 dark:!text-indigo-400 font-semibold tracking-wider uppercase">Pipeline intelligence</Text>
            <Heading size="md" className="!font-bold tracking-tight mt-0.5">Analytics</Heading>
            <Text variant="subtle" className="mt-0.5 tabular-nums">
              {stats.total} applications · {stats.interviewing} interviewing · {stats.offers} offers
            </Text>
          </div>
          <div className="flex p-0.5 bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 rounded-lg">
            {RANGES.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setTimeRange(r.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-ui cursor-pointer ${
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
                    <span className="flex items-center gap-2 text-text-secondary">
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
                    <stop offset="5%" stopColor="var(--chart-applied)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--chart-applied)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" tick={axisTick} stroke={axisStroke} tickLine={false} axisLine={false} tickMargin={8} padding={{ left: 8, right: 8 }} />
                <YAxis width={28} domain={[0, dataMax => dataMax + 1]} tick={axisTick} stroke={axisStroke} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} formatter={v => [v, 'applications']} cursor={{ stroke: 'var(--chart-applied)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="count" fill="url(#colorApps)" stroke="var(--chart-applied)" strokeWidth={1.5} dot={{ r: 2, strokeWidth: 0, fill: 'var(--chart-applied)' }} activeDot={{ r: 3 }} />
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
