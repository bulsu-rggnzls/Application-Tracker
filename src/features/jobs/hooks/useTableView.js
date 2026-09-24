import { useState, useMemo, useEffect } from 'react'
import { getSalaryNumeric } from '@/utils/formatSalary'
import { STATUSES, statusLabel, statusChip } from '@/lib/status'

export default function useTableView(applications, onDelete) {
  const [selected, setSelected] = useState(new Set())
  const [sort, setSort] = useState({ key: 'company', dir: 'asc' })
  const [locationFilter, setLocationFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [tagFilter, setTagFilter] = useState([])
  const [dateRange, setDateRange] = useState('all')
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '', sortHigh: false })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const locationOptions = useMemo(() => {
    const locs = [...new Set(applications.map(a => a.location).filter(Boolean))]
    return locs.map(l => ({ label: l, value: l }))
  }, [applications])

  const statusOptions = useMemo(() => {
    return STATUSES.map(s => ({
      label: statusLabel(s),
      value: s,
      badge: `text-xs font-medium px-2 py-0.5 rounded-md border ${statusChip(s)}`,
    }))
  }, [])

  const allTags = useMemo(() => {
    return [...new Set(applications.flatMap(a => a.tags))].sort()
  }, [applications])

  const filtered = useMemo(() => {
    let data = [...applications]

    if (locationFilter.length > 0) {
      data = data.filter(a => locationFilter.includes(a.location))
    }
    if (statusFilter.length > 0) {
      data = data.filter(a => statusFilter.includes(a.status))
    }
    if (tagFilter.length > 0) {
      data = data.filter(a => a.tags.some(t => tagFilter.includes(t)))
    }
    if (dateRange !== 'all') {
      const cutoff = new Date()
      const days = parseInt(dateRange)
      cutoff.setDate(cutoff.getDate() - days)
      data = data.filter(a => a.dateApplied && new Date(a.dateApplied) >= cutoff)
    }
    if (salaryRange.min || salaryRange.max) {
      data = data.filter(a => {
        if (!a.salary) return false
        const num = getSalaryNumeric(a.salary)
        if (!num) return true
        if (salaryRange.min && num < parseInt(salaryRange.min) * 1000) return false
        if (salaryRange.max && num > parseInt(salaryRange.max) * 1000) return false
        return true
      })
    }

    data.sort((a, b) => {
      let aVal = a[sort.key]
      let bVal = b[sort.key]
      if (sort.key === 'dateApplied') {
        aVal = aVal || '0'
        bVal = bVal || '0'
      }
      if (salaryRange.sortHigh && sort.key === 'salary') {
        const aNum = getSalaryNumeric(a.salary)
        const bNum = getSalaryNumeric(b.salary)
        return bNum - aNum
      }
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = (bVal || '').toLowerCase()
      }
      if (aVal < bVal) return sort.dir === 'asc' ? -1 : 1
      if (aVal > bVal) return sort.dir === 'asc' ? 1 : -1
      return 0
    })

    return data
  }, [applications, sort, locationFilter, statusFilter, tagFilter, dateRange, salaryRange])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setPage(1)
  }, [locationFilter, statusFilter, tagFilter, dateRange, salaryRange, sort, applications])

  const handleSort = (key, dir) => {
    setSort({ key, dir })
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(a => a.id)))
    }
  }

  const handleBulkDelete = () => {
    selected.forEach(id => onDelete(id))
    setSelected(new Set())
  }

  const handlePageSizeChange = (size) => {
    setPageSize(parseInt(size))
    setPage(1)
  }

  return {
    selected,
    sort,
    locationFilter,
    setLocationFilter,
    statusFilter,
    setStatusFilter,
    tagFilter,
    setTagFilter,
    dateRange,
    setDateRange,
    salaryRange,
    setSalaryRange,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    locationOptions,
    statusOptions,
    allTags,
    filtered,
    totalPages,
    currentPage,
    pageItems,
    handleSort,
    toggleSelect,
    toggleAll,
    handleBulkDelete,
  }
}
