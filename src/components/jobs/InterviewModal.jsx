import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Video } from 'lucide-react'
import { Button, IconButton, Heading, Text, Input } from '../ui'

export default function InterviewModal({ isOpen, onClose, onConfirm, job }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [platform, setPlatform] = useState('')
  const [interviewer, setInterviewer] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (isOpen) {
      setDate('')
      setTime('')
      setPlatform('')
      setInterviewer('')
      setNotes('')
    }
  }, [isOpen, job?.id])

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
            <Heading size="md">Schedule Interview</Heading>
            <Text variant="subtle" className="mt-0.5">{job.company} — {job.role}</Text>
          </div>
          <IconButton type="button" onClick={onClose} aria-label="Close"><X size={18} /></IconButton>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <Calendar size={13} /> Date *
              </label>
              <Input containerClassName="relative w-full" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <Clock size={13} /> Time *
              </label>
              <Input containerClassName="relative w-full" type="time" value={time} onChange={e => setTime(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <Video size={13} /> Platform
            </label>
            <Input containerClassName="relative w-full" type="text" value={platform} onChange={e => setPlatform(e.target.value)} placeholder="Zoom, Google Meet, etc." />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <User size={13} /> Interviewer
            </label>
            <Input containerClassName="relative w-full" type="text" value={interviewer} onChange={e => setInterviewer(e.target.value)} placeholder="e.g. Sarah Chen" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Preparation notes, topics to cover..." className="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="indigo">Add Interview</Button>
          </div>
        </form>
      </div>
    </div>
  )
}