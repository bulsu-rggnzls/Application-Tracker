import { useState, useEffect, useRef, useMemo } from 'react'
import extractDomain from '@/utils/extractDomain'
import formatSalary from '@/utils/formatSalary'

const STAGES = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'applied', label: 'Applied' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'offer', label: 'Offer' },
]

function initForm(job) {
  const salary = job.salary && typeof job.salary === 'object' ? job.salary : {}
  return {
    company: job.company || '',
    role: job.role || '',
    location: job.location || '',
    salary: {
      min: salary.min ? String(Number(salary.min) / 1000) : '',
      max: salary.max ? String(Number(salary.max) / 1000) : '',
      currency: salary.currency || 'USD',
      period: salary.period || 'yearly',
    },
    starred: !!job.starred,
    notes: job.notes || '',
    checklist: job.checklist || [],
  }
}

function salaryFromForm(s) {
  if (!s.min && !s.max) return ''
  return {
    min: s.min ? Number(s.min) * 1000 : '',
    max: s.max ? Number(s.max) * 1000 : '',
    currency: s.currency,
    period: s.period,
  }
}

export default function useJobDetailForm({ job, isOpen, onStatusChange, onUpdate }) {
  const [tab, setTab] = useState('overview')
  const [notesMode, setNotesMode] = useState('edit')
  const [form, setForm] = useState(() => initForm(job || {}))
  const openIdRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      openIdRef.current = null
      return
    }
    if (!job || openIdRef.current === job.id) return
    openIdRef.current = job.id
    setForm(initForm(job))
    setTab('overview')
    setNotesMode('edit')
  }, [job, isOpen])

  const domain = job ? extractDomain(job.jobUrl) : ''
  const currentIdx = job ? STAGES.findIndex(s => s.id === job.status) : -1
  const isRejected = job?.status === 'rejected'
  const isOffer = job?.status === 'offer'
  const interviews = job?.interviews || []
  const upcomingInterviews = useMemo(() => interviews
    .filter(iv => new Date(iv.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date)), [interviews])
  const nextInterview = upcomingInterviews[0]
  const activityLog = job?.activityLog || []
  const salaryLabel = formatSalary(job?.salary)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function updateSalary(sub, value) {
    setForm(prev => ({ ...prev, salary: { ...prev.salary, [sub]: value } }))
  }

  function handleStageClick(stageId) {
    if (!job || stageId === job.status) return
    onStatusChange?.(job.id, stageId)
  }

  function handleSave() {
    if (!job) return
    onUpdate?.({
      id: job.id,
      company: form.company,
      role: form.role,
      location: form.location,
      salary: salaryFromForm(form.salary),
      starred: form.starred,
      notes: form.notes,
      checklist: form.checklist,
    })
  }

  return {
    tab,
    setTab,
    notesMode,
    setNotesMode,
    form,
    update,
    updateSalary,
    handleStageClick,
    handleSave,
    stages: STAGES,
    domain,
    currentIdx,
    isRejected,
    isOffer,
    interviews,
    nextInterview,
    activityLog,
    salaryLabel,
  }
}
