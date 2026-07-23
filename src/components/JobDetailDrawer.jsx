import { X, ExternalLink, Calendar, MapPin, DollarSign, Briefcase, Clock, User, Video } from 'lucide-react'
import Markdown from 'react-markdown'
import CompanyLogo from './CompanyLogo'
import extractDomain from '../utils/extractDomain'
import getRelativeTime from '../utils/getRelativeTime'

const stages = ['Wishlist', 'Applied', 'Interviewing', 'Offer']
const stageIndex = { wishlist: 0, applied: 1, interviewing: 2, offer: 3, rejected: 3 }

export default function JobDetailDrawer({ job, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !job) return null

  const domain = extractDomain(job.jobUrl)
  const currentIdx = stageIndex[job.status] ?? 0
  const isRejected = job.status === 'rejected'
  const interviews = job.interviews || []
  const activityLog = job.activityLog || []

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Job Details</h2>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <CompanyLogo domain={domain} company={job.company} />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{job.company}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{job.role}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {job.location && <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md"><MapPin size={13} /> {job.location}</span>}
            {job.employmentType && <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md"><Briefcase size={13} /> {job.employmentType === 'full-time' ? 'Full-time' : job.employmentType === 'contract' ? 'Contract' : 'Part-time'}</span>}
            {job.salary && <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md"><DollarSign size={13} /> {job.salary}</span>}
            {job.dateApplied && <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md"><Calendar size={13} /> {getRelativeTime(job.dateApplied)}</span>}
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Progress</h4>
            <div className="relative pl-6">
              <div className="absolute left-2 top-1 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
              {stages.map((stage, i) => {
                const isComplete = i < currentIdx
                const isCurrent = i === currentIdx
                const isPastRejected = isRejected && i === currentIdx
                let dotColor = 'bg-slate-300 dark:bg-slate-600'
                let textColor = 'text-slate-400 dark:text-slate-500'
                if (isComplete) { dotColor = 'bg-emerald-500'; textColor = 'text-slate-900 dark:text-white' }
                if (isCurrent) { dotColor = isPastRejected ? 'bg-rose-500' : 'bg-indigo-500'; textColor = 'text-slate-900 dark:text-white' }
                return (
                  <div key={stage} className="relative pb-5 last:pb-0">
                    <div className={`absolute -left-[18px] top-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${dotColor}`} />
                    <p className={`text-sm font-medium ${textColor}`}>{stage}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {interviews.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Interviews ({interviews.length})
              </h4>
              <div className="space-y-2.5">
                {interviews.map((iv, i) => (
                  <div key={iv.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Round {i + 1}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {iv.time && <span className="inline-flex items-center gap-1"><Clock size={11} /> {iv.time}</span>}
                      {iv.platform && <span className="inline-flex items-center gap-1"><Video size={11} /> {iv.platform}</span>}
                      {iv.interviewer && <span className="inline-flex items-center gap-1"><User size={11} /> {iv.interviewer}</span>}
                    </div>
                    {iv.notes && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 italic">{iv.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {job.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map(tag => <span key={tag} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">{tag}</span>)}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Notes</h4>
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 min-h-[80px] text-sm text-slate-600 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none">
              {job.notes ? <Markdown>{job.notes}</Markdown> : <p className="text-slate-400 dark:text-slate-500 italic">No notes added yet.</p>}
            </div>
          </div>

          {activityLog.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Activity</h4>
              <div className="space-y-2">
                {activityLog.map(log => (
                  <div key={log.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">{getRelativeTime(log.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            {job.jobUrl && (
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <ExternalLink size={15} /> View Job
              </a>
            )}
            <button onClick={() => { onEdit(job); onClose() }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              Edit
            </button>
            <button onClick={() => { onDelete(job.id); onClose() }} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  )
}