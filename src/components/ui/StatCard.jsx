export default function StatCard({ label, value, sub, icon: Icon, color = 'indigo', className = '' }) {
  const gradients = {
    indigo: 'from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 border-indigo-200 dark:border-indigo-700',
    orange: 'from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60 border-orange-200 dark:border-orange-700',
    emerald: 'from-cyan-50 to-emerald-50 dark:from-cyan-950/60 dark:to-emerald-950/60 border-emerald-200 dark:border-emerald-700',
    amber: 'from-yellow-50 to-amber-50 dark:from-yellow-950/60 dark:to-amber-950/60 border-amber-300 dark:border-amber-600',
  }
  const labelColors = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    orange: 'text-orange-600 dark:text-orange-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
  }
  const badgeColors = {
    indigo: 'bg-indigo-200 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-200',
    orange: 'bg-orange-200 dark:bg-orange-700 text-orange-600 dark:text-orange-200',
    emerald: 'bg-emerald-200 dark:bg-emerald-700 text-emerald-600 dark:text-emerald-200',
    amber: 'bg-amber-200 dark:bg-amber-700 text-amber-600 dark:text-amber-200',
  }

  return (
    <div className={`rounded-lg p-3 shadow-sm border bg-gradient-to-br ${gradients[color] || gradients.indigo} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold uppercase tracking-wider ${labelColors[color] || labelColors.indigo}`}>{label}</p>
        {Icon && (
          <span className={`flex items-center justify-center w-11 h-11 rounded-xl shadow-sm ${badgeColors[color] || badgeColors.indigo}`}>
            <Icon size={24} />
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}
