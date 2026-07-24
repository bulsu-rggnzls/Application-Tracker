export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}
