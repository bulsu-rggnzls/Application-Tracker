export function Table({ className = '', children, ...props }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0 ${className}`} {...props}>
      <div className="overflow-auto flex-1 min-h-0 scrollbar-thin" style={{ scrollbarGutter: 'stable' }}>
        <table className="w-full table-fixed text-sm">{children}</table>
      </div>
    </div>
  )
}

export function Thead({ children }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        {children}
      </tr>
    </thead>
  )
}

export function Tfoot({ children }) {
  return (
    <tfoot className="sticky bottom-0 z-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
      {children}
    </tfoot>
  )
}

export function Th({ children, className = '', sortable, onClick, ...props }) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none' : ''} ${className}`}
      {...props}
    >
      <div className="flex items-center gap-1">{children}</div>
    </th>
  )
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>
}

export function Tr({ children, className = '', onClick, ...props }) {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
}

export function Td({ children, className = '', ...props }) {
  return (
    <td className={`px-4 py-3.5 ${className}`} {...props}>
      {children}
    </td>
  )
}
