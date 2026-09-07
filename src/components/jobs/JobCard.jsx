import { Edit3, Trash2, ExternalLink, Clock, Check, X, Star, BellRing, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, IconButton, Text } from '../ui'
import { getTagStyle } from '../../utils/tagColors'
import CompanyLogo from './CompanyLogo'
import getRelativeTime from '../../utils/getRelativeTime'
import extractDomain from '../../utils/extractDomain'
import formatTime from '../../utils/formatTime'
import formatSalary from '../../utils/formatSalary'

const STATUS_OPTIONS = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
]

const STATUS_CHIP = {
  wishlist: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/60',
  applied: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/60',
  interviewing: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/60',
  offer: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/60',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/60',
}

const COLUMN_DOT = {
  wishlist: <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />,
  applied: <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />,
  interviewing: <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />,
  offer: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />,
  rejected: <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />,
}

const STATUS_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

export default function JobCard({ application, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect, onStatusChange, onMoveTap, provided, snapshot, statusBorder, compact = false, mobile = false }) {
  const { company, role, location, salary, status, dateApplied, tags, jobUrl, id, interviews } = application
  const domain = extractDomain(jobUrl)

  const latestInterview = interviews?.length > 0
    ? [...interviews].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null

  const isOffer = status === 'offer'
  const isInterviewing = status === 'interviewing'
  const borderClass = statusBorder || 'border-slate-200 dark:border-slate-700'

  const isStaleApplied = status === 'applied' && !!dateApplied &&
    (Date.now() - new Date(dateApplied).getTime()) > 10 * 24 * 60 * 60 * 1000

  if (compact) {
    return (
      <motion.div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => onSelect?.(application)}
        className={`group bg-white dark:bg-slate-800/60 border ${borderClass} rounded-lg transition-all cursor-pointer ${
          snapshot.isDragging
            ? 'shadow-xl rotate-2 !border-indigo-400 ring-2 ring-indigo-400/20 z-50'
            : 'hover:shadow-md'
        }`}
      >
        <div className="px-2 py-1.5 flex items-center gap-2">
          <CompanyLogo domain={domain} company={company} />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-semibold text-slate-900 dark:text-white truncate">{company}</span>
              {application.starred && <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />}
              {isStaleApplied && <BellRing size={10} className="text-amber-500 shrink-0" />}
            </div>
            <span className="block text-[10.5px] text-slate-500 dark:text-slate-400 truncate">{role}</span>
          </div>
          {salary && (
            <span className="shrink-0 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {formatSalary(salary)?.split(' ')[0]}
            </span>
          )}
          {isInterviewing && latestInterview && (
            <span className="shrink-0 text-[10px] font-medium text-purple-600 dark:text-purple-300">
              {new Date(latestInterview.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
            </span>
          )}
          {isOffer && (
            <div className="flex shrink-0 gap-1">
              <Button variant="accept" className="!text-[10px] !px-1.5 !py-0.5" onClick={(e) => { e.stopPropagation(); onAcceptOffer(id) }}><Check size={9} /></Button>
              <Button variant="reject" className="!text-[10px] !px-1.5 !py-0.5" onClick={(e) => { e.stopPropagation(); onRejectOffer(id) }}><X size={9} /></Button>
            </div>
          )}
          <div className="hidden group-hover:flex shrink-0 gap-0.5">
            {jobUrl && (
              <IconButton as="a" href={jobUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="!p-0.5" title="Open job posting">
                <ExternalLink size={10} />
              </IconButton>
            )}
            <IconButton color="slate" className="!p-0.5" onClick={(e) => { e.stopPropagation(); onEdit(application) }}><Edit3 size={10} /></IconButton>
            <IconButton color="rose" className="!p-0.5" onClick={(e) => { e.stopPropagation(); onDelete(id) }}><Trash2 size={10} /></IconButton>
          </div>
        </div>
      </motion.div>
    )
  }

  if (mobile) {
    return (
      <div
        onClick={() => onSelect?.(application)}
        className="relative bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer active:scale-[0.985] transition-transform"
      >
        <div className="px-3 py-2.5">
          <div className="flex items-start gap-2.5 min-w-0">
            <CompanyLogo domain={domain} company={company} size="sm" />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1.5">
                <Text variant="body" className="!text-[14px] !font-semibold !text-slate-900 dark:!text-white truncate">{company}</Text>
                {application.starred && <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />}
                {isStaleApplied && <BellRing size={11} className="text-amber-500 shrink-0" />}
              </div>
              <Text variant="muted-sm" className="!text-[12px] truncate">{role}</Text>
              <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-slate-400 dark:text-slate-500 min-w-0 flex-wrap">
                {salary && <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">{formatSalary(salary)}</span>}
                {location && <span className="truncate max-w-[140px] min-w-0">{formatSalary(salary) ? '·' : ''} {location}</span>}
                {dateApplied && <span className="shrink-0">{formatSalary(salary) || location ? '·' : ''} {getRelativeTime(dateApplied)}</span>}
                {isInterviewing && (interviews?.length || 0) > 0 && (
                  <span className="shrink-0">· {interviews.length} int{interviews.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            {isOffer && (
              <div className="flex flex-col gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                <Button variant="accept" className="!text-[10px] !px-2 !py-1" onClick={() => onAcceptOffer(id)}><Check size={9} /> Accept</Button>
                <Button variant="reject" className="!text-[10px] !px-2 !py-1" onClick={() => onRejectOffer(id)}><X size={9} /> Reject</Button>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1.5 flex-wrap min-w-0" onClick={e => e.stopPropagation()}>
            {mobile && onStatusChange && (
              <button
                type="button"
                onClick={() => onMoveTap?.(application)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-transform active:scale-95 cursor-pointer max-w-full ${STATUS_CHIP[status] || STATUS_CHIP.wishlist}`}
              >
                {COLUMN_DOT[status]}
                <span className="truncate">{STATUS_LABELS[status] || status}</span>
                <ChevronDown size={11} className="opacity-60 shrink-0" />
              </button>
            )}
            {isStaleApplied && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/70 dark:border-amber-700/50 rounded-full text-[10px] font-semibold text-amber-700 dark:text-amber-400 shrink-0">
                <BellRing size={9} /> Follow up
              </span>
            )}
            {isInterviewing && latestInterview && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-violet-50/70 dark:bg-violet-900/15 border border-violet-100/60 dark:border-violet-800/50 rounded-full text-[10px] font-medium text-violet-700 dark:text-violet-300 shrink-0">
                <Clock size={9} />
                {new Date(latestInterview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {formatTime(latestInterview.time)}
              </span>
            )}
            {tags.slice(0, 2).map(tag => {
              const s = getTagStyle(tag)
              return (
                <span key={tag} className={`text-[9.5px] font-medium ${s.bg} ${s.text} ${s.darkBg} ${s.darkText} px-1.5 py-0.5 rounded-full truncate max-w-[100px] min-w-0`}>{tag}</span>
              )
            })}
            {tags.length > 2 && (
              <span className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500 shrink-0">+{tags.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      onClick={() => onSelect?.(application)}
      className={`group relative bg-white dark:bg-slate-800/60 border ${borderClass} rounded-lg transition-all cursor-pointer ${
        snapshot?.isDragging
          ? 'shadow-xl rotate-2 !border-indigo-400 ring-2 ring-indigo-400/20 z-50'
          : 'hover:shadow-md'
      }`}
      whileHover={snapshot?.isDragging ? undefined : { y: -1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
        {jobUrl && (
          <IconButton
            as="a"
            href={jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="!p-1 !bg-white/90 dark:!bg-slate-900/90 !shadow-sm !rounded-md"
            title="Open job posting"
          >
            <ExternalLink size={10} />
          </IconButton>
        )}
        <IconButton color="slate" className="!p-1 !bg-white/90 dark:!bg-slate-900/90 !shadow-sm !rounded-md" onClick={(e) => { e.stopPropagation(); onEdit(application) }}><Edit3 size={10} /></IconButton>
        <IconButton color="rose" className="!p-1 !bg-white/90 dark:!bg-slate-900/90 !shadow-sm !rounded-md" onClick={(e) => { e.stopPropagation(); onDelete(id) }}><Trash2 size={10} /></IconButton>
      </div>

      <div className="px-2 py-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <CompanyLogo domain={domain} company={company} size="sm" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1">
              <Text variant="body" className="!text-[12px] !font-semibold !text-slate-900 dark:!text-white truncate">{company}</Text>
              {application.starred && <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />}
            </div>
            <Text variant="muted-sm" className="!text-[10.5px] truncate">{role}</Text>
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 min-w-0">
          {salary && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">{formatSalary(salary)}</span>
          )}
          {location && <span className="truncate">{salary ? '·' : ''} {location}</span>}
          {dateApplied && <span className="shrink-0">· {getRelativeTime(dateApplied)}</span>}
          {isInterviewing && (interviews?.length || 0) > 0 && (
            <span className="shrink-0">· {interviews.length} int{interviews.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {(isStaleApplied || (isInterviewing && latestInterview)) && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {isStaleApplied && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/70 dark:border-amber-700/50 rounded text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                <BellRing size={9} /> Follow up
              </span>
            )}
            {isInterviewing && latestInterview && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-50/70 dark:bg-purple-900/15 border border-purple-100/60 dark:border-purple-800/50 rounded text-[10px] font-medium text-purple-700 dark:text-purple-300">
                <Clock size={9} />
                {new Date(latestInterview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {formatTime(latestInterview.time)}
              </span>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.slice(0, 3).map(tag => {
              const s = getTagStyle(tag)
              return (
                <span key={tag} className={`text-[9.5px] font-medium ${s.bg} ${s.text} ${s.darkBg} ${s.darkText} px-1.5 py-0.5 rounded`}>{tag}</span>
              )
            })}
            {tags.length > 3 && (
              <span className="text-[9.5px] font-medium text-slate-400 dark:text-slate-500 px-1 py-0.5">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {isOffer && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Button variant="accept" className="!text-[10px] !px-2 !py-0.5" onClick={(e) => { e.stopPropagation(); onAcceptOffer(id) }}><Check size={10} /> Accept</Button>
            <Button variant="reject" className="!text-[10px] !px-2 !py-0.5" onClick={(e) => { e.stopPropagation(); onRejectOffer(id) }}><X size={10} /> Reject</Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
