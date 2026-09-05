import { useState, useEffect } from 'react'
import { X, Mail, Lock, Loader2, Briefcase, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Heading, Text, Input, IconButton } from '../ui'
import { useAuth } from '../../context/AuthContext'

function GoogleIcon() {
  return (
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

export default function AuthModal({ mode, onClose, onSwitchMode }) {
  const { signIn, signUp, signInWithGoogle } = useAuth()
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
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (mode == null) return null

  async function handleGoogle() {
    setError('')
    setNotice('')
    setGoogleBusy(true)
    try {
      const { error: authError } = await signInWithGoogle()
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

  return (
    <AnimatePresence>
      <motion.div
        key="auth-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md"
          role="dialog"
          aria-modal="true"
          aria-label={isSignup ? 'Sign up' : 'Log in'}
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center">
                <Briefcase size={16} />
              </div>
              <div>
                <Heading size="md">{isSignup ? 'Create your account' : 'Welcome back'}</Heading>
                <Text variant="subtle" className="mt-0.5">
                  {isSignup ? 'Free forever for your job search' : 'Log in to your tracker'}
                </Text>
              </div>
            </div>
            <IconButton type="button" onClick={onClose} aria-label="Close">
              <X size={18} />
            </IconButton>
          </div>

          <div className="p-5 space-y-4">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleBusy || busy}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-2.5 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-sm disabled:opacity-60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {googleBusy ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or with email</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSignup && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Full name</label>
                  <Input
                    containerClassName="relative w-full"
                    icon={<User size={15} />}
                    id="auth-name"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
              )}
              <div>
                <label htmlFor="auth-email" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Email</label>
                <Input
                  containerClassName="relative w-full"
                  icon={<Mail size={15} />}
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="auth-password" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Password</label>
                <Input
                  containerClassName="relative w-full"
                  icon={<Lock size={15} />}
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              {notice && (
                <div className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
                  {notice}
                </div>
              )}

              <Button
                type="submit"
                variant="indigo"
                disabled={busy || googleBusy}
                className="w-full justify-center bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : (isSignup ? 'Sign Up Free' : 'Log In')}
              </Button>
            </form>
          </div>

          <div className="px-5 pb-5 text-center">
            <Text variant="muted-sm">
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => onSwitchMode(isSignup ? 'login' : 'signup')}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
              >
                {isSignup ? 'Log in' : 'Sign up free'}
              </button>
            </Text>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
