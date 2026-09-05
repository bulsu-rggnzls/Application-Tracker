import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Dashboard from './components/dashboard/Dashboard'
import LandingPage from './components/landing/LandingPage'
import AuthModal from './components/landing/AuthModal'

function FullSpinner() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
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
  const location = useLocation()
  const navigate = useNavigate()
  const routeMode = location.pathname === '/login' ? 'login' : location.pathname === '/signup' ? 'signup' : null
  const [authModalMode, setAuthModalMode] = useState(routeMode)

  useEffect(() => {
    setAuthModalMode(routeMode)
  }, [routeMode])

  const openAuth = (mode) => {
    setAuthModalMode(mode)
    navigate(`/${mode}`)
  }

  const closeAuth = () => {
    setAuthModalMode(null)
    navigate('/')
  }

  const switchMode = (mode) => {
    setAuthModalMode(mode)
    navigate(`/${mode}`, { replace: true })
  }

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
