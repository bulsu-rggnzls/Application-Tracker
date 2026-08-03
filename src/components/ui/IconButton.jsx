const colorStyles = {
  slate: 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
  indigo: 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400',
  rose: 'text-slate-400 hover:text-rose-500 dark:hover:text-rose-400',
  'rose-600': 'text-slate-400 hover:text-rose-600 dark:hover:text-rose-400',
}

export default function IconButton({ as: Tag = 'button', color = 'slate', className = '', children, ...props }) {
  return (
    <Tag
      className={`p-1.5 ${colorStyles[color] || colorStyles.slate} rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
