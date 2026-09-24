import { useState } from 'react'

export default function useTagFilter(availableTags, selectedTags, onChange) {
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

  return { query, setQuery, filtered, toggleTag, hasSelection }
}
