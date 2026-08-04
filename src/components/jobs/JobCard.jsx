import { Edit3, Trash2, ExternalLink, MapPin, DollarSign, Clock, Briefcase, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge, Button, Divider, IconButton, Text } from '../ui'
import { getTagStyle } from '../../utils/tagColors'
import CompanyLogo from './CompanyLogo'
import getRelativeTime from '../../utils/getRelativeTime'
import extractDomain from '../../utils/extractDomain'
import formatTime from '../../utils/formatTime'
import formatSalary from '../../utils/formatSalary'

export default function JobCard({ application, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect, provided, snapshot, statusBorder }) {
  const { company, role, location, salary, employmentType, status, dateApplied, tags, jobUrl, id, interviews } = application
  const domain = extractDomain(jobUrl)

  const nextInterview = interviews?.length > 0
    ? [...interviews].sort((a, b) => new Date(a.date) - new Date(b.date)).find(iv => new Date(iv.date) >= new Date())
    : null

  const latestInterview = interviews?.length > 0
    ? [...interviews].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null

  const isOffer = status === 'offer'
  const isInterviewing = status === 'interviewing'
  const borderClass = statusBorder || 'border-slate-200 dark:border-slate-700'

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onSelect?.(application)}
      className={`group bg-white dark:bg-slate-800/60 border-2 ${borderClass} rounded-xl transition-all cursor-pointer ${
        snapshot.isDragging
          ? 'shadow-xl rotate-2 scale-105 !border-indigo-400 ring-2 ring-indigo-400/20 z-50'
          : 'hover:shadow-md hover:border-opacity-100'
      }`}
      whileHover={snapshot.isDragging ? undefined : { scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <div className="p-2.5">
        <div className="flex items-start gap-2 mb-1.5">
          <CompanyLogo domain={domain} company={company} />
          <div className="min-w-0 flex-1">
            <Text variant="body" className="!text-[12px] !font-semibold !text-slate-900 dark:!text-white leading-tight truncate">{company}</Text>
            <Text variant="muted-sm" className="truncate">{role}</Text>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-1.5">
          {location && (
            <Badge variant="meta" className="!text-[11px] !px-1.5 !py-0.5"><MapPin size={9} /> {location}</Badge>
          )}
          {employmentType && (
            <Badge variant="meta" className="!text-[11px] !px-1.5 !py-0.5"><Briefcase size={9} /> {employmentType === 'full-time' ? 'Full-time' : employmentType === 'contract' ? 'Contract' : 'Part-time'}</Badge>
          )}
          {salary && (
            <Badge variant="meta" className="!text-[11px] !px-1.5 !py-0.5"><DollarSign size={9} /> {formatSalary(salary)}</Badge>
          )}
          {dateApplied && (
            <Badge variant="meta" className="!text-[11px] !px-1.5 !py-0.5"><Clock size={9} /> {getRelativeTime(dateApplied)}</Badge>
          )}
        </div>

        {isInterviewing && latestInterview && (
          <div className="mb-1.5 px-2 py-1 bg-purple-50/70 dark:bg-purple-900/15 border border-purple-100/60 dark:border-purple-800/50 rounded">
            <span className="text-[11px] font-medium text-purple-700 dark:text-purple-300">
              {new Date(latestInterview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {formatTime(latestInterview.time)}
            </span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => {
              const s = getTagStyle(tag)
              return (
                <span key={tag} className={`text-[10px] font-medium ${s.bg} ${s.text} ${s.darkBg} ${s.darkText} px-1.5 py-0.5 rounded`}>{tag}</span>
              )
            })}
          </div>
        )}
      </div>

      <Divider />
      <div className="px-2.5 py-1.5 flex items-center justify-between">
        {isOffer ? (
          <div className="flex items-center gap-1.5 w-full">
            <Button variant="accept" className="!text-[11px] !px-2.5 !py-1" onClick={(e) => { e.stopPropagation(); onAcceptOffer(id) }}><Check size={11} /> Accept</Button>
            <Button variant="reject" className="!text-[11px] !px-2.5 !py-1" onClick={(e) => { e.stopPropagation(); onRejectOffer(id) }}><X size={11} /> Reject</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            {isInterviewing && (
              <Text variant="muted-sm" className="!text-[11px] !text-slate-400">{interviews?.length || 0} interview{(interviews?.length || 0) !== 1 ? 's' : ''}</Text>
            )}
            <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isInterviewing ? '' : 'ml-auto'}`}>
              {jobUrl && (
                <IconButton
                  as="a"
                  href={jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="!p-1"
                  title="Open job posting"
                >
                  <ExternalLink size={11} />
                </IconButton>
              )}
              <IconButton color="slate" className="!p-1" onClick={(e) => { e.stopPropagation(); onEdit(application) }}><Edit3 size={11} /></IconButton>
              <IconButton color="rose" className="!p-1" onClick={(e) => { e.stopPropagation(); onDelete(id) }}><Trash2 size={11} /></IconButton>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
