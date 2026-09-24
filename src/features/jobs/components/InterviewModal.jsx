import { Calendar, Clock, User, Video, X } from 'lucide-react'
import { Button, Heading, IconButton, Input, Text } from '@/components/ui'
import useInterviewForm from '../hooks/useInterviewForm'
import { layout } from '@/lib/layout'

export default function InterviewModal({ isOpen, onClose, onConfirm, job }) {
  const { form, update, handleSubmit } = useInterviewForm({ isOpen, job, onConfirm })

  if (!isOpen || !job) return null

  return (
    <div className="modal-overlay backdrop-blur-sm" onClick={onClose}>
      <div className="modal-shell w-full max-w-md mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className={layout.modalHeader}>
          <div>
            <Heading size="md">Schedule Interview</Heading>
            <Text variant="subtle" className="mt-0.5">{job.company} — {job.role}</Text>
          </div>
          <IconButton type="button" onClick={onClose} aria-label="Close"><X size={18} /></IconButton>
        </div>
        <form onSubmit={handleSubmit} className={layout.modalBody}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <Calendar size={13} /> Date *
              </label>
              <Input containerClassName="relative w-full" type="date" value={form.date} onChange={update('date')} required />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <Clock size={13} /> Time *
              </label>
              <Input containerClassName="relative w-full" type="time" value={form.time} onChange={update('time')} required />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <Video size={13} /> Platform
            </label>
            <Input containerClassName="relative w-full" type="text" value={form.platform} onChange={update('platform')} placeholder="Zoom, Google Meet, etc." />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <User size={13} /> Interviewer
            </label>
            <Input containerClassName="relative w-full" type="text" value={form.interviewer} onChange={update('interviewer')} placeholder="e.g. Sarah Chen" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Notes</label>
            <textarea rows={2} value={form.notes} onChange={update('notes')} placeholder="Preparation notes, topics to cover..." className="w-full px-3 py-2 text-sm text-text-secondary bg-surface border border-border rounded-lg placeholder:text-text-subtle focus-ring focus:border-brand transition-ui resize-none" />
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