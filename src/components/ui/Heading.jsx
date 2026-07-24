const sizes = {
  xs: 'text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider',
  sm: 'text-sm font-semibold text-slate-900 dark:text-white',
  md: 'text-lg font-semibold text-slate-900 dark:text-white',
  lg: 'text-2xl font-bold text-slate-900 dark:text-white',
}

export default function Heading({ size = 'xs', className = '', children, ...props }) {
  const Tag = size === 'lg' ? 'h1' : size === 'md' ? 'h2' : size === 'sm' ? 'h3' : 'h4'
  return (
    <Tag className={`${sizes[size] || sizes.xs} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
