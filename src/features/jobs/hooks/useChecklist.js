import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function useChecklist(items = [], onChange) {
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

  const doneCount = items.filter(i => i.done).length

  return { draft, setDraft, add, toggle, remove, doneCount }
}
