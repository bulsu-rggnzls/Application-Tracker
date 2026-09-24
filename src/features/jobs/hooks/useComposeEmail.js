import { useState, useRef, useEffect, useLayoutEffect } from 'react'

export default function useComposeEmail(data) {
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 })
  const [activePopover, setActivePopover] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkInserted, setLinkInserted] = useState(false)
  const [scheduledTime, setScheduledTime] = useState(null)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [fromOpen, setFromOpen] = useState(false)
  const [selectedFrom, setSelectedFrom] = useState(data.from)
  const [safeX, setSafeX] = useState(0)

  const bodyRef = useRef(null)
  const toolbarRef = useRef(null)
  const popoverRef = useRef(null)
  const fromRef = useRef(null)

  const handleSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0 && bodyRef.current) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const parentRect = bodyRef.current.getBoundingClientRect()
      setToolbarPos({
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top - parentRect.top - 60,
      })
      setShowToolbar(true)
    } else {
      setShowToolbar(false)
    }
  }

  const getSafeToolbarX = (rawX) => {
    if (!toolbarRef.current || !bodyRef.current) return rawX
    const toolbarWidth = toolbarRef.current.offsetWidth
    const containerWidth = bodyRef.current.offsetWidth
    const padding = 12
    const minX = padding
    const maxX = containerWidth - toolbarWidth - padding
    return Math.min(Math.max(rawX - toolbarWidth / 2, minX), maxX)
  }

  useLayoutEffect(() => {
    if (showToolbar) {
      setSafeX(getSafeToolbarX(toolbarPos.x))
    }
  }, [toolbarPos, showToolbar])

  const togglePopover = (name) => {
    setActivePopover((prev) => (prev === name ? null : name))
  }

  useEffect(() => {
    const handler = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        setActivePopover(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const insertEmoji = (emoji) => {
    if (bodyRef.current) {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        if (bodyRef.current.contains(range.commonAncestorContainer)) {
          range.deleteContents()
          range.insertNode(document.createTextNode(emoji))
          range.collapse(false)
          sel.removeAllRanges()
          sel.addRange(range)
          return
        }
      }
      bodyRef.current.innerText += emoji
    }
    setActivePopover(null)
  }

  const insertLink = () => {
    if (!linkUrl) return
    const display = linkText || linkUrl
    if (bodyRef.current) {
      const a = document.createElement('a')
      a.href = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
      a.textContent = display
      a.style.color = 'var(--brand)'
      a.style.textDecoration = 'underline'
      bodyRef.current.appendChild(document.createTextNode(' '))
      bodyRef.current.appendChild(a)
      bodyRef.current.appendChild(document.createTextNode(' '))
    }
    setLinkInserted(true)
    setTimeout(() => {
      setLinkInserted(false)
      setLinkUrl('')
      setLinkText('')
      setActivePopover(null)
    }, 1000)
  }

  const insertAISuggestion = (text) => {
    if (bodyRef.current) {
      bodyRef.current.innerText =
        (bodyRef.current.innerText || '').trimEnd() + '\n\n' + text
    }
    setActivePopover(null)
  }

  const handleSchedule = (label) => {
    setScheduledTime(label)
    setActivePopover(null)
  }

  const handleFakeAttach = () => {
    const names = [
      'proposal.pdf',
      'design-v2.png',
      'notes.docx',
      'report.xlsx',
    ]
    const random = names[Math.floor(Math.random() * names.length)]
    if (!attachedFiles.includes(random))
      setAttachedFiles((p) => [...p, random])
    setActivePopover(null)
  }

  const removeAttachment = (fname) =>
    setAttachedFiles((p) => p.filter((f) => f !== fname))

  const toggleFromOpen = () => setFromOpen((v) => !v)

  const selectFrom = (acc) => {
    setSelectedFrom(acc)
    setFromOpen(false)
  }

  useEffect(() => {
    const handler = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target))
        setFromOpen(false)
      if (popoverRef.current && !popoverRef.current.contains(e.target))
        setActivePopover(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return {
    showToolbar,
    toolbarPos,
    safeX,
    activePopover,
    linkUrl,
    setLinkUrl,
    linkText,
    setLinkText,
    linkInserted,
    scheduledTime,
    attachedFiles,
    isDraggingOver,
    setIsDraggingOver,
    fromOpen,
    selectedFrom,
    bodyRef,
    toolbarRef,
    popoverRef,
    fromRef,
    handleSelection,
    togglePopover,
    setActivePopover,
    insertEmoji,
    insertLink,
    insertAISuggestion,
    handleSchedule,
    handleFakeAttach,
    removeAttachment,
    toggleFromOpen,
    selectFrom,
  }
}
