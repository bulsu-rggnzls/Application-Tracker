import { Search, Plus, Download, Upload, LayoutGrid, Table2 } from 'lucide-react'

export default function ControlsBar({ search, onSearchChange, onAdd, onExport, onImport, viewMode, onViewModeChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, role, or tag..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
          />
        </div>
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
        <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer">
          <Plus size={14} /> Add
        </button>
        <button onClick={onExport} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <Download size={14} /> Export
        </button>
        <label className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <Upload size={14} /> Import
          <input type="file" accept=".json" onChange={onImport} className="hidden" />
        </label>
      </div>
    </div>
  )
}