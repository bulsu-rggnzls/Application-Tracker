import { X, Briefcase, User, Hash } from 'lucide-react'
import { Button, IconButton, Input, Heading, Text } from '@/components/ui'
import useJobForm from '../hooks/useJobForm'
import usePillInput from '../hooks/usePillInput'
import { STATUSES as STATUS_IDS, statusLabel, statusChip, statusDot } from '@/lib/status'

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

const STATUSES = STATUS_IDS.map(id => ({
  id,
  label: statusLabel(id),
  selected: statusChip(id),
  dot: statusDot(id),
  idle: 'bg-surface-muted border border-border text-text-subtle hover:border-border-strong',
}))

function inputCls() {
  return 'w-full px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-xl placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand dark:focus:border-brand focus:ring-4 focus:ring-brand-ring transition-ui'
}

function selectCls() {
  return `${inputCls()} appearance-none cursor-pointer pr-8`
}

const inputOverrideCls = '!px-3.5 !py-2.5 !text-text-secondary !bg-surface-muted !border-border !rounded-xl focus:!bg-surface focus:!border-brand focus:!ring-4 focus:!ring-brand-ring'

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
        {hint && <span className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function PillInput({ tags, onAdd, onRemove, placeholder }) {
  const { value, setValue, inputRef, handleKeyDown, handlePaste, handleBlur } = usePillInput({ tags, onAdd, onRemove })

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-xl focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-brand dark:focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-ring transition-ui min-h-[42px] cursor-text" onClick={() => inputRef.current?.focus()}>
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-700 rounded-lg px-2.5 py-1 text-xs font-semibold animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <Hash size={11} className="text-indigo-400 dark:text-indigo-500" />
          {tag}
          <IconButton type="button" color="indigo" onClick={() => onRemove(tag)} className="!p-0 !text-indigo-400 dark:hover:!text-indigo-200 hover:!bg-transparent dark:hover:!bg-transparent">
            <X size={12} />
          </IconButton>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 py-0.5"
      />
    </div>
  )
}

export default function JobModal({ isOpen, onClose, onSave, editingJob }) {
  const {
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
  } = useJobForm({ isOpen, editingJob, onSave, onClose })

  if (!isOpen) return null

  const logoInitial = form.company ? form.company[0].toUpperCase() : '?'

  return (
    <div className="modal-overlay backdrop-blur-[3px]" onClick={onClose}>
      <div className="modal-shell w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in !rounded-3xl" onClick={e => e.stopPropagation()}>

        {/* ---------- HEADER ---------- */}
        <div className="shrink-0 px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0 overflow-hidden">
                {logoDomain ? (
                  <img src={`https://www.google.com/s2/favicons?domain=${logoDomain}&sz=64`} alt="" className="w-6 h-6" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = '' }} />
                ) : null}
                <span className={logoDomain ? 'hidden' : ''}>
                  {form.company ? logoInitial : <Briefcase size={20} />}
                </span>
              </div>
              <div className="min-w-0">
                <Heading size="md" className="truncate">{editingJob ? 'Edit application' : 'New application'}</Heading>
                <Text variant="subtle" className="truncate mt-0.5">
                  {form.company ? `${form.company} · ${form.role || 'Role'}` : 'The essentials first — you can refine later'}
                </Text>
              </div>
            </div>
            <IconButton type="button" onClick={onClose} aria-label="Close" className="shrink-0">
              <X size={18} />
            </IconButton>
          </div>

          {/* Segmented step tabs */}
          <div className="mt-5 flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => goToTab(tab.id)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-ui cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- BODY ---------- */}
        <form id="job-form" onSubmit={handleSubmit} onKeyDown={e => { if (e.key === 'Enter' && activeTab < tabs.length - 1) e.preventDefault() }} className="flex flex-col flex-1 overflow-hidden">

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">

          {/* Step 1 – Basic Info */}
          {activeTab === 0 && (
            <div className="space-y-5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company name">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="text" value={form.company} onChange={handleCompanyChange} required placeholder="e.g. Stripe" autoFocus />
                </Field>
                <Field label="Role title">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="text" value={form.role} onChange={update('role')} required placeholder="e.g. Senior Frontend" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Employment type">
                  <select value={form.employmentType} onChange={update('employmentType')} className={selectCls()}>
                    {employmentTypes.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Location">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="text" value={form.location} onChange={update('location')} placeholder="Remote, Hybrid (NYC), On-site" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date applied">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="date" value={form.dateApplied} onChange={update('dateApplied')} />
                </Field>
                <Field label="Job posting URL">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="url" value={form.jobUrl} onChange={handleJobUrlChange} placeholder="https://company.com/jobs/…" />
                </Field>
              </div>
              <Field label="Status">
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {STATUSES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStatusSelect(s.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-ui cursor-pointer ${
                        selectedStatus === s.id
                          ? `${s.selected} ring-2 ring-brand-ring`
                          : s.idle
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedStatus === s.id ? s.dot : 'bg-border-strong'}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* Step 2 – Compensation & Details */}
          {activeTab === 1 && (
            <div className="space-y-5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <Field label="Salary" hint="enter amounts in thousands (k)">
                <div className="flex items-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 overflow-hidden focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-brand dark:focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-ring transition-ui">
                  <Input flush containerClassName="relative flex-1 min-w-0" type="number" min="0" max="100000" step="1" value={form.salary.min} onChange={updateSalary('min')} placeholder="Min" className="px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200" />
                  <span className="text-slate-300 dark:text-slate-600 font-medium select-none">–</span>
                  <Input flush containerClassName="relative flex-1 min-w-0" type="number" min="0" max="100000" step="1" value={form.salary.max} onChange={updateSalary('max')} placeholder="Max" className="px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200" />
                  <span className="pr-3.5 text-xs font-semibold text-slate-400 select-none shrink-0">k</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <select value={form.salary.period} onChange={updateSalary('period')} className={selectCls()}>
                    {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <select value={form.salary.currency} onChange={updateSalary('currency')} className={selectCls()}>
                    {currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </Field>

              <Field label="Tags">
                <PillInput tags={form.tags} onAdd={addTag} onRemove={removeTag} placeholder="Type a tag and press Enter…" />
              </Field>

              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={toggleRecruiter}
                  className="!inline-flex !p-0 !text-xs !font-semibold !text-indigo-600 dark:!text-indigo-400 hover:!text-indigo-700 dark:hover:!text-indigo-300 hover:!bg-transparent dark:hover:!bg-transparent"
                >
                  <User size={13} />
                  {showRecruiter ? 'Hide recruiter info' : 'Add recruiter info'}
                  <span className="text-slate-300 dark:text-slate-600 font-medium">(optional)</span>
                </Button>
                {showRecruiter && (
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    <Input containerClassName="relative w-full" className={inputOverrideCls} type="text" value={form.recruiter.name} onChange={updateRecruiter('name')} placeholder="Name" />
                    <Input containerClassName="relative w-full" className={inputOverrideCls} type="email" value={form.recruiter.email} onChange={updateRecruiter('email')} placeholder="Email" />
                    <Input containerClassName="relative w-full" className={inputOverrideCls} type="url" value={form.recruiter.linkedin} onChange={updateRecruiter('linkedin')} placeholder="LinkedIn URL" />
                  </div>
                )}
              </div>

              <Field label="Notes">
                <textarea rows={2} value={form.notes} onChange={update('notes')} placeholder="Anything worth remembering about this application…" className={`${inputCls()} resize-none`} />
              </Field>
            </div>
          )}

          {/* Step 3 – Schedule Interview (only for interviewing status) */}
          {activeTab === 2 && selectedStatus === 'interviewing' && form.interview && (
            <div className="space-y-5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-3 text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                This interview will be attached to <span className="font-semibold">{form.company || 'this application'}</span> once you save.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Interview date">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="date" value={form.interview.date} onChange={updateInterview('date')} />
                </Field>
                <Field label="Time">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="time" value={form.interview.time} onChange={updateInterview('time')} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Platform">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="text" value={form.interview.platform} onChange={updateInterview('platform')} placeholder="Zoom, Google Meet, onsite…" />
                </Field>
                <Field label="Interviewer">
                  <Input containerClassName="relative w-full" className={inputOverrideCls} type="text" value={form.interview.interviewer} onChange={updateInterview('interviewer')} placeholder="e.g. Sarah Chen" />
                </Field>
              </div>
              <Field label="Interview notes">
                <textarea rows={2} value={form.interview.notes} onChange={updateInterview('notes')} placeholder="Topics to cover, preparation reminders…" className={`${inputCls()} resize-none`} />
              </Field>
            </div>
          )}

          </div>

          {/* ---------- FOOTER ---------- */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/60 dark:bg-slate-900/60 rounded-b-3xl">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                {tabs.map((t, i) => (
                  <span
                    key={t.id}
                    className={`h-1.5 rounded-full transition-ui ${
                      i === activeTab
                        ? 'w-7 bg-indigo-500'
                        : i < activeTab
                          ? 'w-3 bg-indigo-300'
                          : 'w-3 bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <Text variant="muted-sm">{activeTab + 1} / {tabs.length}</Text>
            </div>
            <div className="flex items-center gap-2">
              {activeTab > 0 && (
                <Button type="button" variant="secondary" onClick={goBack}>
                  Back
                </Button>
              )}
              {activeTab < tabs.length - 1 ? (
                <Button type="button" variant="indigo" onClick={(e) => { e.preventDefault(); e.stopPropagation(); goNext() }} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20">
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="indigo"
                  disabled={!form.company || !form.role}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:shadow-none disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
                >
                  {editingJob ? 'Save changes' : 'Add application'}
                </Button>
              )}
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}
