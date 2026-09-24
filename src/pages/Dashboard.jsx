import { Briefcase } from 'lucide-react'
import { useAuth } from '@/features/auth'
import {
  useApplications,
  useApplicationActions,
  KanbanBoard,
  TableView,
  CalendarView,
  TimelineView,
  JobModal,
  JobDetailDrawer,
  InterviewModal,
  ComposeEmailCard,
} from '@/features/jobs'
import { AnalyticsBar, AnalyticsPage } from '@/features/analytics'
import { useThemeStore } from '@/store/useThemeStore'
import { useUiStore } from '@/store/useUiStore'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import ControlsBar from '@/components/layout/ControlsBar'
import LogoutModal from '@/components/layout/LogoutModal'
import { Button, Heading, Text } from '@/components/ui'
import WelcomeEmpty from '@/components/ui/WelcomeEmpty'
import { layout } from '@/lib/layout'

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

export default function Dashboard() {
  const { user, loading: authLoading, handleLogout, handleGoogleLogin } = useAuth()
  const userId = user?.id ?? null

  const {
    applications,
    dataLoading,
    fetchError,
    retry,
    loadDemoData,
    deleteJob,
    exportData,
    importData,
    persist,
    setApplications,
  } = useApplications(userId)

  const {
    detailJob,
    setDetailJob,
    pendingInterview,
    pendingJob,
    handleDragEnd,
    handleInterviewConfirm,
    handleInterviewCancel,
    handleSave,
    handleAcceptOffer,
    handleRejectOffer,
    handleStatusChange,
    handleUpdateJob,
  } = useApplicationActions({ applications, setApplications, persist, deleteJob })

  const darkMode = useThemeStore((s) => s.darkMode)

  const {
    viewMode,
    setViewMode,
    activeView,
    drawerOpen,
    setDrawerOpen,
    modalOpen,
    editingJob,
    composeOpen,
    logoutModalOpen,
    openEdit,
    openAdd,
    closeModal,
    handleViewChange,
    openComposeEmail,
    closeComposeEmail,
    openLogoutModal,
    closeLogoutModal,
  } = useUiStore()

  if (authLoading || dataLoading && applications.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-canvas">
        <div className="w-8 h-8 border-3 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    )
  }

  if (fetchError) {
    const permissionDenied = /42501|permission denied/i.test(fetchError)
    return (
      <div className="h-screen flex items-center justify-center bg-canvas px-4">
        <div className="max-w-md text-center bg-surface border border-accent-danger/40 rounded-2xl shadow-xl p-6">
          <Heading size="lg" className="!text-lg !text-accent-danger mb-2">Couldn't load your data</Heading>
          <Text>{fetchError}</Text>
          {permissionDenied && (
            <Text variant="subtle" className="mt-3 leading-relaxed">
              This is a database permissions issue. Run the GRANT statements in the Supabase SQL Editor, then try again.
            </Text>
          )}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <Button type="button" variant="gradient" onClick={retry}>
              Try again
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleLogout()} className="px-5 py-2.5 font-semibold rounded-xl">
              Log out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen flex overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50/40'
    }`}>
      <Sidebar activeView={activeView} onViewChange={handleViewChange} applications={applications} user={user} onLogoutClick={openLogoutModal} onGoogleLogin={handleGoogleLogin} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      <div className={layout.mainColumn}>
          <TopBar applications={applications} onOpenMenu={() => setDrawerOpen(true)} />

          <div className={`flex-1 min-h-0 flex flex-col ${layout.pageGutter}`}>
            {activeView === 'board' || activeView === 'table' ? (
              <div className={layout.containerWide}>
                <ControlsBar
                  onAdd={openAdd}
                  onComposeEmail={openComposeEmail}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onExport={exportData}
                  onImport={importData}
                />
                <div className="mt-3 sm:mt-4 shrink-0">
                  <AnalyticsBar applications={applications} />
                </div>
                <div className="mt-3 sm:mt-4 flex-1 min-h-0 flex flex-col">
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
                      onDelete={deleteJob}
                      onAcceptOffer={handleAcceptOffer}
                      onRejectOffer={handleRejectOffer}
                      onSelect={setDetailJob}
                      onStatusChange={handleStatusChange}
                    />
                  )
                ) : (
                  <TableView
                    applications={applications}
                    onEdit={openEdit}
                    onDelete={deleteJob}
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
                <AnalyticsPage applications={applications} onAdd={openAdd} dark={darkMode} />
              </div>
            ) : null}
          </div>
      </div>

      <JobModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingJob={editingJob}
      />

      <InterviewModal
        isOpen={!!pendingInterview}
        onClose={handleInterviewCancel}
        onConfirm={handleInterviewConfirm}
        job={pendingJob}
      />

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={async () => { closeLogoutModal(); await handleLogout() }}
      />

      <JobDetailDrawer
        job={detailJob}
        isOpen={!!detailJob}
        onClose={() => setDetailJob(null)}
        onEdit={openEdit}
        onDelete={deleteJob}
        onStatusChange={handleStatusChange}
        onUpdate={handleUpdateJob}
      />

      {composeOpen && (
        <div className="modal-overlay">
          <ComposeEmailCard
            data={composeEmailData}
            onSend={(data) => {
              console.log('Send email:', data)
              closeComposeEmail()
            }}
            onClose={closeComposeEmail}
          />
        </div>
      )}
    </div>
  )
}
