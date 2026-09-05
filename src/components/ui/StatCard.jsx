export default function StatCard({ label, value, sub, icon: Icon, color = 'indigo', className = '' }) {
  const accents = {
    indigo: 'border-indigo-200/80 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/30',
    orange: 'border-orange-200/80 dark:border-orange-800/60 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/30',
    emerald: 'border-emerald-200/80 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/30',
    amber: 'border-amber-200/80 dark:border-amber-800/60 bg-gradient-to-br from-yellow-50/80 to-amber-50/50 dark:from-yellow-950/40 dark:to-amber-950/30',
  }
  const valueColors = {
    indigo: 'text-indigo-700 dark:text-indigo-300',
    orange: 'text-orange-700 dark:text-orange-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    amber: 'text-amber-700 dark:text-amber-300',
  }

  return (
    <div className={`rounded-xl border px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 ${accents[color] || accents.indigo} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className={`text-xl font-extrabold tracking-tight leading-tight mt-0.5 ${valueColors[color] || valueColors.indigo}`}>{value}</p>
          {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
        </div>
        {Icon && (
          <Icon size={18} className="text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={1.75} />
        )}
      </div>
    </div>
  )
}
