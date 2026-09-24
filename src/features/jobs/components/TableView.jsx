import { Trash2, Edit3, ExternalLink, Briefcase } from 'lucide-react'
import { Table, Thead, Th, Tbody, Tr, Td, Badge, Button, IconButton, Text } from '@/components/ui'
import WelcomeEmpty from '@/components/ui/WelcomeEmpty'
import CompanyLogo from './CompanyLogo'
import extractDomain from '@/utils/extractDomain'
import getRelativeTime from '@/utils/getRelativeTime'
import formatSalary from '@/utils/formatSalary'
import SortOrderToggle from './SortOrderToggle'
import MultiSelectFilter from './MultiSelectFilter'
import TagFilter from './TagFilter'
import DateRangeFilter from './DateRangeFilter'
import SalaryRangeFilter from './SalaryRangeFilter'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination'
import useTableView from '../hooks/useTableView'
import { statusAccent, statusChip } from '@/lib/status'

export default function TableView({ applications, onEdit, onDelete, onSelect, onAdd }) {
  const {
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
  } = useTableView(applications, onDelete)

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table className="!border-0 !shadow-none !bg-transparent" fill={pageItems.length >= pageSize}>
      {selected.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/70 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/40">
          <Text variant="body" className="!text-indigo-700 dark:!text-indigo-300 !font-medium">{selected.size} selected</Text>
          <Button variant="ghost" onClick={handleBulkDelete} className="!text-sm !text-rose-600 dark:!text-rose-400 hover:!text-rose-700 dark:hover:!text-rose-300 !font-medium !p-0 !h-auto">Delete all</Button>
        </div>
      )}
      <Thead>
        <Th className="w-10 !px-4">
          <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-brand-ring cursor-pointer" />
        </Th>
        <Th className="w-auto">
          <SortOrderToggle label="Company" currentSort={sort} onSortChange={handleSort} color="indigo" />
        </Th>
        <Th className="w-auto min-w-[140px]">
          <SortOrderToggle label="Role" currentSort={sort} onSortChange={handleSort} color="sky" />
        </Th>
        <Th className="w-auto min-w-[90px]">
          <MultiSelectFilter title="Location" options={locationOptions} selectedValues={locationFilter} onChange={setLocationFilter} color="teal" />
        </Th>
        <Th className="w-auto min-w-[90px]">
          <SalaryRangeFilter
            minSalary={salaryRange.min}
            maxSalary={salaryRange.max}
            sortHigh={salaryRange.sortHigh}
            onChange={setSalaryRange}
          />
        </Th>
        <Th className="w-auto min-w-[90px]">
          <MultiSelectFilter title="Status" options={statusOptions} selectedValues={statusFilter} onChange={setStatusFilter} color="purple" />
        </Th>
        <Th className="w-auto min-w-[80px]">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </Th>
        <Th className="w-auto min-w-[120px]">
          <TagFilter availableTags={allTags} selectedTags={tagFilter} onChange={setTagFilter} />
        </Th>
        <Th className="w-28 !px-4 !text-right">Actions</Th>
      </Thead>
      <Tbody>
        {pageItems.map((app, index) => {
          const domain = extractDomain(app.jobUrl)
          const isEven = index % 2 === 0
          return (
            <Tr
              key={app.id}
              onClick={() => onSelect(app)}
              className={`group ${isEven ? 'bg-slate-50/40 dark:bg-slate-800/20' : ''} ${
                selected.has(app.id) ? '!bg-indigo-50/60 dark:!bg-indigo-900/30' : ''
                } border-l-2 ${statusAccent(app.status)} hover:!bg-indigo-50/40 dark:hover:!bg-indigo-900/20 transition-ui`}
            >
              <Td onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-brand-ring cursor-pointer" />
              </Td>
              <Td>
                <div className="flex items-center gap-2 min-w-0">
                  <CompanyLogo domain={domain} company={app.company} size="sm" />
                  <div className="min-w-0 leading-tight">
                    <div className="flex items-center gap-1.5">
                      <Text variant="body" className="!text-[13px] !font-semibold !text-slate-900 dark:!text-white truncate">{app.company}</Text>
                      {app.starred && <span className="text-amber-400 text-[10px]">★</span>}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">{app.employmentType || ''}</span>
                  </div>
                </div>
              </Td>
              <Td>
                <Text variant="body" className="!text-[13px] !text-slate-700 dark:!text-slate-200 truncate max-w-[220px]">{app.role}</Text>
              </Td>
              <Td className="text-[13px] text-slate-500 dark:text-slate-400">{app.location || '-'}</Td>
              <Td className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{formatSalary(app.salary) || '-'}</Td>
              <Td>
                <Badge variant="status" className={`text-[11px] px-1.5 py-0 ${statusChip(app.status)}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
              </Td>
              <Td className="text-[13px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {app.dateApplied ? getRelativeTime(app.dateApplied) : '-'}
              </Td>
              <Td>
                <div className="flex gap-1 flex-wrap">
                  {app.tags.slice(0, 2).map(t => (
                    <Badge key={t} variant="table" className="max-w-[110px] truncate">{t}</Badge>
                  ))}
                  {app.tags.length > 2 && <Text variant="muted-sm">+{app.tags.length - 2}</Text>}
                </div>
              </Td>
              <Td className="text-right" onClick={e => e.stopPropagation()}>
                <div className="flex gap-0.5 justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                  {app.jobUrl && (
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
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
      {filtered.length === 0 && (
        <tbody>
          <tr>
            <td colSpan={9} className="py-10">
              {applications.length === 0 ? (
                <WelcomeEmpty
                  icon={Briefcase}
                  title="No applications yet"
                  description="Add your first one and it will show up here as a sortable, filterable table."
                  actionLabel="+ Add your first application"
                  onAction={onAdd}
                />
              ) : (
                <WelcomeEmpty
                  icon={Briefcase}
                  title="No applications match your filters"
                  description="Try clearing a filter or changing the search."
                  compact
                />
              )}
            </td>
          </tr>
        </tbody>
      )}
      </Table>
      {filtered.length > 0 && (
        <div className="shrink-0 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border-t border-slate-200/70 dark:border-slate-700/60 px-4 py-2">
          <Pagination>
                <PaginationContent className="w-full justify-between flex-wrap gap-y-2">
                  <PaginationItem>
                    <Text variant="body" className="!text-slate-500 dark:!text-slate-400">
                      Showing{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {(currentPage - 1) * pageSize + 1}
                      </span>
                      {'-'}
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {Math.min(currentPage * pageSize, filtered.length)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-200">{filtered.length}</span>{' '}
                      applications
                    </Text>
                  </PaginationItem>
                  <PaginationItem className="flex items-center gap-1">
                    <PaginationPrevious
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}
                    />
                    {(() => {
                      const pages = []
                      const start = Math.max(1, currentPage - 2)
                      const end = Math.min(totalPages, currentPage + 2)
                      if (start > 1) {
                        pages.push(1)
                        if (start > 2) pages.push('ellipsis-start')
                      }
                      for (let i = start; i <= end; i++) pages.push(i)
                      if (end < totalPages) {
                        if (end < totalPages - 1) pages.push('ellipsis-end')
                        pages.push(totalPages)
                      }
                      return pages.map((p, i) =>
                        p === 'ellipsis-start' || p === 'ellipsis-end' ? (
                          <PaginationItem key={`${p}-${i}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={p}>
                            <PaginationLink isActive={p === currentPage} onClick={() => setPage(p)}>
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )
                    })()}
                    <PaginationNext
                      disabled={currentPage === totalPages}
                      onClick={() => setPage(currentPage + 1)}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <select
                      value={pageSize}
                      onChange={e => handlePageSizeChange(e.target.value)}
                      className="px-2 py-1.5 text-sm text-text-secondary border border-border rounded-md bg-surface focus-ring cursor-pointer transition-ui"
                    >
                      {[10, 25, 50, 100].map(size => (
                        <option key={size} value={size}>
                          {size} / page
                        </option>
                      ))}
                    </select>
                  </PaginationItem>
                </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
