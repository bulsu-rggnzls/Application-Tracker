import { Calendar, Clock, User, Video, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Heading, IconButton, Input, Text } from '@/components/ui'
import useInterviewForm from '../hooks/useInterviewForm'
import { layout } from '@/lib/layout'

export default function InterviewModal({ isOpen, onClose, onConfirm, job }) {
  const { form, update, handleSubmit } = useInterviewForm({ isOpen, job, onConfirm })

  return (
    <AnimatePresence>
      {isOpen && job && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
            className="relative z-10 w-full max-w-md bg-surface border border-border flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
