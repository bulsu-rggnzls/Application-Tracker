import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import JobCard from './JobCard'

const COLUMN_STYLES = {
  wishlist: { label: 'Wishlist', headerBg: 'bg-orange-500', shadow: 'shadow-orange-500/20', border: 'border-orange-300' },
  applied: { label: 'Applied', headerBg: 'bg-blue-500', shadow: 'shadow-blue-500/20', border: 'border-blue-300' },
  interviewing: { label: 'Interviewing', headerBg: 'bg-purple-600', shadow: 'shadow-purple-500/20', border: 'border-purple-300' },
  offer: { label: 'Offer', headerBg: 'bg-emerald-500', shadow: 'shadow-emerald-500/20', border: 'border-emerald-300' },
  rejected: { label: 'Rejected', headerBg: 'bg-rose-500', shadow: 'shadow-rose-500/20', border: 'border-rose-300' },
}

const columns = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']

export default function KanbanBoard({ applications, onDragEnd, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-5 gap-3 min-h-[500px]">
        {columns.map((colId) => {
          const style = COLUMN_STYLES[colId]
          const items = applications.filter(a => a.status === colId)
          return (
            <div key={colId} className="bg-slate-50 dark:bg-slate-900/40 rounded-lg flex flex-col overflow-hidden">
              <div className={`${style.headerBg} px-3 py-2.5 flex items-center justify-between shadow-lg ${style.shadow}`}>
                <span className="text-xs font-bold tracking-wider text-white uppercase">
                  {style.label}
                </span>
                <span className="text-xs text-white/80 font-bold tabular-nums bg-white/20 rounded-full px-1.5 py-0.5 leading-tight">
                  {items.length}
                </span>
              </div>
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 space-y-2 transition-all duration-200 ${
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
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
