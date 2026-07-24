export default function EmptyState({ message = 'No data found' }) {
  return (
    <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">{message}</div>
  )
}
