import { Search, Plus, Download, Upload, LayoutGrid, Table2 } from 'lucide-react'
import { Input, Button } from './ui'

export default function ControlsBar({ search, onSearchChange, onAdd, onExport, onImport, viewMode, onViewModeChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Input
          icon={<Search size={14} />}
          type="text"
          placeholder="Search company, role, or tag..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
          <button
            onClick={() => onViewModeChange('board')}
            className={`p-1.5 transition-colors cursor-pointer ${viewMode === 'board' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'text-slate-400 hover:text-slate-500'}`}
            title="Board view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'text-slate-400 hover:text-slate-500'}`}
            title="Table view"
          >
            <Table2 size={14} />
          </button>
        </div>
        <Button variant="primary" onClick={onAdd}><Plus size={14} /> Add</Button>
        <Button variant="secondary" onClick={onExport}><Download size={14} /> Export</Button>
        <label className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <Upload size={14} /> Import
          <input type="file" accept=".json" onChange={onImport} className="hidden" />
        </label>
      </div>
    </div>
  )
}
