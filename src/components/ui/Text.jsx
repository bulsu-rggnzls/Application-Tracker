const variants = {
  body: 'text-sm text-slate-600 dark:text-slate-300',
  subtle: 'text-xs text-slate-500 dark:text-slate-400',
  'subtle-sm': 'text-[11px] text-slate-500 dark:text-slate-400',
  muted: 'text-xs text-slate-400 dark:text-slate-500',
  'muted-sm': 'text-[11px] text-slate-400 dark:text-slate-500',
}

export default function Text({ variant = 'body', className = '', children, ...props }) {
  return (
    <p className={`${variants[variant] || variants.body} ${className}`} {...props}>
      {children}
    </p>
  )
}
