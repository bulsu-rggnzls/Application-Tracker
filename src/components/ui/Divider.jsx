import { cn } from '@/lib/utils'

export default function Divider({ className }) {
  return (
    <div
      className={cn('border-t border-border-subtle dark:border-slate-700/50', className)}
    />
  )
}
