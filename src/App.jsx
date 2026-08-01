import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from './hooks/useLocalStorage'
import logActivity from './utils/logActivity'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import ControlsBar from './components/layout/ControlsBar'
import AnalyticsBar from './components/analytics/AnalyticsBar'
import KanbanBoard from './components/views/KanbanBoard'
import TableView from './components/views/TableView'
import CalendarView from './components/views/CalendarView'
import TimelineView from './components/views/TimelineView'
import AnalyticsPage from './components/analytics/AnalyticsPage'
import JobModal from './components/jobs/JobModal'
import JobDetailDrawer from './components/jobs/JobDetailDrawer'
import InterviewModal from './components/jobs/InterviewModal'
import { ComposeEmailCard } from './components/ui'
import confetti from 'canvas-confetti'
import { exportToJSON, importFromJSON } from './utils/dataExport'

export default function App() {
  const [applications, setApplications] = useLocalStorage('jobApplications', [])
  const [search, setSearch] = useState('')
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

  const filtered = applications.filter(app => {
    const q = search.toLowerCase()
    return !q || app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q) || app.tags.some(t => t.toLowerCase().includes(q))
  })

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return
    const { draggableId, source, destination } = result

    if (destination.droppableId === 'interviewing') {
      setApplications(prev => prev.map(app =>
        app.id === draggableId ? logActivity({ ...app, status: 'interviewing' }, 'status_change', `Moved to interviewing`) : app
      ))
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
        const updated = from === 'interviewing' ? { ...app, interviews: [] } : app
        return logActivity({ ...updated, status: destination.droppableId }, 'status_change', `Moved from ${from} to ${destination.droppableId}`)
      }))
    }
  }, [setApplications])

  const handleInterviewConfirm = useCallback((jobId, interviewData) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== jobId) return app
      return logActivity({
        ...app,
        interviews: [...(app.interviews || []), { id: uuidv4(), ...interviewData }],
      }, 'interview_scheduled', `Interview scheduled${interviewData.interviewer ? ` with ${interviewData.interviewer}` : ''}${interviewData.platform ? ` via ${interviewData.platform}` : ''}`)
    }))
    setPendingInterview(null)
  }, [setApplications])

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
        return prev.map(a => a.id === job.id ? job : a)
      }
      return [...prev, logActivity(job, 'status_change', `Added ${job.company} — ${job.role}`)]
    })
  }, [setApplications])

  const handleDelete = useCallback((id) => {
    setApplications(prev => prev.filter(a => a.id !== id))
  }, [setApplications])

  const handleAcceptOffer = useCallback((id) => {
    setApplications(prev => prev.map(app =>
      app.id === id ? logActivity(app, 'offer_accepted', `Offer accepted at ${app.company}`) : app
    ))
  }, [setApplications])

  const handleRejectOffer = useCallback((id) => {
    setApplications(prev => prev.map(app =>
      app.id === id ? logActivity({ ...app, status: 'rejected' }, 'offer_rejected', `Offer rejected at ${app.company}`) : app
    ))
  }, [setApplications])

  const handleStatusChange = useCallback((id, newStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app
      const updated = app.status === 'interviewing' ? { ...app, interviews: [] } : app
      return logActivity({ ...updated, status: newStatus }, 'status_change', `Moved to ${newStatus}`)
    }))
  }, [setApplications])

  const handleExport = () => exportToJSON(applications)

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const data = await importFromJSON(file)
      setApplications(data)
    } catch {
      alert('Invalid JSON file')
    }
    e.target.value = ''
  }

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
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar activeView={activeView} onViewChange={handleViewChange} applications={applications} />

      <div className="flex-1 flex flex-col min-w-0">
          <TopBar search={search} onSearchChange={setSearch} applications={applications} />

          <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarGutter: 'stable' }}>
          <div className="px-6 py-4">
            {activeView === 'board' || activeView === 'table' ? (
              <div className="max-w-[104rem] mx-auto">
                <ControlsBar
                  onAdd={openAdd}
                  onExport={handleExport}
                  onImport={handleImport}
                  onComposeEmail={handleComposeEmail}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
                <div className="mt-4">
                  <AnalyticsBar applications={filtered} />
                </div>
                {viewMode === 'board' ? (
                  <KanbanBoard
                    applications={filtered}
                    onDragEnd={handleDragEnd}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onAcceptOffer={handleAcceptOffer}
                    onRejectOffer={handleRejectOffer}
                    onSelect={setDetailJob}
                  />
                ) : (
                  <TableView
                    applications={filtered}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onSelect={setDetailJob}
                  />
                )}
              </div>
            ) : activeView === 'calendar' ? (
              <div className="max-w-[96rem] mx-auto h-[calc(100vh-88px)]">
                <CalendarView applications={applications} onSelect={setDetailJob} />
              </div>
            ) : activeView === 'timeline' ? (
              <div className="max-w-[96rem] mx-auto">
                <TimelineView applications={applications} onSelect={setDetailJob} />
              </div>
            ) : activeView === 'analytics' ? (
              <div className="max-w-[96rem] mx-auto">
                <AnalyticsPage applications={applications} />
              </div>
            ) : null}
          </div>
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
