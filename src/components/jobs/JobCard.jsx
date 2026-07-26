import { Edit3, Trash2, ExternalLink, MapPin, DollarSign, Clock, Briefcase, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge, Button, Divider, IconButton, Text } from '../ui'
import { getTagStyle } from '../../utils/tagColors'
import CompanyLogo from './CompanyLogo'
import getRelativeTime from '../../utils/getRelativeTime'
import extractDomain from '../../utils/extractDomain'
import formatSalary from '../../utils/formatSalary'

export default function JobCard({ application, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect, provided, snapshot, statusBorder }) {
  const { company, role, location, salary, employmentType, status, dateApplied, tags, jobUrl, id, interviews } = application
  const domain = extractDomain(jobUrl)

  const nextInterview = interviews?.length > 0
    ? [...interviews].sort((a, b) => new Date(a.date) - new Date(b.date)).find(iv => new Date(iv.date) >= new Date())
    : null

  const isOffer = status === 'offer'
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
      <div className="p-3.5">
        <div className="flex items-start gap-3 mb-2.5">
          <CompanyLogo domain={domain} company={company} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight truncate">{company}</p>
            <Text variant="subtle" className="truncate">{role}</Text>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {location && (
            <Badge variant="meta"><MapPin size={10} /> {location}</Badge>
          )}
          {employmentType && (
            <Badge variant="meta"><Briefcase size={10} /> {employmentType === 'full-time' ? 'Full-time' : employmentType === 'contract' ? 'Contract' : 'Part-time'}</Badge>
          )}
          {salary && (
            <Badge variant="meta"><DollarSign size={10} /> {formatSalary(salary)}</Badge>
          )}
          {dateApplied && (
            <Badge variant="meta"><Clock size={10} /> {getRelativeTime(dateApplied)}</Badge>
          )}
        </div>

        {nextInterview && (
          <div className="mb-2.5 px-2.5 py-1.5 bg-purple-50/70 dark:bg-purple-900/15 border border-purple-100/60 dark:border-purple-800/50 rounded-lg">
            <Text variant="subtle-sm" className="!text-purple-700 dark:!text-purple-300 !font-medium">
              {new Date(nextInterview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {nextInterview.time}
            </Text>
            <Text variant="muted-sm" className="!text-purple-500 dark:!text-purple-400">{nextInterview.interviewer ? `with ${nextInterview.interviewer}` : ''}{nextInterview.platform ? ` · ${nextInterview.platform}` : ''}</Text>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => {
              const s = getTagStyle(tag)
              return (
                <span key={tag} className={`text-xs font-medium ${s.bg} ${s.text} ${s.darkBg} ${s.darkText} px-2 py-0.5 rounded-md`}>{tag}</span>
              )
            })}
          </div>
        )}
      </div>

      <Divider />
      <div className="px-3.5 py-2 flex items-center justify-between">
        {isOffer ? (
          <div className="flex items-center gap-2 w-full">
            <Button variant="accept" onClick={(e) => { e.stopPropagation(); onAcceptOffer(id) }}><Check size={12} /> Accept</Button>
            <Button variant="reject" onClick={(e) => { e.stopPropagation(); onRejectOffer(id) }}><X size={12} /> Reject</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Text variant="muted">{interviews?.length || 0} interview{(interviews?.length || 0) !== 1 ? 's' : ''}</Text>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {jobUrl && (
                <a href={jobUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <ExternalLink size={12} />
                </a>
              )}
              <IconButton color="slate" onClick={(e) => { e.stopPropagation(); onEdit(application) }}><Edit3 size={12} /></IconButton>
              <IconButton color="rose" onClick={(e) => { e.stopPropagation(); onDelete(id) }}><Trash2 size={12} /></IconButton>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
