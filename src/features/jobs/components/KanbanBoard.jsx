import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Heading } from '@/components/ui'
import MobileSheet from '@/components/ui/MobileSheet'
import JobCard from './JobCard'
import BoardToolbar from './BoardToolbar'
import useBoardFilters from '../hooks/useBoardFilters'
import { STATUS_LABELS, statusSolid, statusSoftBg } from '@/lib/status'

const COLUMN_STYLES = {
  wishlist: { label: STATUS_LABELS.wishlist, headerBg: statusSolid('wishlist'), border: 'border-status-wishlist/40', badge: statusSoftBg('wishlist') },
  applied: { label: STATUS_LABELS.applied, headerBg: statusSolid('applied'), border: 'border-status-applied/40', badge: statusSoftBg('applied') },
  interviewing: { label: STATUS_LABELS.interviewing, headerBg: statusSolid('interviewing'), border: 'border-status-interviewing/40', badge: statusSoftBg('interviewing') },
  offer: { label: STATUS_LABELS.offer, headerBg: statusSolid('offer'), border: 'border-status-offer/40', badge: statusSoftBg('offer') },
  rejected: { label: STATUS_LABELS.rejected, headerBg: statusSolid('rejected'), border: 'border-status-rejected/40', badge: statusSoftBg('rejected') },
}

const columns = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']

export default function KanbanBoard({ applications, onDragEnd, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect, onStatusChange }) {
  const {
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
    visible,
    activeItems,
    handleMobileMove,
    compareItems,
  } = useBoardFilters(applications, onStatusChange)

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
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-secondary'
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
                      : 'bg-white dark:bg-surface border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.99]'
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
