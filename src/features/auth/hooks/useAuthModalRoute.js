import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function useAuthModalRoute() {
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

  return { authModalMode, openAuth, closeAuth, switchMode }
}
