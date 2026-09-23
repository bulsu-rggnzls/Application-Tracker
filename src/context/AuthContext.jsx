import { createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth as useAuthState } from '../hooks/useAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user, session, loading, handleGoogleLogin, handleLogout } = useAuthState()

  const value = {
    session,
    user,
    loading,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password, fullName) => supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || '' } },
    }),
    signInWithGoogle: handleGoogleLogin,
    handleGoogleLogin,
    signOut: handleLogout,
    handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
