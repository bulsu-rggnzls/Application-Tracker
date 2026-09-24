import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import extractDomain from '@/utils/extractDomain'

function getTabs(status) {
  const tabs = [
    { id: 0, label: 'Basic Info' },
    { id: 1, label: 'Compensation & Details' },
  ]
  if (status === 'interviewing') {
    tabs.push({ id: 2, label: 'Schedule Interview' })
  }
  return tabs
}

function createEmptyForm() {
  return {
    company: '', role: '', employmentType: 'full-time', location: '',
    salary: { min: '', max: '', currency: 'PHP', period: 'yearly' },
    status: 'wishlist', dateApplied: new Date().toISOString().split('T')[0], jobUrl: '', tags: [],
    recruiter: { name: '', email: '', linkedin: '' }, notes: '',
    interview: { date: '', time: '', platform: '', interviewer: '', notes: '' },
  }
}

function formFromEditingJob(editingJob) {
  const raw = editingJob.salary
  const salary = typeof raw === 'object' && raw
    ? { min: raw.min ? Number(raw.min) / 1000 : '', max: raw.max ? Number(raw.max) / 1000 : '', currency: raw.currency || 'PHP', period: raw.period || 'yearly' }
    : { min: '', max: '', currency: 'PHP', period: 'yearly' }
  const lastInterview = editingJob.interviews?.length > 0
    ? editingJob.interviews[editingJob.interviews.length - 1]
    : null
  return {
    company: editingJob.company || '', role: editingJob.role || '',
    employmentType: editingJob.employmentType || 'full-time', location: editingJob.location || '', salary,
    status: editingJob.status || 'wishlist', dateApplied: editingJob.dateApplied || new Date().toISOString().split('T')[0],
    jobUrl: editingJob.jobUrl || '', tags: editingJob.tags || [],
    recruiter: editingJob.recruiter || { name: '', email: '', linkedin: '' }, notes: editingJob.notes || '',
    interview: lastInterview
      ? { date: lastInterview.date?.split('T')[0] || '', time: lastInterview.time || '', platform: lastInterview.platform || '', interviewer: lastInterview.interviewer || '', notes: lastInterview.notes || '' }
      : { date: '', time: '', platform: '', interviewer: '', notes: '' },
  }
}

export default function useJobForm({ isOpen, editingJob, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const [showRecruiter, setShowRecruiter] = useState(false)
  const [logoDomain, setLogoDomain] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('wishlist')
  const [form, setForm] = useState(createEmptyForm)
  const initializedRef = useRef(false)

  const tabs = getTabs(selectedStatus)

  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(tabs.length - 1)
    }
  }, [tabs.length, activeTab])

  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false
      return
    }
    if (initializedRef.current) return
    initializedRef.current = true
    setActiveTab(0)
    if (editingJob) {
      setForm(formFromEditingJob(editingJob))
      setShowRecruiter(!!editingJob.recruiter?.name)
      setLogoDomain(extractDomain(editingJob.jobUrl) || '')
      setSelectedStatus(editingJob.status || 'wishlist')
    } else {
      setForm(createEmptyForm())
      setShowRecruiter(false)
      setLogoDomain('')
      setSelectedStatus('wishlist')
    }
  }, [editingJob, isOpen])

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  const updateSalary = (sub) => (e) => setForm(prev => ({ ...prev, salary: { ...prev.salary, [sub]: e.target.value } }))
  const updateRecruiter = (sub) => (e) => setForm(prev => ({ ...prev, recruiter: { ...prev.recruiter, [sub]: e.target.value } }))
  const updateInterview = (sub) => (e) => setForm(prev => ({ ...prev, interview: { ...prev.interview, [sub]: e.target.value } }))

  const handleCompanyChange = (e) => {
    const val = e.target.value
    setForm(prev => ({ ...prev, company: val }))
  }

  const handleJobUrlChange = (e) => {
    const val = e.target.value
    setForm(prev => ({ ...prev, jobUrl: val }))
    const domain = extractDomain(val)
    if (domain) setLogoDomain(domain)
  }

  const handleStatusSelect = (id) => {
    setSelectedStatus(id)
    setForm(prev => ({ ...prev, status: id }))
  }

  const toggleRecruiter = () => setShowRecruiter(prev => !prev)

  const addTag = (tag) => setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
  const removeTag = (tag) => setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))

  const goNext = () => setActiveTab(prev => prev + 1)
  const goBack = () => setActiveTab(prev => prev - 1)
  const goToTab = (id) => setActiveTab(id)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (activeTab < tabs.length - 1) {
      setActiveTab(prev => prev + 1)
      return
    }

    if (!form.company || !form.role) return
    const existingInterviews = editingJob?.interviews || []
    const newInterview = form.interview.date && form.interview.time
      ? { id: uuidv4(), stageName: 'Interview', date: form.interview.date, time: form.interview.time, platform: form.interview.platform, interviewer: form.interview.interviewer, notes: form.interview.notes }
      : null
    const job = {
      id: editingJob?.id || uuidv4(),
      company: form.company, role: form.role, employmentType: form.employmentType, location: form.location,
      salary: form.salary.min || form.salary.max
        ? { min: form.salary.min ? Number(form.salary.min) * 1000 : '', max: form.salary.max ? Number(form.salary.max) * 1000 : '', currency: form.salary.currency, period: form.salary.period }
        : '',
      status: selectedStatus, dateApplied: form.dateApplied || '', tags: form.tags, jobUrl: form.jobUrl,
      starred: editingJob?.starred || false,
      recruiter: form.recruiter.name ? { ...form.recruiter } : undefined,
      notes: form.notes,
      checklist: editingJob?.checklist || [],
      interviews: newInterview ? [...existingInterviews, newInterview] : existingInterviews,
      activityLog: editingJob?.activityLog || [],
    }
    onSave(job)
    onClose()
  }

  return {
    activeTab,
    tabs,
    showRecruiter,
    logoDomain,
    selectedStatus,
    form,
    update,
    updateSalary,
    updateRecruiter,
    updateInterview,
    handleCompanyChange,
    handleJobUrlChange,
    handleStatusSelect,
    toggleRecruiter,
    addTag,
    removeTag,
    goNext,
    goBack,
    goToTab,
    handleSubmit,
  }
}
