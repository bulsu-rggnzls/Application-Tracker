import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, Edit3, ExternalLink } from 'lucide-react'
import CompanyLogo from './CompanyLogo'
import extractDomain from '../utils/extractDomain'
import getRelativeTime from '../utils/getRelativeTime'

const statusColors = {
  wishlist: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  applied: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  interviewing: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  offer: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  rejected: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
}

const columns = [
  { key: 'company', label: 'Company', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'dateApplied', label: 'Applied', sortable: true },
  { key: 'tags', label: 'Tags', sortable: false },
]

export default function TableView({ applications, onEdit, onDelete, onSelect }) {
  const [sortKey, setSortKey] = useState('company')
  const [sortDir, setSortDir] = useState('asc')
  const [selected, setSelected] = useState(new Set())

  const sorted = useMemo(() => {
    return [...applications].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === 'dateApplied') {
        aVal = aVal || '0'
        bVal = bVal || '0'
      }
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = (bVal || '').toLowerCase()
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [applications, sortKey, sortDir])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
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
    if (selected.size === applications.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(applications.map(a => a.id)))
    }
  }

  const handleBulkDelete = () => {
    selected.forEach(id => onDelete(id))
    setSelected(new Set())
  }

  const SortIcon = ({ columnKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown size={13} className="text-slate-300 dark:text-slate-600" />
    return sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
      {selected.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium cursor-pointer">Delete all</button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.size === applications.length && applications.length > 0} onChange={toggleAll} className="rounded border-slate-300 dark:border-slate-600 cursor-pointer" />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon columnKey={col.key} />}
                  </div>
                </th>
              ))}
              <th className="w-20 px-3 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.map(app => {
              const domain = extractDomain(app.jobUrl)
              return (
                <tr
                  key={app.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${selected.has(app.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/20' : ''}`}
                  onClick={() => onSelect(app)}
                >
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} className="rounded border-slate-300 dark:border-slate-600 cursor-pointer" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo domain={domain} company={app.company} />
                      <span className="font-medium text-slate-900 dark:text-white">{app.company}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{app.role}</td>
                  <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{app.location || '-'}</td>
                  <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{app.salary || '-'}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${statusColors[app.status]}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                    {app.dateApplied ? getRelativeTime(app.dateApplied) : '-'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {app.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                      {app.tags.length > 2 && <span className="text-xs text-slate-400 dark:text-slate-500">+{app.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      {app.jobUrl && (
                        <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => onEdit(app)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => onDelete(app.id)} className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {applications.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">No applications found</div>
      )}
    </div>
  )
}