import { Edit3, Trash2, ExternalLink, MapPin, DollarSign, Clock, Briefcase, Check, X } from 'lucide-react'
import CompanyLogo from './CompanyLogo'
import getRelativeTime from '../utils/getRelativeTime'
import extractDomain from '../utils/extractDomain'

export default function JobCard({ application, onEdit, onDelete, onAcceptOffer, onRejectOffer, onSelect, provided, snapshot }) {
  const { company, role, location, salary, employmentType, status, dateApplied, tags, jobUrl, id, interviews } = application
  const domain = extractDomain(jobUrl)

  const nextInterview = interviews?.length > 0
    ? [...interviews].sort((a, b) => new Date(a.date) - new Date(b.date)).find(iv => new Date(iv.date) >= new Date())
    : null

  const isOffer = status === 'offer'

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onSelect?.(application)}
      className={`group bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer ${
        snapshot.isDragging
          ? 'shadow-xl rotate-2 scale-105 border-indigo-400 ring-2 ring-indigo-400/20 z-50'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="p-3">
        <div className="flex items-start gap-2.5 mb-2">
          <CompanyLogo domain={domain} company={company} />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-slate-900 dark:text-white text-sm leading-tight truncate">{company}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{role}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {location && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-700/40 px-1.5 py-0.5 rounded">
              <MapPin size={9} /> {location}
            </span>
          )}
          {employmentType && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-700/40 px-1.5 py-0.5 rounded">
              <Briefcase size={9} /> {employmentType === 'full-time' ? 'Full-time' : employmentType === 'contract' ? 'Contract' : 'Part-time'}
            </span>
          )}
          {salary && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-700/40 px-1.5 py-0.5 rounded">
              <DollarSign size={9} /> {salary}
            </span>
          )}
          {dateApplied && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-700/40 px-1.5 py-0.5 rounded">
              <Clock size={9} /> {getRelativeTime(dateApplied)}
            </span>
          )}
        </div>

        {nextInterview && (
          <div className="mb-2 px-2 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded">
            <p className="text-[11px] font-medium text-purple-700 dark:text-purple-300">
              {new Date(nextInterview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {nextInterview.time}
            </p>
            <p className="text-[10px] text-purple-500 dark:text-purple-400">{nextInterview.interviewer ? `with ${nextInterview.interviewer}` : ''}{nextInterview.platform ? ` · ${nextInterview.platform}` : ''}</p>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40 px-1.5 py-0.5 rounded font-medium">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className={`border-t border-slate-100 dark:border-slate-700 ${isOffer ? '' : ''} px-3 py-2 flex items-center justify-between`}>
        {isOffer ? (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={(e) => { e.stopPropagation(); onAcceptOffer(id) }}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-[11px] font-medium rounded hover:bg-emerald-700 transition-colors cursor-pointer flex-1 justify-center"
            >
              <Check size={11} /> Accept
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRejectOffer(id) }}
              className="flex items-center gap-1 px-3 py-1 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-[11px] font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex-1 justify-center"
            >
              <X size={11} /> Reject
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{interviews?.length || 0} interview{(interviews?.length || 0) !== 1 ? 's' : ''}</span>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {jobUrl && (
                <a href={jobUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <ExternalLink size={11} />
                </a>
              )}
              <button onClick={(e) => { e.stopPropagation(); onEdit(application) }} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                <Edit3 size={11} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(id) }} className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}