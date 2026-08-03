import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Button, Heading, Input, Text } from '../ui'
import Popover from './Popover'

export default function TagFilter({ availableTags, selectedTags, onChange }) {
  const [query, setQuery] = useState('')
  const hasSelection = selectedTags.length > 0
  const filtered = query
    ? availableTags.filter(t => t.toLowerCase().includes(query.toLowerCase()))
    : availableTags

  function toggleTag(tag) {
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <Popover
      align="left"
      trigger={
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
          hasSelection
            ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}>
          <span className="relative">
            Tags
            {hasSelection && <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-pink-500" />}
          </span>
          <ChevronDown size={12} />
        </div>
      }
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Heading size="xs">Tags</Heading>
          {hasSelection && (
            <Button variant="ghost" onClick={() => onChange([])} className="!p-0 !h-auto !text-[11px] !font-medium !text-pink-600 dark:!text-pink-400 hover:!underline">
              Clear
            </Button>
          )}
        </div>
        <Input
          containerClassName="relative w-full"
          icon={<Search size={12} />}
          type="text"
          placeholder="Search tags..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
          {filtered.length === 0 && (
            <Text variant="muted-sm" className="py-1">No tags match</Text>
          )}
          {filtered.map(tag => {
            const active = selectedTags.includes(tag)
            return (
              <Button
                key={tag}
                variant="secondary"
                onClick={() => toggleTag(tag)}
                className={`!text-xs !px-2 !py-1 !rounded-md !font-medium ${
                  active
                    ? '!bg-pink-100 dark:!bg-pink-900/40 !text-pink-700 dark:!text-pink-300 !border-pink-200 dark:!border-pink-700'
                    : 'hover:!border-pink-200 dark:hover:!border-pink-700'
                }`}
              >
                {tag}
              </Button>
            )
          })}
        </div>
      </div>
    </Popover>
  )
}