import { useRef, useState } from 'react'
import { Plus, LayoutGrid, Table2, Download, Upload, MoreHorizontal } from 'lucide-react'
import { Button, IconButton } from '@/components/ui'
import { transitionUI } from '@/lib/layout'

const viewBtnCls = `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${transitionUI} cursor-pointer`
const viewActive = 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
const viewIdle = 'text-text-muted hover:text-brand dark:hover:text-indigo-200'

export default function ControlsBar({ onAdd, onComposeEmail, viewMode, onViewModeChange, onExport, onImport }) {
  const fileRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between w-full gap-2 mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex p-0.5 bg-surface-muted rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('board')}
            title="Board view"
            className={`${viewBtnCls} ${viewMode === 'board' ? viewActive : viewIdle}`}
          >
            <LayoutGrid size={13} />
            Board
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="Table view"
            className={`${viewBtnCls} ${viewMode === 'table' ? viewActive : viewIdle}`}
          >
            <Table2 size={13} />
            Table
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 relative shrink-0">
        <IconButton
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
          title="More actions"
          className="flex items-center justify-center w-9 h-9 !rounded-lg border border-transparent hover:border-border"
        >
          <MoreHorizontal size={17} />
        </IconButton>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 z-40 w-44 bg-surface border border-border rounded-xl shadow-lg py-1 animate-fade-in">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onExport() }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-muted ${transitionUI} cursor-pointer`}
              >
                <Download size={13} /> Export JSON
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); fileRef.current?.click() }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-muted ${transitionUI} cursor-pointer`}
              >
                <Upload size={13} /> Import JSON
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onComposeEmail() }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-muted ${transitionUI} cursor-pointer`}
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
        <Button
          type="button"
          variant="gradient"
          onClick={onAdd}
          title="New application"
          className="!rounded-lg !text-xs !font-semibold w-9 h-9 sm:w-auto !px-0 sm:!px-3.5 active:scale-95 sm:hover:-translate-y-px"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">New application</span>
        </Button>
      </div>
    </div>
  )
}
