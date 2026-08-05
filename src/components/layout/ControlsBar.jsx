import { useRef } from 'react'
import { Plus, LayoutGrid, Table2, Mail, Download, Upload } from 'lucide-react'
import { Button, IconButton } from '../ui'

export default function ControlsBar({ onAdd, onComposeEmail, viewMode, onViewModeChange, onExport, onImport }) {
  const fileRef = useRef(null)

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
        <Button variant="secondary" onClick={onExport} title="Export all applications as JSON"><Download size={16} /> Export</Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()} title="Import applications from JSON"><Upload size={16} /> Import</Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            onImport(e.target.files?.[0])
            e.target.value = ''
          }}
        />
        <Button variant="primary" onClick={onAdd}><Plus size={16} /> Add</Button>
        <Button variant="secondary" onClick={onComposeEmail}><Mail size={16} /> Compose</Button>
      </div>
    </div>
  )
}
