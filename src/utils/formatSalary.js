const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', PHP: '₱' }
const PERIOD_LABELS = { yearly: '/yr', hourly: '/hr', monthly: '/mo', contract: '/contract' }

function formatDecimal(value) {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function compact(n, sym) {
  const v = Number(n)
  if (!Number.isFinite(v) || v <= 0) return null
  const full = Math.abs(v)
  if (full >= 1e9) return `${sym}${formatDecimal(v / 1e9)}B`
  if (full >= 1e6) return `${sym}${formatDecimal(v / 1e6)}M`
  if (full >= 1e3) return `${sym}${formatDecimal(v / 1e3)}k`
  return `${sym}${v.toLocaleString()}`
}

export function formatSalaryRange(min, max, period = 'yearly', currency = 'USD') {
  const sym = CURRENCY_SYMBOLS[currency] || '$'
  const per = PERIOD_LABELS[period] || '/yr'
  const minStr = compact(min, sym)
  const maxStr = compact(max, sym)

  if (minStr && maxStr) return `${minStr} – ${maxStr}${per}`
  if (minStr) return `From ${minStr}${per}`
  if (maxStr) return `Up to ${maxStr}${per}`
  return null
}

export default function formatSalary(salary) {
  if (!salary) return null
  if (typeof salary === 'string') return salary
  return formatSalaryRange(salary.min, salary.max, salary.period, salary.currency)
}

export function getSalaryNumeric(salary) {
  if (!salary) return 0
  if (typeof salary === 'string') {
    return parseInt(salary.replace(/[^0-9]/g, '')) || 0
  }
  const val = Math.max(Number(salary.max) || 0, Number(salary.min) || 0)
  return val
}