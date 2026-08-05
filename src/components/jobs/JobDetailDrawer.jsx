import { useState, useEffect, useRef } from 'react'
import { X, ExternalLink, Calendar, MapPin, DollarSign, Briefcase, Clock, User, Video, Check, Trash2, Star, Save, Eye, EyeOff, LayoutGrid, FileText, ClipboardList } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Markdown from 'react-markdown'
import { Avatar, Button, Heading, IconButton, Text, Badge } from '../ui'
import { getTagStyle } from '../../utils/tagColors'
import CompanyLogo from './CompanyLogo'
import InterviewChecklist from './InterviewChecklist'
import extractDomain from '../../utils/extractDomain'
import getRelativeTime from '../../utils/getRelativeTime'
import formatSalary from '../../utils/formatSalary'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'checklist', label: 'Checklist', icon: ClipboardList },
]

const STAGES = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'applied', label: 'Applied' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'offer', label: 'Offer' },
]

const STAGE_COLORS = {
  wishlist: { bg: 'bg-orange-500', ring: 'ring-orange-500/20' },
  applied: { bg: 'bg-blue-500', ring: 'ring-blue-500/20' },
  interviewing: { bg: 'bg-purple-600', ring: 'ring-purple-500/20' },
  offer: { bg: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
}

const CURRENCIES = ['USD', 'PHP', 'EUR', 'GBP']
const PERIODS = [
  { label: '/yr', value: 'yearly' },
  { label: '/mo', value: 'monthly' },
  { label: '/hr', value: 'hourly' },
  { label: '/contract', value: 'contract' },
]

const inputCls = 'w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200'
const selectCls = `${inputCls} appearance-none cursor-pointer`

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

export default function JobDetailDrawer({ job, isOpen, onClose, onDelete, onStatusChange, onUpdate }) {
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

  if (!isOpen || !job) return null

  const domain = extractDomain(job.jobUrl)
  const currentIdx = STAGES.findIndex(s => s.id === job.status)
  const isRejected = job.status === 'rejected'
  const isOffer = job.status === 'offer'
  const interviews = job.interviews || []
  const upcomingInterviews = interviews
    .filter(iv => new Date(iv.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  const nextInterview = upcomingInterviews[0]
  const activityLog = job.activityLog || []
  const salaryLabel = formatSalary(job.salary)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function updateSalary(sub, value) {
    setForm(prev => ({ ...prev, salary: { ...prev.salary, [sub]: value } }))
  }

  function handleStageClick(stageId) {
    if (stageId === job.status) return
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* ---------- HEADER ---------- */}
            <div className="px-6 pt-6 pb-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <Heading size="md">Application Details</Heading>
                <IconButton type="button" onClick={onClose} aria-label="Close"><X size={20} /></IconButton>
              </div>
              <div className="flex items-center gap-4">
                <Avatar size="lg" className="p-2">
                  <CompanyLogo domain={domain} company={job.company} />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Text variant="body" className="!font-semibold !text-slate-900 dark:!text-white truncate">{job.company}</Text>
                  <Text variant="subtle" className="truncate">{job.role}</Text>
                </div>
                {job.starred && (
                  <Star size={18} className="text-amber-400 fill-amber-400 shrink-0" />
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex items-center justify-center gap-1.5 flex-1 px-2 py-2 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                      tab === id
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ---------- BODY ---------- */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6">
              {tab === 'overview' && (
                <div className="space-y-5 animate-in fade-in-0 duration-150">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Company</label>
                      <input type="text" value={form.company} onChange={e => update('company', e.target.value)} className={inputCls} placeholder="Company name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Role Title</label>
                      <input type="text" value={form.role} onChange={e => update('role', e.target.value)} className={inputCls} placeholder="Role title" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Location</label>
                    <input type="text" value={form.location} onChange={e => update('location', e.target.value)} className={inputCls} placeholder="Remote, Hybrid, On-site..." />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Salary Range</label>
                    <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2">
                      <input type="number" min="0" value={form.salary.min} onChange={e => updateSalary('min', e.target.value)} className={inputCls} placeholder="Min (k)" />
                      <input type="number" min="0" value={form.salary.max} onChange={e => updateSalary('max', e.target.value)} className={inputCls} placeholder="Max (k)" />
                      <select value={form.salary.period} onChange={e => updateSalary('period', e.target.value)} className={`${selectCls} w-24`}>
                        {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                      <select value={form.salary.currency} onChange={e => updateSalary('currency', e.target.value)} className={`${selectCls} w-22`}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {salaryLabel && (
                      <Text variant="muted-sm" className="mt-1.5">
                        Current: <span className="text-slate-500 dark:text-slate-400 font-medium">{salaryLabel}</span>
                      </Text>
                    )}
                  </div>

                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div>
                      <Text variant="body" className="!font-medium">Priority</Text>
                      <Text variant="muted-sm">Star to mark this application as high priority</Text>
                    </div>
                    <button
                      type="button"
                      onClick={() => update('starred', !form.starred)}
                      aria-label="Toggle priority star"
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star size={24} className={form.starred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
                    </button>
                  </div>

                  <div>
                    <Heading size="xs" className="mb-3">Progress</Heading>
                    <div className="relative pl-7">
                      <div className="absolute left-3 top-1 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                      {STAGES.map((stage, i) => {
                        const color = STAGE_COLORS[stage.id]
                        const isComplete = i < currentIdx && !isRejected
                        const isCurrent = stage.id === job.status
                        const isFuture = i > currentIdx && !isRejected

                        let nodeStyle = 'bg-slate-300 dark:bg-slate-600 ring-white dark:ring-slate-900'
                        let labelStyle = 'text-slate-400 dark:text-slate-500'
                        if (isComplete) {
                          nodeStyle = `${color.bg} text-white ring-white dark:ring-slate-900`
                          labelStyle = 'text-slate-900 dark:text-white font-medium'
                        }
                        if (isCurrent) {
                          nodeStyle = `${color.bg} text-white ring-4 ${color.ring}`
                          labelStyle = 'text-slate-900 dark:text-white font-semibold'
                        }

                        return (
                          <button
                            key={stage.id}
                            onClick={() => handleStageClick(stage.id)}
                            className="relative pb-5 last:pb-0 flex items-center gap-3 w-full text-left group cursor-pointer"
                          >
                            <div className={`absolute -left-[26px] top-0.5 w-[14px] h-[14px] rounded-full ring-2 flex items-center justify-center transition-all duration-200 ${nodeStyle} ${isFuture ? 'group-hover:bg-slate-400' : ''}`}>
                              {isComplete && <Check size={8} strokeWidth={3} />}
                              {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className={`text-sm transition-colors ${labelStyle} ${isFuture ? 'group-hover:text-slate-600 dark:group-hover:text-slate-300' : ''}`}>{stage.label}</span>
                          </button>
                        )
                      })}
                      {isRejected && (
                        <div className="relative pb-0 flex items-center gap-3">
                          <div className="absolute -left-[26px] top-0.5 w-[14px] h-[14px] rounded-full ring-2 ring-white dark:ring-slate-900 bg-rose-500 flex items-center justify-center">
                            <X size={8} strokeWidth={3} />
                          </div>
                          <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Rejected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isOffer && nextInterview && (
                    <div>
                      <Heading size="xs" className="mb-3">Next Interview</Heading>
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                            {new Date(nextInterview.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-800/40 px-2 py-0.5 rounded-full">
                            {nextInterview.time}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-purple-600 dark:text-purple-300 mb-3">
                          {nextInterview.interviewer && (
                            <span className="inline-flex items-center gap-1.5"><User size={12} /> {nextInterview.interviewer}</span>
                          )}
                          {nextInterview.platform && (
                            <span className="inline-flex items-center gap-1.5"><Video size={12} /> {nextInterview.platform}</span>
                          )}
                        </div>
                        {nextInterview.meetingLink && (
                          <Button
                            as="a"
                            href={nextInterview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="indigo"
                            className="!px-3 !py-1.5 !text-xs !rounded-lg"
                          >
                            <ExternalLink size={12} /> Join Meeting
                          </Button>
                        )}
                        {nextInterview.notes && (
                          <Text variant="subtle-sm" className="text-purple-500 dark:text-purple-400 mt-2 italic border-t border-purple-200 dark:border-purple-700 pt-2">{nextInterview.notes}</Text>
                        )}
                      </div>
                    </div>
                  )}

                  {!isOffer && interviews.length > 0 && !nextInterview && (
                    <div>
                      <Heading size="xs" className="mb-3">Interviews ({interviews.length})</Heading>
                      <div className="space-y-2.5">
                        {interviews.map((iv, i) => (
                          <div key={iv.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Round {i + 1}</span>
                              <Text variant="muted-sm">{new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                              {iv.time && <span className="inline-flex items-center gap-1"><Clock size={11} /> {iv.time}</span>}
                              {iv.platform && <span className="inline-flex items-center gap-1"><Video size={11} /> {iv.platform}</span>}
                              {iv.interviewer && <span className="inline-flex items-center gap-1"><User size={11} /> {iv.interviewer}</span>}
                            </div>
                            {iv.notes && <Text variant="muted-sm" className="italic mt-1">{iv.notes}</Text>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {job.salary && (
                      <Badge variant="meta" className="!bg-emerald-50 !text-emerald-700 !border-emerald-200 dark:!bg-emerald-900/30 dark:!text-emerald-300 dark:!border-emerald-700 !border !font-bold">
                        <DollarSign size={13} /> {formatSalary(job.salary)}
                      </Badge>
                    )}
                    {job.location && (
                      <Badge variant="meta" className="!bg-blue-50 !text-blue-700 !border-blue-200 dark:!bg-blue-900/30 dark:!text-blue-300 dark:!border-blue-700 !border !font-medium">
                        <MapPin size={13} /> {job.location}
                      </Badge>
                    )}
                    {job.employmentType && (
                      <Badge variant="meta" className="!border !border-slate-200 dark:!border-slate-600">
                        <Briefcase size={13} /> {job.employmentType === 'full-time' ? 'Full-time' : job.employmentType === 'contract' ? 'Contract' : 'Part-time'}
                      </Badge>
                    )}
                    {job.dateApplied && (
                      <Badge variant="meta" className="!border !border-slate-200 dark:!border-slate-600">
                        <Calendar size={13} /> {getRelativeTime(job.dateApplied)}
                      </Badge>
                    )}
                  </div>

                  {job.tags.length > 0 && (
                    <div>
                      <Heading size="xs" className="mb-2.5">Tech Stack</Heading>
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.map(tag => {
                          const s = getTagStyle(tag)
                          return (
                            <span key={tag} className={`text-xs font-medium ${s.bg} ${s.text} ${s.darkBg} ${s.darkText} px-2.5 py-1 rounded-md`}>{tag}</span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activityLog.length > 0 && (
                    <div>
                      <Heading size="xs" className="mb-3">Activity</Heading>
                      <div className="space-y-3">
                        {activityLog.map(log => (
                          <div key={log.id} className="flex items-start gap-3 text-xs">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 mt-1 shrink-0 ring-2 ring-indigo-100 dark:ring-indigo-900/40" />
                            <div>
                              <Text variant="body" className="!font-medium !text-slate-700 dark:!text-slate-300">{log.details}</Text>
                              <Text variant="muted-sm" className="mt-0.5">{getRelativeTime(log.timestamp)}</Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'notes' && (
                <div className="animate-in fade-in-0 duration-150">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Job Description & Notes</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setNotesMode('edit')}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          notesMode === 'edit'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <EyeOff size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotesMode('preview')}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          notesMode === 'preview'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <Eye size={12} /> Preview
                      </button>
                    </div>
                  </div>

                  {notesMode === 'edit' ? (
                    <textarea
                      value={form.notes}
                      onChange={e => update('notes', e.target.value)}
                      placeholder="Paste the job description or your notes here. Supports markdown for formatting..."
                      rows={16}
                      className={`${inputCls} resize-none font-mono leading-relaxed`}
                    />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 min-h-[280px] text-sm text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none">
                      {form.notes ? <Markdown>{form.notes}</Markdown> : <Text variant="muted" className="italic">No notes yet.</Text>}
                    </div>
                  )}

                  <Text variant="muted-sm" className="mt-2">
                    Supports markdown for **bold**, *emphasis*, lists, and links.
                  </Text>
                </div>
              )}

              {tab === 'checklist' && (
                <div className="animate-in fade-in-0 duration-150">
                  <Heading size="xs" className="mb-3">Interview Checklist</Heading>
                  <InterviewChecklist items={form.checklist} onChange={value => update('checklist', value)} />
                </div>
              )}
            </div>

            {/* ---------- FOOTER ---------- */}
            <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900 shrink-0">
              <div className="flex gap-2">
                {job.jobUrl && (
                  <Button
                    as="a"
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="indigo-outline"
                    className="flex-1"
                  >
                    <ExternalLink size={15} /> Job Post
                  </Button>
                )}
                <Button variant="indigo" onClick={handleSave} className="flex-1">
                  <Save size={15} /> Save Changes
                </Button>
                <IconButton color="rose" className="!p-2.5 border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-900/20 hover:!bg-rose-100 dark:hover:!bg-rose-900/40" onClick={() => { onDelete(job.id); onClose() }} title="Delete">
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
