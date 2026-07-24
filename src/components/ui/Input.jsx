export default function Input({ className = '', icon, ...props }) {
  return (
    <div className="relative flex-1 max-w-xs">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}
      <input
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-1.5 text-sm text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}
