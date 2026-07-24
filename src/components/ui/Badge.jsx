const variants = {
  meta: 'inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40 px-2 py-0.5 rounded-md',
  'meta-sm': 'inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40 px-1.5 py-0.5 rounded',
  tag: 'inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40 px-2 py-0.5 rounded-md',
  count: 'text-xs text-white/80 font-bold tabular-nums bg-white/20 rounded-full px-1.5 py-0.5 leading-tight',
  'count-pill': 'text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full',
  table: 'text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded',
  status: 'text-xs font-medium px-2.5 py-1 rounded-md inline-flex items-center',
}

export default function Badge({ variant = 'meta', className = '', children, ...props }) {
  return (
    <span className={`${variants[variant] || variants.meta} ${className}`} {...props}>
      {children}
    </span>
  )
}
