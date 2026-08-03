import { Plus, LayoutGrid, Table2, Mail } from 'lucide-react'
import { Button, IconButton } from '../ui'

export default function ControlsBar({ onAdd, onComposeEmail, viewMode, onViewModeChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
          <IconButton
            onClick={() => onViewModeChange('board')}
            className={`!rounded-none ${viewMode === 'board' ? '!bg-slate-100 dark:!bg-slate-700 !text-slate-600 dark:!text-slate-300' : '!text-slate-400 hover:!text-slate-500'}`}
            title="Board view"
          >
            <LayoutGrid size={16} />
          </IconButton>
          <IconButton
            onClick={() => onViewModeChange('table')}
            className={`!rounded-none ${viewMode === 'table' ? '!bg-slate-100 dark:!bg-slate-700 !text-slate-600 dark:!text-slate-300' : '!text-slate-400 hover:!text-slate-500'}`}
            title="Table view"
          >
            <Table2 size={16} />
          </IconButton>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={onAdd}><Plus size={16} /> Add</Button>
        <Button variant="secondary" onClick={onComposeEmail}><Mail size={16} /> Compose</Button>
      </div>
    </div>
  )
}
