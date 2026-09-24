import { useState } from 'react'

export default function useCompanyLogo(company) {
  const [error, setError] = useState(false)
  const initials = company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return { error, onError: () => setError(true), initials }
}
