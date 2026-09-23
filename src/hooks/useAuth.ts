import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!active) return
      setSession(prev => {
        if (event === 'TOKEN_REFRESHED' && prev && newSession?.user?.id === prev.user.id) {
          return prev
        }
        return newSession
      })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const handleGoogleLogin = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account',
        },
      },
    })
    return { error }
  }, [])

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [])

  return {
    session,
    user: session?.user ?? null,
    loading,
    handleGoogleLogin,
    handleLogout,
  }
}
