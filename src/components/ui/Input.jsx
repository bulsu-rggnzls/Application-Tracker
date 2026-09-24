import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const inputVariants = cva(
  [
    'w-full text-sm transition-ui focus-ring',
    'placeholder:text-text-subtle',
    'disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      flush: {
        true: 'bg-transparent border-none outline-none focus:outline-none py-1',
        false: [
          'pl-3 pr-3 py-2 rounded-lg',
          'text-text-secondary bg-surface border border-border',
          'focus:border-brand focus:ring-2 focus:ring-brand-ring',
          'dark:bg-slate-800 dark:border-slate-700',
        ].join(' '),
      },
      hasIcon: {
        true: 'pl-9',
        false: '',
      },
      tone: {
        default: '',
        muted: 'bg-surface-muted border-border/80',
      },
    },
    compoundVariants: [
      {
        flush: false,
        hasIcon: true,
        class: 'pl-9',
      },
      {
        flush: true,
        hasIcon: true,
        class: 'pl-7',
      },
    ],
    defaultVariants: {
      flush: false,
      hasIcon: false,
      tone: 'default',
    },
  },
)

export default function Input({
  className,
  containerClassName = 'relative flex-1 max-w-xs',
  icon,
  flush,
  tone,
  ...props
}) {
  return (
    <div className={containerClassName}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={cn(
          inputVariants({ flush, hasIcon: Boolean(icon), tone }),
          className,
        )}
        {...props}
      />
    </div>
  )
}
