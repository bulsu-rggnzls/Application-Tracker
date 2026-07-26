import { useState } from 'react'

export default function CompanyLogo({ domain, company }) {
  const [error, setError] = useState(false)
  const initials = company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  if (error || !domain) {
    return (
      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shrink-0">
        {initials}
      </div>
    )
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={company}
      onError={() => setError(true)}
      className="w-10 h-10 rounded-lg object-contain p-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm shrink-0"
    />
  )
}