import { useState, useRef, useEffect, useLayoutEffect } from 'react'

export const EMAIL_TEMPLATES = [
  {
    id: 'followup',
    name: 'Follow-Up',
    description: 'Check in on a submitted application',
    getSubject: (role = 'Position', company = 'Company', myName = 'Applicant') =>
      `Application Follow-Up: ${role} - ${myName}`,
    getBody: (role = 'the role', company = 'your company', myName = 'Candidate', recruiter = 'Hiring Team') =>
      `Hi ${recruiter},\n\nI hope you're having a great week! I recently submitted my application for the ${role} position at ${company} and wanted to reiterate my strong interest in joining the team.\n\nWith my background and skill set, I believe I can make an immediate positive impact. Please let me know if there are any additional details or materials I can provide to support my application.\n\nThank you so much for your time and consideration!\n\nBest regards,\n${myName}`,
  },
  {
    id: 'thankyou',
    name: 'Thank You',
    description: 'Send within 24 hours of an interview',
    getSubject: (role = 'Position', company = 'Company', myName = 'Applicant') =>
      `Thank You - ${role} Interview - ${myName}`,
    getBody: (role = 'the position', company = 'your team', myName = 'Candidate', recruiter = 'Interviewer') =>
      `Hi ${recruiter},\n\nThank you so much for taking the time to speak with me today about the ${role} opportunity at ${company}. I really enjoyed our conversation and learning more about the team's upcoming goals and challenges.\n\nOur discussion further deepened my excitement about this role and how my experience aligns with your needs. Please feel free to reach out if you have any follow-up questions.\n\nLooking forward to staying in touch!\n\nWarm regards,\n${myName}`,
  },
  {
    id: 'status',
    name: 'Status Check',
    description: 'Polite inquiry about timeline or next steps',
    getSubject: (role = 'Position', company = 'Company', myName = 'Applicant') =>
      `Status Update Inquiry - ${role} - ${myName}`,
    getBody: (role = 'the role', company = 'your company', myName = 'Candidate', recruiter = 'Hiring Team') =>
      `Hi ${recruiter},\n\nI hope this email finds you well. I am checking in regarding the status of my application for the ${role} position at ${company}.\n\nI remain very excited about the possibility of joining your team and would love to know if there are any updates regarding the next steps in the hiring process.\n\nThank you again for your time and guidance.\n\nSincerely,\n${myName}`,
  },
  {
    id: 'offer',
    name: 'Offer Response',
    description: 'Discuss terms, start date, or compensation',
    getSubject: (role = 'Position', company = 'Company', myName = 'Applicant') =>
      `Regarding Offer for ${role} - ${myName}`,
    getBody: (role = 'the role', company = 'your company', myName = 'Candidate', recruiter = 'Hiring Team') =>
      `Hi ${recruiter},\n\nThank you so much for extending the offer for the ${role} position at ${company}! I am truly thrilled and appreciative of the opportunity to work together.\n\nI would love to arrange a brief call to discuss a few specific questions regarding the start date and benefits package before formalizing my acceptance.\n\nPlease let me know your availability for a quick 15-minute chat this week.\n\nBest regards,\n${myName}`,
  },
]

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function buildGmailUrl({ to, subject, body }) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body || '')}`
}

export function buildMailtoUrl({ to, subject, body }) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body || '')}`
}

export default function useComposeEmail({ data = {}, user, applications = [] }) {
  const myName = user?.user_metadata?.full_name || 'Job Seeker'
  const myEmail = user?.email || data?.from?.email || 'me@example.com'

  const [toEmail, setToEmail] = useState(data.to?.[0]?.email || '')
  const [subject, setSubject] = useState(data.subject || '')
  const [body, setBody] = useState(data.body || '')
  const [selectedAppId, setSelectedAppId] = useState('')
  const [validationError, setValidationError] = useState('')

  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 })
  const [activePopover, setActivePopover] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkInserted, setLinkInserted] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [fromOpen, setFromOpen] = useState(false)
  const [selectedFrom, setSelectedFrom] = useState({
    id: 'primary',
    name: myName,
    email: myEmail,
    avatar: data?.from?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(myName)}`,
  })
  const [safeX, setSafeX] = useState(0)

  const bodyRef = useRef(null)
  const toolbarRef = useRef(null)
  const popoverRef = useRef(null)
  const fromRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current && data.body && !bodyRef.current.innerText) {
      bodyRef.current.innerText = data.body
      setBody(data.body)
    }
  }, [data.body])

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
      if (
        fromRef.current &&
        !fromRef.current.contains(e.target)
      ) {
        setFromOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const syncBodyText = () => {
    if (bodyRef.current) {
      setBody(bodyRef.current.innerText || '')
    }
    if (validationError) {
      setValidationError('')
    }
  }

  const insertEmoji = (emoji) => {
    if (bodyRef.current) {
      bodyRef.current.focus()
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        if (bodyRef.current.contains(range.commonAncestorContainer)) {
          range.deleteContents()
          const textNode = document.createTextNode(emoji)
          range.insertNode(textNode)
          range.setStartAfter(textNode)
          range.setEndAfter(textNode)
          sel.removeAllRanges()
          sel.addRange(range)
          syncBodyText()
          setActivePopover(null)
          return
        }
      }
      bodyRef.current.innerText += emoji
      syncBodyText()
    }
    setActivePopover(null)
  }

  const insertLink = () => {
    if (!linkUrl) return
    const display = linkText || linkUrl
    if (bodyRef.current) {
      bodyRef.current.focus()
      const a = document.createElement('a')
      a.href = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
      a.textContent = display
      a.style.color = 'var(--brand)'
      a.style.textDecoration = 'underline'
      bodyRef.current.appendChild(document.createTextNode(' '))
      bodyRef.current.appendChild(a)
      bodyRef.current.appendChild(document.createTextNode(' '))
      syncBodyText()
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
      const current = (bodyRef.current.innerText || '').trimEnd()
      bodyRef.current.innerText = current ? `${current}\n\n${text}` : text
      syncBodyText()
    }
    setActivePopover(null)
  }

  const applyTemplate = (template) => {
    const selectedApp = applications.find(a => a.id === selectedAppId)
    const role = selectedApp?.role || 'Frontend Engineer'
    const company = selectedApp?.company || 'Company'
    const recruiter = selectedApp?.recruiter?.name || 'Hiring Manager'

    const newSubject = template.getSubject(role, company, myName)
    const newBody = template.getBody(role, company, myName, recruiter)

    setSubject(newSubject)
    setBody(newBody)
    if (bodyRef.current) {
      bodyRef.current.innerText = newBody
    }
    if (selectedApp?.recruiter?.email && !toEmail) {
      setToEmail(selectedApp.recruiter.email)
    }
    setValidationError('')
    setActivePopover(null)
  }

  const handleSelectApplication = (appId) => {
    setSelectedAppId(appId)
    const found = applications.find(a => a.id === appId)
    if (found?.recruiter?.email) {
      setToEmail(found.recruiter.email)
    }
    if (found && !subject) {
      setSubject(`Application Follow-up: ${found.role} at ${found.company} - ${myName}`)
    }
    setValidationError('')
  }

  const addFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return
    const newItems = Array.from(fileList).map(f => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: formatFileSize(f.size),
      rawSize: f.size,
      type: f.type || 'document',
      file: f,
    }))
    setAttachedFiles(prev => [...prev, ...newItems])
    setActivePopover(null)
  }

  const removeAttachment = (idOrName) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== idOrName && f.name !== idOrName))
  }

  const toggleFromOpen = () => setFromOpen((v) => !v)

  const selectFrom = (acc) => {
    setSelectedFrom(acc)
    setFromOpen(false)
  }

  const validate = () => {
    const trimmedTo = toEmail.trim()
    const trimmedSub = subject.trim()
    const trimmedBody = (bodyRef.current?.innerText || body).trim()

    if (!trimmedTo) {
      setValidationError('Please enter a recipient email address.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedTo)) {
      setValidationError('Please enter a valid email address (e.g. name@company.com).')
      return false
    }
    if (!trimmedSub) {
      setValidationError('Please enter an email subject line.')
      return false
    }
    if (!trimmedBody) {
      setValidationError('Please enter an email message.')
      return false
    }

    setValidationError('')
    return true
  }

  const getFullPayload = () => {
    const currentBody = bodyRef.current?.innerText || body
    return {
      from: selectedFrom,
      to: toEmail.trim(),
      subject: subject.trim(),
      body: currentBody.trim(),
      attachments: attachedFiles,
      applicationId: selectedAppId,
    }
  }

  return {
    myName,
    myEmail,
    toEmail,
    setToEmail,
    subject,
    setSubject,
    body,
    setBody,
    syncBodyText,
    selectedAppId,
    handleSelectApplication,
    validationError,
    setValidationError,
    validate,
    showToolbar,
    toolbarPos,
    safeX,
    activePopover,
    linkUrl,
    setLinkUrl,
    linkText,
    setLinkText,
    linkInserted,
    attachedFiles,
    fromOpen,
    selectedFrom,
    bodyRef,
    toolbarRef,
    popoverRef,
    fromRef,
    handleSelection,
    togglePopover,
    insertEmoji,
    insertLink,
    insertAISuggestion,
    applyTemplate,
    addFiles,
    removeAttachment,
    toggleFromOpen,
    selectFrom,
    getFullPayload,
  }
}
