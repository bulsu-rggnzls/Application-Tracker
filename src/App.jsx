import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from './hooks/useLocalStorage'
import mockData from './data/mockData'
import logActivity from './utils/logActivity'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ControlsBar from './components/ControlsBar'
import AnalyticsBar from './components/AnalyticsBar'
import KanbanBoard from './components/KanbanBoard'
import TableView from './components/TableView'
import CalendarView from './components/CalendarView'
import TimelineView from './components/TimelineView'
import AnalyticsPage from './components/AnalyticsPage'
import JobModal from './components/JobModal'
import JobDetailDrawer from './components/JobDetailDrawer'
import InterviewModal from './components/InterviewModal'
import confetti from 'canvas-confetti'
import { exportToJSON, importFromJSON } from './utils/dataExport'

export default function App() {
  const [applications, setApplications] = useLocalStorage('jobApplications', mockData)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('board')
  const [activeView, setActiveView] = useState('board')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [detailJob, setDetailJob] = useState(null)
  const [pendingInterview, setPendingInterview] = useState(null)
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
        return logActivity({ ...app, status: destination.droppableId }, 'status_change', `Moved from ${from} to ${destination.droppableId}`)
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
    setApplications(prev => prev.map(app =>
      app.id === id ? logActivity({ ...app, status: newStatus }, 'status_change', `Moved to ${newStatus}`) : app
    ))
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

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar activeView={activeView} onViewChange={handleViewChange} applications={applications} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {activeView === 'board' || activeView === 'table' ? (
              <>
                <ControlsBar
                  search={search}
                  onSearchChange={setSearch}
                  onAdd={openAdd}
                  onExport={handleExport}
                  onImport={handleImport}
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
              </>
            ) : activeView === 'calendar' ? (
              <CalendarView applications={applications} onSelect={setDetailJob} />
            ) : activeView === 'timeline' ? (
              <TimelineView applications={applications} onSelect={setDetailJob} />
            ) : activeView === 'analytics' ? (
              <AnalyticsPage applications={applications} />
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
    </div>
  )
}
