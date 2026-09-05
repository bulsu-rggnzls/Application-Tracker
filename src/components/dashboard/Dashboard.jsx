import { useState, useCallback, useEffect } from 'react'
import { Briefcase } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import logActivity from '../../utils/logActivity'
import { fetchApplications, saveApplication, deleteApplication, importApplications } from '../../lib/applicationsApi'
import { seedMockApplications } from '../../lib/mockSeed'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../layout/Sidebar'
import TopBar from '../layout/TopBar'
import ControlsBar from '../layout/ControlsBar'
import AnalyticsBar from '../analytics/AnalyticsBar'
import KanbanBoard from '../views/KanbanBoard'
import TableView from '../views/TableView'
import CalendarView from '../views/CalendarView'
import TimelineView from '../views/TimelineView'
import AnalyticsPage from '../analytics/AnalyticsPage'
import JobModal from '../jobs/JobModal'
import JobDetailDrawer from '../jobs/JobDetailDrawer'
import InterviewModal from '../jobs/InterviewModal'
import { ComposeEmailCard } from '../ui'
import WelcomeEmpty from '../ui/WelcomeEmpty'
import confetti from 'canvas-confetti'
import { exportToJSON, importFromJSON } from '../../utils/dataExport'

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [applications, setApplications] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [viewMode, setViewMode] = useState('board')
  const [activeView, setActiveView] = useState('board')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [detailJob, setDetailJob] = useState(null)
  const [pendingInterview, setPendingInterview] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [darkMode, _setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const userId = user?.id ?? null
  const [fetchError, setFetchError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!userId) {
      setApplications([])
      setDataLoading(false)
      return
    }
    setDataLoading(true)
    setFetchError(null)
    fetchApplications()
      .then(setApplications)
      .catch(err => {
        console.error('Failed to load applications:', err)
        setFetchError(err?.message || 'Could not load your applications.')
      })
      .finally(() => setDataLoading(false))
  }, [userId, retryCount])

  const persist = useCallback((app) => {
    saveApplication(app).catch(err => console.error('Save failed:', err))
  }, [])

  const loadDemoData = useCallback(async () => {
    try {
      await seedMockApplications()
      const fresh = await fetchApplications()
      setApplications(fresh)
    } catch (err) {
      console.error('Demo data load failed:', err)
    }
  }, [])

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
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#059669', '#fbbf24', '#f59e0b'],
        })
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
  }, [persist])

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
  }, [persist])

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
  }, [persist])

  const handleDelete = useCallback((id) => {
    setApplications(prev => prev.filter(a => a.id !== id))
    deleteApplication(id).catch(err => console.error('Delete failed:', err))
  }, [])

  const handleAcceptOffer = useCallback((id) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app
      const updated = logActivity(app, 'offer_accepted', `Offer accepted at ${app.company}`)
      persist(updated)
      return updated
    }))
  }, [persist])

  const handleRejectOffer = useCallback((id) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app
      const updated = logActivity({ ...app, status: 'rejected' }, 'offer_rejected', `Offer rejected at ${app.company}`)
      persist(updated)
      return updated
    }))
  }, [persist])

  const handleStatusChange = useCallback((id, newStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app
      const updated = logActivity({ ...app, status: newStatus }, 'status_change', `Moved to ${newStatus}`)
      persist(updated)
      return updated
    }))
    setDetailJob(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev)
  }, [persist])

  const handleUpdateJob = useCallback((updates) => {
    setApplications(prev => prev.map(app => app.id === updates.id ? { ...app, ...updates } : app))
    setDetailJob(prev => prev && prev.id === updates.id ? { ...prev, ...updates } : prev)
  }, [setApplications])

  const handleExport = useCallback(() => {
    exportToJSON(applications)
  }, [applications])

  const handleImport = useCallback(async (file) => {
    if (!file) return
    try {
      const data = await importFromJSON(file)
      await importApplications(data)
      setApplications(data)
    } catch (err) {
      console.error('Import failed:', err)
    }
  }, [])

  const openEdit = (job) => {
    setEditingJob(job)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditingJob(null)
    setModalOpen(true)
  }

  const handleViewChange = (view) => {
    setActiveView(view)
    if (view === 'board' || view === 'table') {
      setViewMode(view)
    }
  }

  const pendingJob = pendingInterview ? applications.find(a => a.id === pendingInterview.jobId) : null

  const handleComposeEmail = useCallback(() => setComposeOpen(true), [])

  if (authLoading || dataLoading && applications.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (fetchError) {
    const permissionDenied = /42501|permission denied/i.test(fetchError)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="max-w-md text-center bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-2xl shadow-xl p-6">
          <h1 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2">Couldn't load your data</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{fetchError}</p>
          {permissionDenied && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This is a database permissions issue. Run the GRANT statements in the Supabase SQL Editor, then try again.
            </p>
          )}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setRetryCount(c => c + 1)}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 cursor-pointer"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center rounded-xl text-sm font-semibold px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    )
  }

  const composeEmailData = {
    from: {
      id: 'me',
      name: 'You',
      email: 'you@example.com',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=you',
    },
    to: [],
    subject: '',
    body: '',
    attachments: [],
  }

  return (
    <div className={`h-screen flex overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50/40'
    }`}>
      <Sidebar activeView={activeView} onViewChange={handleViewChange} applications={applications} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar applications={applications} onSignOut={signOut} />

          <div className="flex-1 min-h-0 flex flex-col px-6 py-4">
            {activeView === 'board' || activeView === 'table' ? (
              <div className="max-w-[104rem] mx-auto w-full flex flex-col flex-1 min-h-0">
                <ControlsBar
                  onAdd={openAdd}
                  onComposeEmail={handleComposeEmail}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onExport={handleExport}
                  onImport={handleImport}
                />
                <div className="mt-4 shrink-0">
                  <AnalyticsBar applications={applications} />
                </div>
                <div className="mt-4 flex-1 min-h-0 flex flex-col">
                {viewMode === 'board' ? (
                  applications.length === 0 ? (
                    <WelcomeEmpty
                      icon={Briefcase}
                      title="Your board is ready"
                      description="Add your first application and drag it across Wishlist, Applied, Interviewing, and Offer as things progress."
                      actionLabel="+ Add your first application"
                      onAction={openAdd}
                      secondaryLabel="Load demo data"
                      onSecondaryAction={loadDemoData}
                    />
                  ) : (
                    <KanbanBoard
                      applications={applications}
                      onDragEnd={handleDragEnd}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onAcceptOffer={handleAcceptOffer}
                      onRejectOffer={handleRejectOffer}
                      onSelect={setDetailJob}
                    />
                  )
                ) : (
                  <TableView
                    applications={applications}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onSelect={setDetailJob}
                    onAdd={openAdd}
                  />
                )}
                </div>
              </div>
            ) : activeView === 'calendar' ? (
              <div className="max-w-[96rem] mx-auto w-full flex-1 min-h-0 flex flex-col">
                <CalendarView applications={applications} onSelect={setDetailJob} onAdd={openAdd} />
              </div>
            ) : activeView === 'timeline' ? (
              <div className="max-w-[96rem] mx-auto w-full flex-1 min-h-0 flex flex-col">
                <TimelineView applications={applications} onSelect={setDetailJob} onAdd={openAdd} />
              </div>
            ) : activeView === 'analytics' ? (
              <div className="max-w-[96rem] mx-auto w-full flex-1 min-h-0 flex flex-col">
                <AnalyticsPage applications={applications} onAdd={openAdd} />
              </div>
            ) : null}
          </div>
      </div>

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingJob={editingJob}
      />

      <InterviewModal
        isOpen={!!pendingInterview}
        onClose={handleInterviewCancel}
        onConfirm={handleInterviewConfirm}
        job={pendingJob}
      />

      <JobDetailDrawer
        job={detailJob}
        isOpen={!!detailJob}
        onClose={() => setDetailJob(null)}
        onEdit={openEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onUpdate={handleUpdateJob}
      />

      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <ComposeEmailCard
            data={composeEmailData}
            onSend={(data) => {
              console.log('Send email:', data)
              setComposeOpen(false)
            }}
            onClose={() => setComposeOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
