import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-sm text-text-secondary dark:text-slate-300',
      subtle: 'text-xs text-text-muted dark:text-slate-400',
      'subtle-sm': 'text-[11px] text-text-muted dark:text-slate-400',
      muted: 'text-xs text-text-subtle',
      'muted-sm': 'text-[11px] text-text-subtle',
      label: 'text-xs font-medium text-text-muted',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

export default function Text({
  variant = 'body',
  className,
  children,
  ...props
}) {
  return (
    <p className={cn(textVariants({ variant }), className)} {...props}>
      {children}
    </p>
  )
}
