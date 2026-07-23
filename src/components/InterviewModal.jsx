import { useState } from 'react'
import { X, Calendar, Clock, User, Video } from 'lucide-react'

const platforms = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Skype', 'Phone', 'In-person']

export default function InterviewModal({ isOpen, onClose, onConfirm, job }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [platform, setPlatform] = useState('Zoom')
  const [interviewer, setInterviewer] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen || !job) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!date || !time) return
    onConfirm(job.id, { date, time, platform, interviewer, notes })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Schedule Interview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.company} — {job.role}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <Calendar size={13} /> Date *
              </label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="input-base" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <Clock size={13} /> Time *
              </label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="input-base" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <Video size={13} /> Platform
            </label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className="input-base">
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <User size={13} /> Interviewer
            </label>
            <input type="text" value={interviewer} onChange={e => setInterviewer(e.target.value)} placeholder="e.g. Sarah Chen" className="input-base" />
          </div>
          <div>
            <label className="label-base">Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Preparation notes, topics to cover..." className="input-base resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Interview</button>
          </div>
        </form>
      </div>
    </div>
  )
}