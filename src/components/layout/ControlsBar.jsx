import { useRef } from 'react'
import { Plus, LayoutGrid, Table2, Download, Upload, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export default function ControlsBar({ onAdd, onComposeEmail, viewMode, onViewModeChange, onExport, onImport }) {
  const fileRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => onViewModeChange('board')}
            title="Board view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
              viewMode === 'board'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid size={13} />
            Board
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="Table view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Table2 size={13} />
            Table
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        <button
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
          title="More actions"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
        >
          <MoreHorizontal size={17} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 z-40 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 animate-fade-in">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onExport() }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <Download size={13} /> Export JSON
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); fileRef.current?.click() }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <Upload size={13} /> Import JSON
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onComposeEmail() }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <MoreHorizontal size={13} /> Compose email
              </button>
            </div>
          </>
        )}
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
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-3.5 py-2 shadow-sm transition-all duration-150 hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-px cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus size={14} strokeWidth={2.5} />
          New application
        </button>
      </div>
    </div>
  )
}
