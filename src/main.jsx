import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '@/features/auth'
import { supabaseConfigError } from '@/lib/supabase.js'
import { queryClient } from '@/lib/queryClient.js'
import { Heading, Text } from '@/components/ui'

function SetupRequired({ message }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md bg-white border border-rose-200 rounded-2xl shadow-xl p-6">
        <Heading size="lg" className="!text-lg !text-rose-600 mb-2">Setup required</Heading>
        <Text className="!text-slate-600 dark:!text-slate-400 leading-relaxed">{message}</Text>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {supabaseConfigError ? (
      <SetupRequired message={supabaseConfigError} />
    ) : (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    )}
  </StrictMode>,
)
