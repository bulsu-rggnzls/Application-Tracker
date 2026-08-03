import { X, ExternalLink, Calendar, MapPin, DollarSign, Briefcase, Clock, User, Video, Check, Pencil, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Markdown from 'react-markdown'
import { Avatar, Button, Heading, IconButton, Text, Badge } from '../ui'
import { getTagStyle } from '../../utils/tagColors'
import CompanyLogo from './CompanyLogo'
import extractDomain from '../../utils/extractDomain'
import getRelativeTime from '../../utils/getRelativeTime'
import formatSalary from '../../utils/formatSalary'

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

export default function JobDetailDrawer({ job, isOpen, onClose, onEdit, onDelete, onStatusChange }) {
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

  function handleStageClick(stageId) {
    if (stageId === job.status) return
    onStatusChange?.(job.id, stageId)
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
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <Heading size="md">Job Details</Heading>
                  <IconButton type="button" onClick={onClose} aria-label="Close"><X size={20} /></IconButton>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <Avatar size="lg" className="p-2">
                    <CompanyLogo domain={domain} company={job.company} />
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <Text variant="body" className="!font-semibold !text-slate-900 dark:!text-white truncate">{job.company}</Text>
                    <Text variant="subtle" className="truncate">{job.role}</Text>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
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

                <div className="mb-6">
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
                  <div className="mb-6">
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
                  <div className="mb-6">
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

                {job.tags.length > 0 && (
                  <div className="mb-6">
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

                <div className="mb-6">
                  <Heading size="xs" className="mb-2.5">Notes</Heading>
                  <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/40 rounded-xl p-4 min-h-[80px] text-sm text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none">
                    {job.notes ? <Markdown>{job.notes}</Markdown> : <Text variant="muted" className="italic">No notes added yet.</Text>}
                  </div>
                </div>

                {activityLog.length > 0 && (
                  <div className="mb-4">
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
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900 shrink-0">
              <div className="flex gap-2">
                {job.jobUrl && (
                  <Button
                    as="a"
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="indigo"
                    className="flex-1"
                  >
                    <ExternalLink size={15} /> View Original Job Post
                  </Button>
                )}
                <Button variant="indigo-outline" onClick={() => { onEdit(job); onClose() }}><Pencil size={14} /> Edit</Button>
                <Button variant="destructive" onClick={() => { onDelete(job.id); onClose() }}><Trash2 size={14} /> Delete</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
