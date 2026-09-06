const DOTS = {
  slate: 'bg-slate-400 dark:bg-slate-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
}

const VALUES = {
  slate: 'text-slate-900 dark:text-white',
  indigo: 'text-indigo-700 dark:text-indigo-300',
  violet: 'text-violet-700 dark:text-violet-300',
  blue: 'text-blue-700 dark:text-blue-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  amber: 'text-amber-700 dark:text-amber-300',
}

export default function StatStrip({ items, className = '' }) {
  return (
    <div className={`flex items-stretch divide-x divide-slate-200/80 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-sm overflow-hidden ${className}`}>
      {items.map(item => (
        <div key={item.label} className="flex-1 min-w-0 px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOTS[item.color] || DOTS.slate}`} />
            <span className="truncate">{item.label}</span>
          </p>
          <div className="flex items-baseline gap-2 mt-0.5 min-w-0">
            <p className={`text-xl font-extrabold tracking-tight tabular-nums leading-tight ${VALUES[item.color] || VALUES.slate}`}>{item.value}</p>
            {item.sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{item.sub}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
