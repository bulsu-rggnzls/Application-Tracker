import { useState, useRef } from 'react'

export default function usePillInput({ tags, onAdd, onRemove }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  function commit(raw) {
    const trimmed = raw.replace(/,/g, '').trim()
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed)
    }
    setValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit(value)
    }
    if (e.key === 'Backspace' && !value && tags.length > 0) {
      onRemove(tags[tags.length - 1])
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text')
    if (text.includes(',') || text.includes('\n')) {
      e.preventDefault()
      text.split(/[,\n]+/).forEach(part => commit(part))
    }
  }

  function handleBlur() {
    if (value) commit(value)
  }

  return { value, setValue, inputRef, commit, handleKeyDown, handlePaste, handleBlur }
}
