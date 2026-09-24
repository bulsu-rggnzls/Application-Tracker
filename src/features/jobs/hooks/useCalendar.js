import { useState, useMemo } from 'react'
import extractDomain from '@/utils/extractDomain'

function getCategory(stageName, status) {
  const s = (stageName || '').toLowerCase()
  if (s.includes('screen') || s.includes('technical') || s.includes('phone') || s.includes('on-site') || s.includes('final') || s.includes('interview')) return 'interview'
  if (s.includes('follow')) return 'followup'
  if (s.includes('reject') || s.includes('decline')) return 'rejection'
  if (status === 'offer') return 'offer'
  if (status === 'applied') return 'application'
  return 'general'
}

function parseDateKey(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('T')[0].split('-')
  if (parts.length !== 3) return null
  return `${parseInt(parts[0])}-${parseInt(parts[1]) - 1}-${parseInt(parts[2])}`
}

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days = []
  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, i - startPad + 1)
    days.push({ day: d.getDate(), date: d, current: false, key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    days.push({ day: d, date, current: true, key: `${year}-${month}-${d}` })
  }
  let nextDay = 1
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, nextDay++)
    days.push({ day: d.getDate(), date: d, current: false, key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` })
  }
  return days
}

function formatMonth(year, month) {
  return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function startOfWeek(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

export default function useCalendar(applications) {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [view, setView] = useState('month')

  const { events, allEvents } = useMemo(() => {
    const map = {}
    const list = []
    let totalCount = 0
    applications.forEach(app => {
      ;(app.interviews || []).forEach(iv => {
        const key = parseDateKey(iv.date)
        if (!key) return
        const ev = {
          ...iv,
          id: iv.id || `${app.id}-${iv.stageName}-${iv.date}`,
          company: app.company,
          role: app.role,
          domain: extractDomain(app.jobUrl),
          applicationId: app.id,
          type: getCategory(iv.stageName, app.status),
        }
        if (!map[key]) map[key] = []
        map[key].push(ev)
        list.push(ev)
        totalCount++
      })
    })
    map._total = totalCount
    return { events: map, allEvents: list.sort((a, b) => new Date(a.date) - new Date(b.date)) }
  }, [applications])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const grid = getMonthGrid(year, month)

  const stats = useMemo(() => ({
    interviews: applications.filter(a => a.status === 'interviewing').length,
    awaiting: applications.filter(a => a.status === 'applied' || a.status === 'wishlist').length,
    offers: applications.filter(a => a.status === 'offer').length,
  }), [applications])

  const agendaGroups = useMemo(() => {
    const map = {}
    allEvents.forEach(ev => {
      const key = `${ev.date.split('T')[0]}`
      if (!map[key]) map[key] = []
      map[key].push(ev)
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }, [allEvents])

  const handleNav = (dir) => {
    if (view === 'month') {
      setCursor(new Date(year, month + dir, 1))
    } else if (view === 'week') {
      const ws = startOfWeek(cursor)
      ws.setDate(ws.getDate() + dir * 7)
      setCursor(ws)
    } else if (view === 'day') {
      const d = new Date(cursor)
      d.setDate(cursor.getDate() + dir)
      setCursor(d)
    }
  }

  const viewTitle = useMemo(() => {
    if (view === 'month') return formatMonth(year, month)
    if (view === 'week') {
      const ws = startOfWeek(cursor)
      const we = new Date(ws)
      we.setDate(ws.getDate() + 6)
      const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return `${fmt(ws)} – ${fmt(we)}`
    }
    return cursor.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }, [view, year, month, cursor])

  return {
    cursor,
    view,
    setView,
    events,
    allEvents,
    agendaGroups,
    grid,
    stats,
    viewTitle,
    handleNav,
    todayKey,
    todayStart,
    weekStart: startOfWeek(cursor),
    startOfWeek,
  }
}
