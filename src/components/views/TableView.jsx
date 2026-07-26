import { useState, useMemo } from 'react'
import { Trash2, Edit3, ExternalLink } from 'lucide-react'
import { Table, Thead, Th, Tbody, Tr, Td, Badge, IconButton, EmptyState } from '../ui'
import CompanyLogo from '../jobs/CompanyLogo'
import extractDomain from '../../utils/extractDomain'
import getRelativeTime from '../../utils/getRelativeTime'
import formatSalary, { getSalaryNumeric } from '../../utils/formatSalary'
import SortOrderToggle from '../filters/SortOrderToggle'
import MultiSelectFilter from '../filters/MultiSelectFilter'
import TagFilter from '../filters/TagFilter'
import DateRangeFilter from '../filters/DateRangeFilter'
import SalaryRangeFilter from '../filters/SalaryRangeFilter'

const statusColors = {
  wishlist: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  applied: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  interviewing: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  offer: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  rejected: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
}

const statusBorder = {
  wishlist: 'border-l-amber-400',
  applied: 'border-l-blue-400',
  interviewing: 'border-l-purple-400',
  offer: 'border-l-emerald-400',
  rejected: 'border-l-rose-400',
}

export default function TableView({ applications, onEdit, onDelete, onSelect }) {
  const [selected, setSelected] = useState(new Set())
  const [sort, setSort] = useState({ key: 'company', dir: 'asc' })
  const [locationFilter, setLocationFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [tagFilter, setTagFilter] = useState([])
  const [dateRange, setDateRange] = useState('all')
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '', sortHigh: false })

  const locationOptions = useMemo(() => {
    const locs = [...new Set(applications.map(a => a.location).filter(Boolean))]
    return locs.map(l => ({ label: l, value: l }))
  }, [applications])

  const statusOptions = useMemo(() => {
    return ['wishlist', 'applied', 'interviewing', 'offer', 'rejected'].map(s => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s,
      badge: `text-xs font-medium px-2 py-0.5 rounded-md border ${statusColors[s]}`,
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

  return (
    <Table>
      {selected.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/70 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/40">
          <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium cursor-pointer">Delete all</button>
        </div>
      )}
      <Thead>
        <th className="w-10 px-4 py-3">
          <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer" />
        </th>
        <Th className="w-[180px]">
          <SortOrderToggle label="Company" currentSort={sort} onSortChange={handleSort} color="indigo" />
        </Th>
        <Th>
          <SortOrderToggle label="Role" currentSort={sort} onSortChange={handleSort} color="sky" />
        </Th>
        <Th>
          <MultiSelectFilter title="Location" options={locationOptions} selectedValues={locationFilter} onChange={setLocationFilter} color="teal" />
        </Th>
        <Th>
          <SalaryRangeFilter
            minSalary={salaryRange.min}
            maxSalary={salaryRange.max}
            sortHigh={salaryRange.sortHigh}
            onChange={setSalaryRange}
          />
        </Th>
        <Th>
          <MultiSelectFilter title="Status" options={statusOptions} selectedValues={statusFilter} onChange={setStatusFilter} color="purple" />
        </Th>
        <Th>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </Th>
        <Th>
          <TagFilter availableTags={allTags} selectedTags={tagFilter} onChange={setTagFilter} />
        </Th>
        <th className="w-24 px-3 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
      </Thead>
      <Tbody>
        {filtered.map((app, index) => {
          const domain = extractDomain(app.jobUrl)
          const isEven = index % 2 === 0
          return (
            <Tr
              key={app.id}
              onClick={() => onSelect(app)}
              className={`${isEven ? 'bg-slate-50/40 dark:bg-slate-800/20' : ''} ${
                selected.has(app.id) ? '!bg-indigo-50/60 dark:!bg-indigo-900/30' : ''
              } border-l-2 ${statusBorder[app.status] || 'border-l-transparent'}`}
            >
              <Td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer" />
              </Td>
              <Td className="px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <CompanyLogo domain={domain} company={app.company} />
                  <span className="font-medium text-slate-900 dark:text-white">{app.company}</span>
                </div>
              </Td>
              <Td className="px-3 py-3 text-slate-600 dark:text-slate-300">{app.role}</Td>
              <Td className="px-3 py-3 text-slate-500 dark:text-slate-400">{app.location || '-'}</Td>
              <Td className="px-3 py-3 text-slate-500 dark:text-slate-400">{formatSalary(app.salary) || '-'}</Td>
              <Td className="px-3 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${statusColors[app.status]}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </Td>
              <Td className="px-3 py-3 text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                {app.dateApplied ? getRelativeTime(app.dateApplied) : '-'}
              </Td>
              <Td className="px-3 py-3">
                <div className="flex gap-1 flex-wrap">
                  {app.tags.slice(0, 2).map(t => (
                    <Badge key={t} variant="table">{t}</Badge>
                  ))}
                  {app.tags.length > 2 && <span className="text-xs text-slate-400 dark:text-slate-500">+{app.tags.length - 2}</span>}
                </div>
              </Td>
              <Td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                <div className="flex gap-1 justify-end">
                  {app.jobUrl && (
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <IconButton color="indigo" onClick={() => onEdit(app)}><Edit3 size={14} /></IconButton>
                  <IconButton color="rose-600" onClick={() => onDelete(app.id)}><Trash2 size={14} /></IconButton>
                </div>
              </Td>
            </Tr>
          )
        })}
      </Tbody>
      {filtered.length === 0 && <EmptyState message="No applications match your filters" />}
    </Table>
  )
}
