import { useState, useMemo, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Heading } from '../ui'
import MobileSheet from '../ui/MobileSheet'
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

export default function KanbanBoard({ applications, onDragEnd, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect, onStatusChange }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [compact, setCompact] = useState(() => localStorage.getItem('boardCompact') === 'true')
  const [activeCol, setActiveCol] = useState(columns[0])
  const [moveTarget, setMoveTarget] = useState(null)

  useEffect(() => {
    localStorage.setItem('boardCompact', compact)
  }, [compact])

  const handleMobileMove = (newStatus) => {
    if (!moveTarget) return
    if (newStatus !== moveTarget.status) {
      onStatusChange?.(moveTarget.id, newStatus, moveTarget.status)
    }
    setMoveTarget(null)
  }

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

      {/* Mobile: status tabs + single active column, tap-to-move instead of drag */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin shrink-0 pb-2 pr-8 snap-x w-full">
          {columns.map(colId => {
            const style = COLUMN_STYLES[colId]
            const count = visible.filter(a => a.status === colId).length
            const active = activeCol === colId
            return (
              <button
                key={colId}
                type="button"
                onClick={() => setActiveCol(colId)}
                className={`shrink-0 snap-start whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 cursor-pointer ${
                  active
                    ? `${style.headerBg} !text-white !border-transparent shadow-sm`
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {style.label}
                <span className={`text-[10px] tabular-nums ${active ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pt-1 pb-4 space-y-2">
          {activeItems.map(app => (
            <JobCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
              onAcceptOffer={onAcceptOffer}
              onRejectOffer={onRejectOffer}
              onSelect={onSelect}
              onStatusChange={onStatusChange}
              onMoveTap={setMoveTarget}
              mobile
            />
          ))}
          {activeItems.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
              No applications in {COLUMN_STYLES[activeCol].label}
            </div>
          )}
        </div>

        {/* Move-to bottom sheet */}
        <MobileSheet
          open={!!moveTarget}
          onClose={() => setMoveTarget(null)}
          title={moveTarget ? `Move ${moveTarget.company}` : ''}
        >
          <div className="py-2 space-y-1">
            {columns.map(colId => {
              const style = COLUMN_STYLES[colId]
              const isCurrent = moveTarget?.status === colId
              return (
                <button
                  key={colId}
                  type="button"
                  disabled={isCurrent}
                  onClick={() => handleMobileMove(colId)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer border ${
                    isCurrent
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-default'
                      : 'bg-white dark:bg-[#090D16] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.99]'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.headerBg}`} />
                  {style.label}
                  {isCurrent && <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider">Current</span>}
                </button>
              )
            })}
          </div>
        </MobileSheet>
      </div>

      {/* Desktop: full kanban with drag & drop */}
      <div className="hidden md:grid md:grid-cols-5 gap-3 flex-1 min-h-0">
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
                              onStatusChange={onStatusChange}
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
