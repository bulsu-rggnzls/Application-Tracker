import { useState, useMemo, useEffect } from 'react'
import { getSalaryNumeric } from '@/utils/formatSalary'

const COLUMNS = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']

function compareItems(a, b, sort) {
  if (sort === 'salary') {
    return getSalaryNumeric(b.salary) - getSalaryNumeric(a.salary)
  }
  const da = a.dateApplied ? new Date(a.dateApplied).getTime() : 0
  const db = b.dateApplied ? new Date(b.dateApplied).getTime() : 0
  return db - da
}

export default function useBoardFilters(applications, onStatusChange) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [compact, setCompact] = useState(() => localStorage.getItem('boardCompact') === 'true')
  const [activeCol, setActiveCol] = useState(COLUMNS[0])
  const [moveTarget, setMoveTarget] = useState(null)

  useEffect(() => {
    localStorage.setItem('boardCompact', compact)
  }, [compact])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return applications.filter(app => {
      if (q && !app.company.toLowerCase().includes(q) && !app.role.toLowerCase().includes(q)) return false
      if (filter === 'remote' && !app.location?.toLowerCase().includes('remote')) return false
      if (filter === 'starred' && !app.starred) return false
      return true
    })
  }, [applications, search, filter])

  const activeItems = useMemo(
    () => visible.filter(a => a.status === activeCol).sort((a, b) => compareItems(a, b, sort)),
    [visible, activeCol, sort]
  )

  const handleMobileMove = (newStatus) => {
    if (!moveTarget) return
    if (newStatus !== moveTarget.status) {
      onStatusChange?.(moveTarget.id, newStatus, moveTarget.status)
    }
    setMoveTarget(null)
  }

  const closeMoveTarget = () => setMoveTarget(null)

  return {
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort,
    compact,
    setCompact,
    activeCol,
    setActiveCol,
    moveTarget,
    setMoveTarget,
    closeMoveTarget,
    visible,
    activeItems,
    handleMobileMove,
    compareItems: (a, b) => compareItems(a, b, sort),
    columns: COLUMNS,
  }
}
