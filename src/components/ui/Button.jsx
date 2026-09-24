import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Shared button base: consistent spacing, type, transition, focus, cursor.
 * Variants only override color/radius/emphasis.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-1.5',
    'font-medium cursor-pointer select-none',
    'transition-ui focus-ring',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'px-3 py-1.5 text-sm rounded-md text-on-brand bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
        secondary:
          'px-3 py-1.5 text-sm rounded-md text-text-muted border border-border bg-surface hover:bg-surface-muted dark:hover:bg-slate-800',
        ghost:
          'px-3 py-1.5 text-sm rounded-md text-text-muted hover:bg-surface-muted hover:text-text dark:hover:bg-slate-800',
        accept:
          'px-3 py-1.5 text-xs rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 flex-1',
        reject:
          'px-3 py-1.5 text-xs rounded-lg text-text-muted border border-border bg-surface hover:bg-surface-muted flex-1',
        indigo:
          'px-3 py-2.5 text-sm rounded-lg text-white bg-indigo-600 hover:bg-indigo-700',
        'indigo-outline':
          'px-3 py-2.5 text-sm rounded-lg text-text-muted border border-border bg-surface hover:bg-surface-muted',
        destructive:
          'px-3 py-2.5 text-sm rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/40',
        gradient:
          'px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:-translate-y-px',
        'gradient-tile':
          'p-3 rounded-xl text-white bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25',
        cta: [
          'rounded-full px-4 py-1.5 text-[13px] font-medium',
          'text-white bg-text hover:opacity-90 shadow-md',
          'dark:bg-white dark:text-slate-900',
        ].join(' '),
      },
      size: {
        sm: 'px-2 py-1 text-xs rounded-md',
        md: 'px-3 py-1.5 text-sm rounded-md',
        lg: 'px-5 py-2.5 text-sm rounded-lg',
        icon: 'p-1.5 rounded-md',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size,
  fullWidth,
  className,
  children,
  type,
  ...props
}) {
  return (
    <Tag
      type={Tag === 'button' ? type ?? 'button' : type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
