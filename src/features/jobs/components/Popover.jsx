import usePopover from '../hooks/usePopover'

export default function Popover({ trigger, children, align = 'left' }) {
  const { open, toggle, ref } = usePopover()

  return (
    <div className="relative inline-flex" ref={ref}>
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={`absolute top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 text-xs min-w-[200px] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  )
}
