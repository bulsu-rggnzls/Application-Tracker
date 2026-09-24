import { useState, useMemo } from 'react'

function parseInterviewDate(iv) {
  if (!iv.date) return null
  const d = new Date(iv.date)
  if (isNaN(d.getTime())) return null
  if (iv.time && !iv.date.includes('T')) {
    const [h, m] = iv.time.split(':').map(Number)
    if (!isNaN(h) && !isNaN(m)) d.setHours(h, m, 0, 0)
  }
  return d
}

function getUpcomingInterviews(applications, hours = 24) {
  const now = Date.now()
  const limit = now + hours * 3600 * 1000
  const list = []
  applications.forEach(app => {
    ;(app.interviews || []).forEach(iv => {
      const datetime = parseInterviewDate(iv)
      if (!datetime) return
      const ts = datetime.getTime()
      if (ts > now && ts <= limit) {
        list.push({ ...iv, company: app.company, role: app.role, datetime })
      }
    })
  })
  return list.sort((a, b) => a.datetime - b.datetime)
}

export function formatTimeLeft(dt) {
  const mins = Math.max(0, Math.round((dt.getTime() - Date.now()) / 60000))
  if (mins < 60) return `${mins}m left`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  if (hrs < 24) return remMins ? `${hrs}h ${remMins}m left` : `${hrs}h left`
  return `${Math.floor(hrs / 24)}d left`
}

export default function useUpcomingInterviews(applications) {
  const [notifOpen, setNotifOpen] = useState(false)

  const upcoming = useMemo(
    () => getUpcomingInterviews(applications || []),
    [applications]
  )

  const toggleNotif = () => setNotifOpen(prev => !prev)
  const closeNotif = () => setNotifOpen(false)

  return { notifOpen, toggleNotif, closeNotif, upcoming, formatTimeLeft }
}
