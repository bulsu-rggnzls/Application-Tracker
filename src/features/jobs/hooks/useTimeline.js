import { useMemo, useState } from 'react'
import extractDomain from '@/utils/extractDomain'
import getRelativeTime from '@/utils/getRelativeTime'

function getFilterGroup(entry) {
  if (entry.action === 'interview_scheduled' || entry.action === 'interview_completed') return 'interviews'
  if (entry.action === 'offer_accepted' || entry.action === 'offer_rejected') return 'offers'
  if (entry.action === 'status_change' && /offer|reject|decline/i.test(entry.details || '')) return 'offers'
  return 'updates'
}

function dayKey(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function dayLabel(ts) {
  const d = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((today - that) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return getRelativeTime(ts)
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export function classifyStatusChange(details = '') {
  const d = details.toLowerCase()
  if (d.includes('offer')) return { kind: 'offer', label: 'Offer' }
  if (d.includes('reject') || d.includes('decline')) return { kind: 'rejected', label: 'Rejected' }
  if (d.includes('applied')) return { kind: 'applied', label: 'Applied' }
  if (d.includes('moved') || d.includes('→')) return { kind: 'update', label: 'Update' }
  return { kind: 'update', label: 'Update' }
}

export function getConfig(entry) {
  if (entry.action === 'status_change') return classifyStatusChange(entry.details)
  const LABELS = {
    interview_scheduled: 'Interview',
    interview_completed: 'Completed',
    offer_accepted: 'Offer Accepted',
    offer_rejected: 'Offer Declined',
    note_added: 'Note',
  }
  return { kind: entry.action, label: LABELS[entry.action] || 'Update' }
}

export function parseStatusTransition(details) {
  const match = details.match(/Moved from (\w+) to (\w+)/i)
  if (match) return { from: match[1], to: match[2] }
  const match2 = details.match(/Moved to (\w+)/i)
  if (match2) return { to: match2[1] }
  return null
}

export default function useTimeline(applications) {
  const [visibleCount, setVisibleCount] = useState(15)
  const [filter, setFilter] = useState('all')

  const entries = useMemo(() => {
    const all = []
    applications.forEach(app => {
      ;(app.activityLog || []).forEach(log => {
        all.push({
          ...log,
          company: app.company,
          role: app.role,
          domain: extractDomain(app.jobUrl),
          jobUrl: app.jobUrl,
          applicationId: app.id,
        })
      })
    })
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [applications])

  const filteredEntries = useMemo(() => {
    if (filter === 'all') return entries
    return entries.filter(e => getFilterGroup(e) === filter)
  }, [entries, filter])

  const filterCounts = useMemo(() => {
    return {
      all: entries.length,
      interviews: entries.filter(e => getFilterGroup(e) === 'interviews').length,
      offers: entries.filter(e => getFilterGroup(e) === 'offers').length,
      updates: entries.filter(e => getFilterGroup(e) === 'updates').length,
    }
  }, [entries])

  const groups = useMemo(() => {
    const result = []
    filteredEntries.slice(0, visibleCount).forEach(entry => {
      const key = dayKey(entry.timestamp)
      const last = result[result.length - 1]
      if (last && last.key === key) last.items.push(entry)
      else result.push({ key, label: dayLabel(entry.timestamp), items: [entry] })
    })
    return result
  }, [filteredEntries, visibleCount])

  const selectFilter = (id) => {
    setFilter(id)
    setVisibleCount(15)
  }

  const loadMore = () => setVisibleCount(prev => prev + 20)

  return {
    filter,
    selectFilter,
    entries,
    filteredEntries,
    filterCounts,
    groups,
    visibleCount,
    loadMore,
    getFilterGroup,
    getConfig,
    parseStatusTransition,
  }
}
