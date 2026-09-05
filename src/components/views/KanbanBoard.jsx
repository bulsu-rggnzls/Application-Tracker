import { useState, useMemo, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Heading } from '../ui'
import JobCard from '../jobs/JobCard'
import BoardToolbar from './BoardToolbar'
import { getSalaryNumeric } from '../../utils/formatSalary'

const COLUMN_STYLES = {
  wishlist: { label: 'Wishlist', headerBg: 'bg-orange-500', border: 'border-orange-300 dark:border-orange-700', badge: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  applied: { label: 'Applied', headerBg: 'bg-blue-500', border: 'border-blue-300 dark:border-blue-700', badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  interviewing: { label: 'Interviewing', headerBg: 'bg-purple-600', border: 'border-purple-300 dark:border-purple-700', badge: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  offer: { label: 'Offer', headerBg: 'bg-emerald-500', border: 'border-emerald-300 dark:border-emerald-700', badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
  rejected: { label: 'Rejected', headerBg: 'bg-rose-500', border: 'border-rose-300 dark:border-rose-700', badge: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' },
}

const columns = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']

function compareItems(a, b, sort) {
  if (sort === 'salary') {
    return getSalaryNumeric(b.salary) - getSalaryNumeric(a.salary)
  }
  const da = a.dateApplied ? new Date(a.dateApplied).getTime() : 0
  const db = b.dateApplied ? new Date(b.dateApplied).getTime() : 0
  return db - da
}

export default function KanbanBoard({ applications, onDragEnd, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [compact, setCompact] = useState(() => localStorage.getItem('boardCompact') === 'true')

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BoardToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        compact={compact}
        onCompactChange={setCompact}
      />
        <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
        {columns.map((colId) => {
          const style = COLUMN_STYLES[colId]
          const items = visible
            .filter(a => a.status === colId)
            .sort((a, b) => compareItems(a, b, sort))
          return (
            <div key={colId} className="flex flex-col min-h-0 border-x border-slate-200/50 dark:border-slate-700/30 bg-white/40 dark:bg-slate-900/30 rounded-b-lg">
              <div className={`${style.headerBg} px-3 py-2 flex items-center gap-2 rounded-lg`}>
                <Heading size="xs" className="!text-white">{style.label}</Heading>
                <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200">{items.length}</span>
              </div>
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <div className="relative flex-1 min-h-0">
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`absolute inset-0 overflow-y-auto scrollbar-thin px-1.5 pt-2 pb-3 space-y-2 transition-colors duration-200 ${
                        compact ? 'space-y-1' : 'space-y-2.5'
                      } ${
                        snapshot.isDraggingOver ? 'bg-slate-100/70 dark:bg-slate-800/40' : ''
                      }`}
                    >
                      {items.map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            <JobCard
                              application={app}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onAcceptOffer={onAcceptOffer}
                              onRejectOffer={onRejectOffer}
                              onSelect={onSelect}
                              provided={provided}
                              snapshot={snapshot}
                              statusBorder={style.border}
                              compact={compact}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
              <div className={`h-0.5 ${style.headerBg} opacity-50 rounded-b-lg shrink-0`} />
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
