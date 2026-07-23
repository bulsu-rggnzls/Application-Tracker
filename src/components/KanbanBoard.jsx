import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import JobCard from './JobCard'

const columns = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'applied', label: 'Applied' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
]

export default function KanbanBoard({ applications, onDragEnd, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-5 gap-3 min-h-[500px]">
        {columns.map((col) => {
          const items = applications.filter(a => a.status === col.id)
          return (
            <div key={col.id} className="bg-slate-50 dark:bg-slate-900/40 rounded-lg flex flex-col">
              <div className="px-3 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                  {col.label}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tabular-nums">
                  {items.length}
                </span>
              </div>
              <Droppable droppableId={col.id}>
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