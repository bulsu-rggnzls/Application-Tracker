import { useState } from 'react'
import { Check, Plus, Trash2, ClipboardList } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Input, Text } from '../ui'

function ChecklistItem({ item, onToggle, onRemove }) {
  return (
    <div className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors ${
      item.done
        ? 'bg-emerald-50/60 dark:bg-emerald-900/15 border-emerald-200/60 dark:border-emerald-800/50'
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
    }`}>
      <button
        type="button"
        onClick={onToggle}
        aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
          item.done
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:border-emerald-400'
        }`}
      >
        {item.done && <Check size={12} strokeWidth={3} />}
      </button>
      <span className={`flex-1 text-sm transition-colors ${
        item.done ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'
      }`}>
        {item.text}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove item"
        className="text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default function InterviewChecklist({ items = [], onChange }) {
  const [draft, setDraft] = useState('')

  const add = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    onChange([...items, { id: uuidv4(), text: trimmed, done: false }])
    setDraft('')
  }

  const toggle = (id) => {
    onChange(items.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }

  const remove = (id) => {
    onChange(items.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-center py-10 px-4">
          <ClipboardList size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <Text variant="body">No checklist items yet</Text>
          <Text variant="muted-sm" className="mt-0.5">Add steps to prep for the interview</Text>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={() => toggle(item.id)}
              onRemove={() => remove(item.id)}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          containerClassName="relative flex-1"
          type="text"
          placeholder="Add a checklist item..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(draft) } }}
        />
        <Button variant="secondary" onClick={() => add(draft)} disabled={!draft.trim()} className="!px-3">
          <Plus size={14} /> Add
        </Button>
      </div>

      {items.length > 0 && (
        <Text variant="muted-sm">
          {items.filter(i => i.done).length} of {items.length} complete
        </Text>
      )}
    </div>
  )
}
