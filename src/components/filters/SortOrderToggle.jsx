import { ArrowUpAZ, ArrowDownZA } from 'lucide-react'
import { Button, Heading } from '../ui'
import Popover from './Popover'

const COLOR_MAP = {
  indigo: { active: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800', hover: 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10', icon: 'text-indigo-400' },
  sky:    { active: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800', hover: 'hover:bg-sky-50/50 dark:hover:bg-sky-900/10', icon: 'text-sky-400' },
}

export default function SortOrderToggle({ label, currentSort, onSortChange, color = 'indigo' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.indigo
  const key = label.toLowerCase()
  const isActive = currentSort?.key === key

  const handleToggle = () => {
    if (isActive) {
      onSortChange(key, currentSort.dir === 'asc' ? 'desc' : 'asc')
    } else {
      onSortChange(key, 'asc')
    }
  }

  if (isActive) {
    return (
      <Button
        variant="secondary"
        onClick={handleToggle}
        title={`Toggle sort order (currently ${currentSort.dir === 'asc' ? 'ascending' : 'descending'})`}
        className={`!px-2 !py-1 !rounded-md ${c.active} !border`}
      >
        {label}
        {currentSort.dir === 'asc' ? <ArrowUpAZ size={13} /> : <ArrowDownZA size={13} />}
      </Button>
    )
  }

  return (
    <Popover
      trigger={
        <Button
          variant="secondary"
          onClick={handleToggle}
          className="!px-2 !py-1 !rounded-md !border-0 text-slate-400 dark:text-slate-500 hover:!text-slate-600 dark:hover:!text-slate-300"
        >
          {label}
          <ArrowUpAZ size={13} className="opacity-40" />
        </Button>
      }
    >
      <div className="space-y-1">
        <Heading size="xs" className="mb-2">Sort by {label}</Heading>
        <Button
          variant="secondary"
          onClick={() => onSortChange(label.toLowerCase(), 'asc')}
          className={`!w-full !justify-start !px-2 !py-1.5 !rounded-md !text-left ${
            isActive && currentSort.dir === 'asc'
              ? `${c.active} !font-medium`
              : `!text-slate-600 dark:!text-slate-300 ${c.hover}`
          }`}
        >
          <ArrowUpAZ size={14} className={c.icon} /> A → Z
        </Button>
        <Button
          variant="secondary"
          onClick={() => onSortChange(label.toLowerCase(), 'desc')}
          className={`!w-full !justify-start !px-2 !py-1.5 !rounded-md !text-left ${
            isActive && currentSort.dir === 'desc'
              ? `${c.active} !font-medium`
              : `!text-slate-600 dark:!text-slate-300 ${c.hover}`
          }`}
        >
          <ArrowDownZA size={14} className={c.icon} /> Z → A
        </Button>
      </div>
    </Popover>
  )
}