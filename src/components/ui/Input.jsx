export default function Input({ className = '', containerClassName = 'relative flex-1 max-w-xs', icon, ...props }) {
  return (
    <div className={containerClassName}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2 text-sm text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  )
}
