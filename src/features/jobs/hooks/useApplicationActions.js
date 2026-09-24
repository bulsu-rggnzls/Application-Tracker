import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import confetti from 'canvas-confetti'
import logActivity from '@/utils/logActivity'

const OFFER_CONFETTI = {
  particleCount: 80,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#10b981', '#34d399', '#059669', '#fbbf24', '#f59e0b'],
}

export default function useApplicationActions({ applications, setApplications, persist, deleteJob }) {
  const [detailJob, setDetailJob] = useState(null)
  const [pendingInterview, setPendingInterview] = useState(null)

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return
    const { draggableId, source, destination } = result

    if (destination.droppableId === 'interviewing') {
      setApplications(prev => prev.map(app => {
        if (app.id !== draggableId) return app
        const updated = logActivity({ ...app, status: 'interviewing' }, 'status_change', `Moved to interviewing`)
        persist(updated)
        return updated
      }))
      setPendingInterview({ jobId: draggableId, sourceStatus: source.droppableId })
    } else {
      if (destination.droppableId === 'offer') {
        confetti(OFFER_CONFETTI)
      }
      setApplications(prev => prev.map(app => {
        if (app.id !== draggableId) return app
        const from = app.status
        if (from === destination.droppableId) return app
        const updated = logActivity({ ...app, status: destination.droppableId }, 'status_change', `Moved from ${from} to ${destination.droppableId}`)
        persist(updated)
        return updated
      }))
    }
  }, [persist, setApplications])

  const handleInterviewConfirm = useCallback((jobId, interviewData) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== jobId) return app
      const updated = logActivity({
        ...app,
        interviews: [...(app.interviews || []), { id: uuidv4(), ...interviewData }],
      }, 'interview_scheduled', `Interview scheduled${interviewData.interviewer ? ` with ${interviewData.interviewer}` : ''}${interviewData.platform ? ` via ${interviewData.platform}` : ''}`)
      persist(updated)
      return updated
    }))
    setPendingInterview(null)
  }, [persist, setApplications])

  const handleInterviewCancel = useCallback(() => {
    if (!pendingInterview) return
    setApplications(prev => prev.map(app =>
      app.id === pendingInterview.jobId ? { ...app, status: pendingInterview.sourceStatus } : app
    ))
    setPendingInterview(null)
  }, [pendingInterview, setApplications])

  const handleSave = useCallback((job) => {
    setApplications(prev => {
      const exists = prev.find(a => a.id === job.id)
      if (exists) {
        persist(job)
        return prev.map(a => a.id === job.id ? job : a)
      }
      const newJob = logActivity(job, 'status_change', `Added ${job.company} — ${job.role}`)
      persist(newJob)
      return [...prev, newJob]
    })
  }, [persist, setApplications])

  const handleAcceptOffer = useCallback((id) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app
      const updated = logActivity(app, 'offer_accepted', `Offer accepted at ${app.company}`)
      persist(updated)
      return updated
    }))
  }, [persist, setApplications])

  const handleRejectOffer = useCallback((id) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app
      const updated = logActivity({ ...app, status: 'rejected' }, 'offer_rejected', `Offer rejected at ${app.company}`)
      persist(updated)
      return updated
    }))
  }, [persist, setApplications])

  const handleStatusChange = useCallback((id, newStatus, fromStatus) => {
    if (newStatus === 'interviewing' && fromStatus !== 'interviewing') {
      const app = applications.find(a => a.id === id)
      setPendingInterview({ jobId: id, sourceStatus: fromStatus || app?.status || 'wishlist' })
      setApplications(prev => prev.map(a => {
        if (a.id !== id) return a
        const updated = logActivity({ ...a, status: 'interviewing' }, 'status_change', `Moved to interviewing`)
        persist(updated)
        return updated
      }))
      return
    }
    if (newStatus === 'offer' && fromStatus !== 'offer') {
      confetti(OFFER_CONFETTI)
    }
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app
      if (app.status === newStatus) return app
      const updated = logActivity({ ...app, status: newStatus }, 'status_change', `Moved from ${app.status} to ${newStatus}`)
      persist(updated)
      return updated
    }))
    setDetailJob(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev)
  }, [persist, applications, setApplications])

  const handleUpdateJob = useCallback((updates) => {
    setApplications(prev => prev.map(app => app.id === updates.id ? { ...app, ...updates } : app))
    setDetailJob(prev => prev && prev.id === updates.id ? { ...prev, ...updates } : prev)
  }, [setApplications])

  const pendingJob = pendingInterview ? applications.find(a => a.id === pendingInterview.jobId) : null

  return {
    detailJob,
    setDetailJob,
    pendingInterview,
    pendingJob,
    handleDragEnd,
    handleInterviewConfirm,
    handleInterviewCancel,
    handleSave,
    handleDelete: deleteJob,
    handleAcceptOffer,
    handleRejectOffer,
    handleStatusChange,
    handleUpdateJob,
  }
}
