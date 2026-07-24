const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', PHP: '₱' }
const PERIOD_LABELS = { yearly: '/yr', hourly: '/hr', monthly: '/mo', contract: '/contract' }

export default function formatSalary(salary) {
  if (!salary) return null
  if (typeof salary === 'string') return salary

  const { min, max, currency, period } = salary
  const sym = CURRENCY_SYMBOLS[currency] || '$'
  const per = PERIOD_LABELS[period || 'yearly'] || '/yr'

  const fmt = (n) => {
    const v = Number(n)
    if (!v && v !== 0) return null
    return v >= 1000 ? `${sym}${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `${sym}${v.toLocaleString()}`
  }

  const minStr = fmt(min)
  const maxStr = fmt(max)

  if (minStr && maxStr) return `${minStr} – ${maxStr}${per}`
  if (minStr) return `From ${minStr}${per}`
  if (maxStr) return `Up to ${maxStr}${per}`
  return null
}

export function getSalaryNumeric(salary) {
  if (!salary) return 0
  if (typeof salary === 'string') {
    return parseInt(salary.replace(/[^0-9]/g, '')) || 0
  }
  const val = Math.max(Number(salary.max) || 0, Number(salary.min) || 0)
  return val
}
