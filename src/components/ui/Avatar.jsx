export default function Avatar({ children, className = '', size = 'md', ...props }) {
  const sizes = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-lg text-sm',
    lg: 'w-12 h-12 rounded-xl text-base',
  }
  return (
    <div
      className={`${sizes[size] || sizes.md} bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-900/30 dark:to-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-semibold text-slate-600 dark:text-slate-300 shrink-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
