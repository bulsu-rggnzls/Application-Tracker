import { v4 as uuidv4 } from 'uuid'

export default function logActivity(job, action, details) {
  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    action,
    details,
  }
  return {
    ...job,
    activityLog: [...(job.activityLog || []), entry],
  }
}
