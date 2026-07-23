import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const statuses = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected']
const employmentTypes = ['full-time', 'contract', 'part-time']
const platforms = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Skype', 'Phone', 'In-person']

export default function JobModal({ isOpen, onClose, onSave, editingJob }) {
  const [form, setForm] = useState({
    company: '', role: '', location: '', salary: '', employmentType: 'full-time',
    status: 'wishlist', dateApplied: '', tags: '', jobUrl: '', notes: '',
    interviews: [],
  })

  useEffect(() => {
    if (editingJob) {
      setForm({
        ...editingJob,
        tags: editingJob.tags.join(', '),
        interviews: editingJob.interviews || [],
      })
    } else {
      setForm({ company: '', role: '', location: '', salary: '', employmentType: 'full-time', status: 'wishlist', dateApplied: '', tags: '', jobUrl: '', notes: '', interviews: [] })
    }
  }, [editingJob, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company || !form.role) return
    const job = {
      id: editingJob?.id || uuidv4(),
      company: form.company,
      role: form.role,
      location: form.location,
      salary: form.salary,
      employmentType: form.employmentType,
      status: form.status,
      dateApplied: form.dateApplied || '',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      jobUrl: form.jobUrl,
      notes: form.notes,
      interviews: form.interviews,
      activityLog: editingJob?.activityLog || [],
    }
    onSave(job)
    onClose()
  }

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const addInterview = () => {
    setForm(prev => ({
      ...prev,
      interviews: [...prev.interviews, { id: uuidv4(), date: '', time: '', interviewer: '', platform: 'Zoom', notes: '' }],
    }))
  }

  const updateInterview = (id, field) => (e) => {
    setForm(prev => ({
      ...prev,
      interviews: prev.interviews.map(iv => iv.id === id ? { ...iv, [field]: e.target.value } : iv),
    }))
  }

  const removeInterview = (id) => {
    setForm(prev => ({
      ...prev,
      interviews: prev.interviews.filter(iv => iv.id !== id),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{editingJob ? 'Edit Application' : 'Add Application'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Company *</label>
              <input type="text" value={form.company} onChange={update('company')} required className="input-base" />
            </div>
            <div>
              <label className="label-base">Role *</label>
              <input type="text" value={form.role} onChange={update('role')} required className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Employment Type</label>
              <select value={form.employmentType} onChange={update('employmentType')} className="input-base">
                {employmentTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">Location</label>
              <input type="text" value={form.location} onChange={update('location')} placeholder="Remote, Hybrid, On-site" className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Salary</label>
              <input type="text" value={form.salary} onChange={update('salary')} placeholder="$120k - $150k" className="input-base" />
            </div>
            <div>
              <label className="label-base">Status</label>
              <select value={form.status} onChange={update('status')} className="input-base">
                {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Date Applied</label>
              <input type="date" value={form.dateApplied} onChange={update('dateApplied')} className="input-base" />
            </div>
            <div>
              <label className="label-base">Job URL</label>
              <input type="url" value={form.jobUrl} onChange={update('jobUrl')} placeholder="https://..." className="input-base" />
            </div>
          </div>
          <div>
            <label className="label-base">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={update('tags')} placeholder="React, TypeScript, Tailwind" className="input-base" />
          </div>
          <div>
            <label className="label-base">Notes</label>
            <textarea rows={3} value={form.notes} onChange={update('notes')} className="input-base resize-none" />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interviews</label>
              <button type="button" onClick={addInterview} className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer">
                <Plus size={14} /> Add Interview
              </button>
            </div>
            {form.interviews.length === 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">No interviews scheduled yet.</p>
            )}
            <div className="space-y-3">
              {form.interviews.map((iv, i) => (
                <div key={iv.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Interview #{i + 1}</span>
                    <button type="button" onClick={() => removeInterview(iv.id)} className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Date</label>
                      <input type="date" value={iv.date} onChange={updateInterview(iv.id, 'date')} className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Time</label>
                      <input type="time" value={iv.time} onChange={updateInterview(iv.id, 'time')} className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Platform</label>
                      <select value={iv.platform} onChange={updateInterview(iv.id, 'platform')} className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Interviewer</label>
                      <input type="text" value={iv.interviewer} onChange={updateInterview(iv.id, 'interviewer')} placeholder="Name" className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingJob ? 'Save Changes' : 'Add Application'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}