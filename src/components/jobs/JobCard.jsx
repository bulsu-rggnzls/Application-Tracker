import { Edit3, Trash2, ExternalLink, Clock, Check, X, Star, BellRing } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, IconButton, Text } from '../ui'
import { getTagStyle } from '../../utils/tagColors'
import CompanyLogo from './CompanyLogo'
import getRelativeTime from '../../utils/getRelativeTime'
import extractDomain from '../../utils/extractDomain'
import formatTime from '../../utils/formatTime'
import formatSalary from '../../utils/formatSalary'

export default function JobCard({ application, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect, provided, snapshot, statusBorder, compact = false }) {
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

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onSelect?.(application)}
      className={`group relative bg-white dark:bg-slate-800/60 border ${borderClass} rounded-lg transition-all cursor-pointer ${
        snapshot.isDragging
          ? 'shadow-xl rotate-2 !border-indigo-400 ring-2 ring-indigo-400/20 z-50'
          : 'hover:shadow-md'
      }`}
      whileHover={snapshot.isDragging ? undefined : { y: -1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
