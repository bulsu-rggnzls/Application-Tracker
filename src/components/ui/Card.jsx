import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const cardVariants = cva(
  'bg-surface border border-border rounded-xl shadow-sm transition-ui',
  {
    variants: {
      interactive: {
        true: 'hover:shadow-md hover:-translate-y-0.5',
        false: '',
      },
      padded: {
        true: 'p-5',
        false: '',
      },
      flush: {
        true: 'overflow-hidden',
        false: '',
      },
    },
    defaultVariants: {
      interactive: false,
      padded: false,
      flush: false,
    },
  },
)

export default function Card({
  interactive,
  padded,
  flush,
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(cardVariants({ interactive, padded, flush }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
