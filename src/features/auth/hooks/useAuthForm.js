import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useAuthForm({ mode, onClose }) {
  const { signIn, signUp, handleGoogleLogin, user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)

  const isSignup = mode === 'signup'

  useEffect(() => {
    setError('')
    setNotice('')
  }, [mode])

  useEffect(() => {
    if (user) onClose()
  }, [user, onClose])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleGoogle() {
    setError('')
    setNotice('')
    setGoogleBusy(true)
    try {
      const { error: authError } = await handleGoogleLogin()
      if (authError) setError(authError.message)
    } finally {
      setGoogleBusy(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const { error: authError } = isSignup
        ? await signUp(email, password, fullName)
        : await signIn(email, password)
      if (authError) {
        setError(authError.message)
      } else if (isSignup) {
        setNotice('Account created. You are now signed in.')
      }
    } finally {
      setBusy(false)
    }
  }

  return {
    isSignup,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    notice,
    busy,
    googleBusy,
    handleGoogle,
    handleSubmit,
  }
}
