import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

function Pagination({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('flex w-full items-center justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }) {
  return <ul data-slot="pagination-content" className={cn('flex items-center gap-1', className)} {...props} />
}

function PaginationItem({ className, ...props }) {
  return <li data-slot="pagination-item" className={cn('flex items-center', className)} {...props} />
}

function PaginationLink({ className, isActive, disabled = false, children, onClick, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      onClick={onClick}
      className={cn(
        'flex min-w-8 h-8 items-center justify-center px-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
        isActive
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function PaginationPrevious({ className, text = 'Previous', ...props }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn('gap-1 pl-1.5! pr-2.5!', className)}
      {...props}
    >
      <ChevronLeft size={14} />
      <span className="hidden sm:inline">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({ className, text = 'Next', ...props }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn('gap-1 pl-2.5! pr-1.5!', className)}
      {...props}
    >
      <span className="hidden sm:inline">{text}</span>
      <ChevronRight size={14} />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex h-8 w-8 items-center justify-center text-slate-400 dark:text-slate-500', className)}
      {...props}
    >
      <MoreHorizontal size={16} />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
