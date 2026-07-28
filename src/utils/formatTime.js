export default function formatTime(timeStr) {
  if (!timeStr) return ''
  const [hours, minutes] = timeStr.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) return timeStr
  const period = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return `${h12}:${String(minutes).padStart(2, '0')} ${period}`
}