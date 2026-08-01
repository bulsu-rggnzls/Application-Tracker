import { useState, useEffect, useRef } from 'react'
import {
  X, Plus, Building2, Briefcase, MapPin, DollarSign,
  CalendarDays, Link, User, Mail, ExternalLink, Hash, Clock, Video
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import extractDomain from '../../utils/extractDomain'

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

const employmentTypes = ['full-time', 'part-time', 'contract', 'internship']
const currencies = [
  { label: 'PHP ₱', value: 'PHP' },
  { label: 'USD $', value: 'USD' },
  { label: 'EUR €', value: 'EUR' },
  { label: 'GBP £', value: 'GBP' },
]
const periods = [
  { label: '/yr', value: 'yearly' },
  { label: '/hr', value: 'hourly' },
  { label: '/mo', value: 'monthly' },
  { label: '/contract', value: 'contract' },
]

const STATUSES = [
  { id: 'wishlist', label: 'Wishlist', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-700', ring: 'ring-amber-400/30', activeBg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'applied', label: 'Applied', bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', ring: 'ring-blue-400/30', activeBg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'interviewing', label: 'Interviewing', bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700', ring: 'ring-purple-400/30', activeBg: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'offer', label: 'Offer', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700', ring: 'ring-emerald-400/30', activeBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'rejected', label: 'Rejected', bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-700', ring: 'ring-rose-400/30', activeBg: 'bg-rose-50 dark:bg-rose-900/20' },
]

function inputCls(hasIcon) {
  return `w-full ${hasIcon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200`
}

function selectCls() {
  return 'w-full px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 appearance-none cursor-pointer'
}

function InputIcon({ icon }) {
  return <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</span>
}

function PillInput({ tags, onAdd, onRemove, placeholder }) {
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

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition-all duration-200 min-h-[42px] cursor-text" onClick={() => inputRef.current?.focus()}>
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-700 rounded-lg px-2.5 py-1 text-xs font-semibold animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <Hash size={11} className="text-indigo-400 dark:text-indigo-500" />
          {tag}
          <button type="button" onClick={() => onRemove(tag)} className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors cursor-pointer">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => { if (value) commit(value) }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 py-0.5"
      />
    </div>
  )
}

export default function JobModal({ isOpen, onClose, onSave, editingJob }) {
  const [activeTab, setActiveTab] = useState(0)
  const [showRecruiter, setShowRecruiter] = useState(false)
  const [logoDomain, setLogoDomain] = useState('')
  const initializedRef = useRef(false)
  const [selectedStatus, setSelectedStatus] = useState('wishlist')

  const [form, setForm] = useState({
    company: '', role: '', employmentType: 'full-time', location: '',
    salary: { min: '', max: '', currency: 'PHP', period: 'yearly' },
    status: 'wishlist', dateApplied: new Date().toISOString().split('T')[0], jobUrl: '', tags: [],
    recruiter: { name: '', email: '', linkedin: '' }, notes: '',
    interview: { date: '', time: '', platform: '', interviewer: '', notes: '' },
  })

  const TABS = getTabs(selectedStatus)

  useEffect(() => {
    if (activeTab >= TABS.length) {
      setActiveTab(TABS.length - 1)
    }
  }, [TABS.length, activeTab])

  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false
      return
    }
    if (initializedRef.current) return
    initializedRef.current = true
    setActiveTab(0)
    if (editingJob) {
      const raw = editingJob.salary
      const salary = typeof raw === 'object' && raw
        ? { min: raw.min ? Number(raw.min) / 1000 : '', max: raw.max ? Number(raw.max) / 1000 : '', currency: raw.currency || 'PHP', period: raw.period || 'yearly' }
        : { min: '', max: '', currency: 'PHP', period: 'yearly' }
      const lastInterview = editingJob.interviews?.length > 0
        ? editingJob.interviews[editingJob.interviews.length - 1]
        : null
      setForm({
        company: editingJob.company || '', role: editingJob.role || '',
        employmentType: editingJob.employmentType || 'full-time', location: editingJob.location || '', salary,
        status: editingJob.status || 'wishlist', dateApplied: editingJob.dateApplied || new Date().toISOString().split('T')[0],
        jobUrl: editingJob.jobUrl || '', tags: editingJob.tags || [],
        recruiter: editingJob.recruiter || { name: '', email: '', linkedin: '' }, notes: editingJob.notes || '',
        interview: lastInterview
          ? { date: lastInterview.date?.split('T')[0] || '', time: lastInterview.time || '', platform: lastInterview.platform || '', interviewer: lastInterview.interviewer || '', notes: lastInterview.notes || '' }
          : { date: '', time: '', platform: '', interviewer: '', notes: '' },
      })
      setShowRecruiter(!!editingJob.recruiter?.name)
      setLogoDomain(extractDomain(editingJob.jobUrl) || '')
      setSelectedStatus(editingJob.status || 'wishlist')
    } else {
      setForm({
        company: '', role: '', employmentType: 'full-time', location: '',
        salary: { min: '', max: '', currency: 'PHP', period: 'yearly' },
        status: 'wishlist', dateApplied: new Date().toISOString().split('T')[0], jobUrl: '', tags: [],
        recruiter: { name: '', email: '', linkedin: '' }, notes: '',
        interview: { date: '', time: '', platform: '', interviewer: '', notes: '' },
      })
      setShowRecruiter(false)
      setLogoDomain('')
      setSelectedStatus('wishlist')
    }
  }, [editingJob, isOpen])

  if (!isOpen) return null

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

  const addTag = (tag) => setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
  const removeTag = (tag) => setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (activeTab < TABS.length - 1) {
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
      recruiter: form.recruiter.name ? { ...form.recruiter } : undefined,
      notes: form.notes,
      interviews: newInterview ? [...existingInterviews, newInterview] : existingInterviews,
      activityLog: editingJob?.activityLog || [],
    }
    onSave(job)
    onClose()
  }

  const logoInitial = form.company ? form.company[0].toUpperCase() : '?'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-xl mx-4 max-h-[90vh] flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>

        {/* ---------- HEADER ---------- */}
        <div className="relative shrink-0 overflow-hidden rounded-t-2xl">
          <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden">
                {logoDomain ? (
                  <img src={`https://www.google.com/s2/favicons?domain=${logoDomain}&sz=64`} alt="" className="w-5 h-5" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = '' }} />
                ) : null}
                <span className={logoDomain ? 'hidden' : ''}><Briefcase size={18} /></span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">{editingJob ? 'Edit Application' : 'New Application'}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {form.company || form.role ? `${form.company || 'Company'}${form.company && form.role ? ' — ' : ''}${form.role || 'Role'}` : 'Enter company and role to get started'}
                </p>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Progress stepper */}
          <div className="flex bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-3">
            {TABS.map((tab, i) => (
              <div key={tab.id} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : activeTab > tab.id
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                  }`}>
                    {activeTab > tab.id ? '✓' : i + 1}
                  </span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
                {i < TABS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${
                    activeTab > tab.id ? 'bg-indigo-400' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- BODY ---------- */}
        <form id="job-form" onSubmit={handleSubmit} onKeyDown={e => { if (e.key === 'Enter' && activeTab < TABS.length - 1) e.preventDefault() }} className="flex flex-col flex-1 overflow-hidden">

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">

          {/* Step 1 – Basic Info */}
          {activeTab === 0 && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Company Name</label>
                  <div className="relative">
                    <InputIcon icon={<Building2 size={15} />} />
                    <input type="text" value={form.company} onChange={handleCompanyChange} required placeholder="e.g. Stripe" className={inputCls(true)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Role Title</label>
                  <div className="relative">
                    <InputIcon icon={<Briefcase size={15} />} />
                    <input type="text" value={form.role} onChange={update('role')} required placeholder="e.g. Senior Frontend" className={inputCls(true)} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Employment Type</label>
                  <select value={form.employmentType} onChange={update('employmentType')} className={selectCls()}>
                    {employmentTypes.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Location Type</label>
                  <div className="relative">
                    <InputIcon icon={<MapPin size={15} />} />
                    <input type="text" value={form.location} onChange={update('location')} placeholder="Remote, Hybrid, On-site" className={inputCls(true)} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <InputIcon icon={<CalendarDays size={15} />} />
                  <input type="date" value={form.dateApplied} onChange={update('dateApplied')} className={inputCls(true)} />
                </div>
                <div className="relative">
                  <InputIcon icon={<Link size={15} />} />
                  <input type="url" value={form.jobUrl} onChange={handleJobUrlChange} placeholder="https://company.com/jobs/..." className={inputCls(true)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(s.id)
                        setForm(prev => ({ ...prev, status: s.id }))
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        selectedStatus === s.id
                          ? `${s.bg} ${s.text} ${s.border} ring-2 ${s.ring} scale-105`
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${selectedStatus === s.id ? s.bg.split(' ')[0] : 'bg-slate-200 dark:bg-slate-600'}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 – Compensation & Details */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Salary</label>
                <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2">
                  <div className="relative">
                    <InputIcon icon={<DollarSign size={15} />} />
                    <input type="number" value={form.salary.min} onChange={updateSalary('min')} placeholder="Min ($k)" className={inputCls(true)} />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">–</span>
                    <input type="number" value={form.salary.max} onChange={updateSalary('max')} placeholder="Max ($k)" className={inputCls(true)} />
                  </div>
                  <select value={form.salary.period} onChange={updateSalary('period')} className={`${selectCls()} w-24`}>
                    {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <select value={form.salary.currency} onChange={updateSalary('currency')} className={`${selectCls()} w-22`}>
                    {currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tags</label>
                <PillInput tags={form.tags} onAdd={addTag} onRemove={removeTag} placeholder="Type a tag and press Enter..." />
              </div>
              <div>
                <button type="button" onClick={() => setShowRecruiter(!showRecruiter)} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  <User size={13} />
                  {showRecruiter ? 'Hide recruiter info' : 'Add recruiter info'}
                  <span className="text-slate-300 dark:text-slate-600">(optional)</span>
                </button>
                {showRecruiter && (
                  <div className="mt-2 grid grid-cols-3 gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    <div className="relative">
                      <InputIcon icon={<User size={14} />} />
                      <input type="text" value={form.recruiter.name} onChange={updateRecruiter('name')} placeholder="Name" className={inputCls(true)} />
                    </div>
                    <div className="relative">
                      <InputIcon icon={<Mail size={14} />} />
                      <input type="email" value={form.recruiter.email} onChange={updateRecruiter('email')} placeholder="Email" className={inputCls(true)} />
                    </div>
                    <div className="relative">
                      <InputIcon icon={<ExternalLink size={14} />} />
                      <input type="url" value={form.recruiter.linkedin} onChange={updateRecruiter('linkedin')} placeholder="LinkedIn URL" className={inputCls(true)} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Notes</label>
                <textarea rows={2} value={form.notes} onChange={update('notes')} placeholder="Any additional notes..." className={`${inputCls(false)} resize-none`} />
              </div>
            </div>
          )}

          {/* Step 3 – Schedule Interview (only for interviewing status) */}
          {activeTab === 2 && selectedStatus === 'interviewing' && form.interview && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    <CalendarDays size={13} /> Interview Date
                  </label>
                  <input type="date" value={form.interview.date} onChange={updateInterview('date')} className={inputCls(false)} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    <Clock size={13} /> Interview Time
                  </label>
                  <input type="time" value={form.interview.time} onChange={updateInterview('time')} className={inputCls(false)} />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  <Video size={13} /> Platform
                </label>
                <input type="text" value={form.interview.platform} onChange={updateInterview('platform')} placeholder="Zoom, Google Meet, etc." className={inputCls(false)} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  <User size={13} /> Interviewer
                </label>
                <input type="text" value={form.interview.interviewer} onChange={updateInterview('interviewer')} placeholder="e.g. Sarah Chen" className={inputCls(false)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Interview Notes</label>
                <textarea rows={2} value={form.interview.notes} onChange={updateInterview('notes')} placeholder="Preparation notes, topics to cover..." className={`${inputCls(false)} resize-none`} />
              </div>
            </div>
          )}

          </div>

          {/* ---------- FOOTER ---------- */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
            <p className="text-xs text-slate-400 dark:text-slate-500">Step {activeTab + 1} of {TABS.length}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer">
                Cancel
              </button>
              {activeTab > 0 && (
                <button type="button" onClick={() => setActiveTab(prev => prev - 1)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  Back
                </button>
              )}
              {activeTab < TABS.length - 1 ? (
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab(prev => prev + 1) }} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 rounded-lg active:scale-[0.98] transition-all duration-200 cursor-pointer">
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!form.company || !form.role}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer rounded-lg"
                >
                  {editingJob ? 'Save Changes' : 'Add Application'}
                </button>
              )}
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}
