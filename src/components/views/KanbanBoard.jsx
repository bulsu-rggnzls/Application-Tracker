import { useState, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Badge, Card, Heading } from '../ui'
import JobCard from '../jobs/JobCard'
import BoardToolbar from './BoardToolbar'
import { getSalaryNumeric } from '../../utils/formatSalary'

const COLUMN_STYLES = {
  wishlist: { label: 'Wishlist', headerBg: 'bg-orange-500', shadow: 'shadow-orange-500/20', border: 'border-orange-300' },
  applied: { label: 'Applied', headerBg: 'bg-blue-500', shadow: 'shadow-blue-500/20', border: 'border-blue-300' },
  interviewing: { label: 'Interviewing', headerBg: 'bg-purple-600', shadow: 'shadow-purple-500/20', border: 'border-purple-300' },
  offer: { label: 'Offer', headerBg: 'bg-emerald-500', shadow: 'shadow-emerald-500/20', border: 'border-emerald-300' },
  rejected: { label: 'Rejected', headerBg: 'bg-rose-500', shadow: 'shadow-rose-500/20', border: 'border-rose-300' },
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
      />
      <div className="grid grid-cols-5 gap-3 min-h-[500px]">
        {columns.map((colId) => {
          const style = COLUMN_STYLES[colId]
          const items = visible
            .filter(a => a.status === colId)
            .sort((a, b) => compareItems(a, b, sort))
          return (
            <Card key={colId} className="!bg-slate-50 dark:!bg-slate-900/40 !rounded-lg flex flex-col overflow-hidden !shadow-none !border !border-slate-200/50 dark:!border-slate-700/40">
              <div className={`${style.headerBg} px-3 py-3 flex items-center justify-between shadow-lg ${style.shadow}`}>
                <Heading size="xs" className="!text-white">{style.label}</Heading>
                <Badge variant="count">{items.length}</Badge>
              </div>
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 space-y-2.5 transition-all duration-200 ${
                      snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-800/40 ring-1 ring-inset ring-indigo-400/20' : ''
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
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          )
        })}
      </div>
    </DragDropContext>
  )
}
