/**
 * Single source of truth for application status presentation.
 * Components must import from here — never redefine status palettes.
 */

export const STATUSES = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']

export const STATUS_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

/** Semantic chart hexes (match CSS --chart-* / --status-* tokens) */
export const STATUS_CHART_COLORS = {
  wishlist: 'var(--chart-wishlist, #f59e0b)',
  applied: 'var(--chart-applied, #3b82f6)',
  interviewing: 'var(--chart-interviewing, #8b5cf6)',
  offer: 'var(--chart-offer, #10b981)',
  rejected: 'var(--chart-rejected, #f43f5e)',
}

/** Solid status hue (for dots, left borders, solid chips) */
export const STATUS_HUES = {
  wishlist: 'var(--status-wishlist)',
  applied: 'var(--status-applied)',
  interviewing: 'var(--status-interviewing)',
  offer: 'var(--status-offer)',
  rejected: 'var(--status-rejected)',
}

/** Soft chip: bg / text / border via semantic tokens (dark-safe) */
export const STATUS_CHIP = {
  wishlist:
    'bg-status-wishlist-bg text-status-wishlist-fg border-status-wishlist-border',
  applied:
    'bg-status-applied-bg text-status-applied-fg border-status-applied-border',
  interviewing:
    'bg-status-interviewing-bg text-status-interviewing-fg border-status-interviewing-border',
  offer: 'bg-status-offer-bg text-status-offer-fg border-status-offer-border',
  rejected:
    'bg-status-rejected-bg text-status-rejected-fg border-status-rejected-border',
}

/** Solid chip (filled) — for active filters */
export const STATUS_SOLID = {
  wishlist: 'bg-status-wishlist text-white border-status-wishlist',
  applied: 'bg-status-applied text-white border-status-applied',
  interviewing: 'bg-status-interviewing text-white border-status-interviewing',
  offer: 'bg-status-offer text-white border-status-offer',
  rejected: 'bg-status-rejected text-white border-status-rejected',
}

/** Soft background only (row tints, pills without borders) */
export const STATUS_SOFT_BG = {
  wishlist: 'bg-status-wishlist-bg text-status-wishlist-fg',
  applied: 'bg-status-applied-bg text-status-applied-fg',
  interviewing: 'bg-status-interviewing-bg text-status-interviewing-fg',
  offer: 'bg-status-offer-bg text-status-offer-fg',
  rejected: 'bg-status-rejected-bg text-status-rejected-fg',
}

/** Leading dot color */
export const STATUS_DOT = {
  wishlist: 'bg-status-wishlist',
  applied: 'bg-status-applied',
  interviewing: 'bg-status-interviewing',
  offer: 'bg-status-offer',
  rejected: 'bg-status-rejected',
}

/** Left accent bar (table rows) */
export const STATUS_ACCENT = {
  wishlist: 'border-l-status-wishlist',
  applied: 'border-l-status-applied',
  interviewing: 'border-l-status-interviewing',
  offer: 'border-l-status-offer',
  rejected: 'border-l-status-rejected',
}

export function statusChip(status) {
  return STATUS_CHIP[status] || STATUS_CHIP.applied
}

export function statusSolid(status) {
  return STATUS_SOLID[status] || STATUS_SOLID.applied
}

export function statusSoftBg(status) {
  return STATUS_SOFT_BG[status] || STATUS_SOFT_BG.applied
}

export function statusDot(status) {
  return STATUS_DOT[status] || STATUS_DOT.applied
}

export function statusAccent(status) {
  return STATUS_ACCENT[status] || STATUS_ACCENT.applied
}

export function statusLabel(status) {
  return STATUS_LABELS[status] || status
}
