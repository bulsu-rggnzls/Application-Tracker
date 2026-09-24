import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const iconButtonVariants = cva(
  [
    'p-1.5 rounded-md transition-ui focus-ring cursor-pointer',
    'hover:bg-surface-muted dark:hover:bg-slate-700/50',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      color: {
        slate: 'text-text-subtle hover:text-text-secondary dark:hover:text-slate-300',
        indigo:
          'text-text-subtle hover:text-indigo-600 dark:hover:text-indigo-400',
        rose: 'text-text-subtle hover:text-rose-500 dark:hover:text-rose-400',
        'rose-600':
          'text-text-subtle hover:text-rose-600 dark:hover:text-rose-400',
      },
      active: {
        true: 'bg-surface-muted text-text',
        false: '',
      },
    },
    defaultVariants: {
      color: 'slate',
      active: false,
    },
  },
)

export default function IconButton({
  as: Tag = 'button',
  color = 'slate',
  active,
  className,
  children,
  type,
  ...props
}) {
  return (
    <Tag
      type={Tag === 'button' ? type ?? 'button' : type}
      className={cn(iconButtonVariants({ color, active }), className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
