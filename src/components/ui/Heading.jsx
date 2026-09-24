import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const headingVariants = cva('font-semibold text-text dark:text-white', {
  variants: {
    size: {
      xs: 'text-xs uppercase tracking-wider text-text-subtle',
      sm: 'text-sm',
      md: 'text-lg',
      lg: 'text-2xl font-bold',
    },
    tone: {
      default: '',
      muted: 'text-text-subtle dark:text-slate-500',
      brand: 'text-brand-strong dark:text-brand',
    },
  },
  defaultVariants: {
    size: 'xs',
    tone: 'default',
  },
})

const tags = { lg: 'h1', md: 'h2', sm: 'h3', xs: 'h4' }

export default function Heading({
  size = 'xs',
  tone,
  className,
  children,
  ...props
}) {
  const Tag = tags[size] || 'h4'
  return (
    <Tag className={cn(headingVariants({ size, tone }), className)} {...props}>
      {children}
    </Tag>
  )
}
