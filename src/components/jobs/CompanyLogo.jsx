import { useState } from 'react'

export default function CompanyLogo({ domain, company, size = 'md' }) {
  const [error, setError] = useState(false)
  const initials = company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const sizes = {
    sm: 'w-8 h-8 rounded-md text-xs',
    md: 'w-10 h-10 rounded-lg text-sm',
    lg: 'w-12 h-12 rounded-xl text-base',
  }
  const boxClass = sizes[size] || sizes.md

  if (error || !domain) {
    return (
      <div className={`${boxClass} bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shrink-0`}>
        {initials}
      </div>
    )
  }

  return (
    <img
      src={`https://icon.horse/icon/${domain}`}
      alt={company}
      onError={() => setError(true)}
      className={`${boxClass} object-contain p-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm shrink-0`}
    />
  )
}
