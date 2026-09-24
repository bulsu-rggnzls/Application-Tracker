import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 transition-ui',
  {
    variants: {
      variant: {
        meta: 'text-xs text-text-subtle bg-surface-muted px-2 py-0.5 rounded-md',
        'meta-sm':
          'text-[11px] text-text-subtle bg-surface-muted px-1.5 py-0.5 rounded',
        tag: 'text-xs font-medium text-text-subtle bg-surface-muted px-2 py-0.5 rounded-md',
        count:
          'text-xs text-white/80 font-bold tabular-nums bg-white/20 rounded-full px-1.5 py-0.5 leading-tight',
        'count-pill':
          'text-xs font-medium text-text-subtle bg-surface-muted px-2 py-0.5 rounded-full',
        table: 'text-xs text-text-subtle bg-surface-muted px-1.5 py-0.5 rounded',
        status:
          'text-xs font-medium px-2.5 py-1 rounded-md border',
        chip: 'text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize',
      },
      tone: {
        slate: 'bg-surface-muted text-text-subtle border-border',
        indigo:
          'bg-brand-soft text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        amber: '',
        blue: '',
        violet: '',
        emerald: '',
        rose: '',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'meta',
      tone: 'none',
    },
  },
)

export default function Badge({
  variant = 'meta',
  tone,
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(badgeVariants({ variant, tone }), className)}
      {...props}
    >
      {children}
    </span>
  )
}
