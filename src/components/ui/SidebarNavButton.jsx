export default function SidebarNavButton({ active, icon: Icon, label, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
        active
          ? 'text-slate-900 dark:text-white'
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
      }`}
      title={label}
    >
      <Icon size={18} />
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[8px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  )
}
