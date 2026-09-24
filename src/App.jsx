import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, useAuthModalRoute, AuthModal } from '@/features/auth'
import Dashboard from '@/pages/Dashboard'
import LandingPage from '@/pages/LandingPage'

function FullSpinner() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-8 h-8 border-3 border-brand/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullSpinner />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullSpinner />
  if (user) return <Navigate to="/app" replace />
  return children
}

function LandingRoute() {
  const { authModalMode, openAuth, closeAuth, switchMode } = useAuthModalRoute()

  return (
    <>
      <LandingPage onLogin={() => openAuth('login')} onSignUp={() => openAuth('signup')} />
      <AuthModal mode={authModalMode} onClose={closeAuth} onSwitchMode={switchMode} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicOnly><LandingRoute /></PublicOnly>} />
        <Route path="/login" element={<PublicOnly><LandingRoute /></PublicOnly>} />
        <Route path="/signup" element={<PublicOnly><LandingRoute /></PublicOnly>} />
        <Route path="/app" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
