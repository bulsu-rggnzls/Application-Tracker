import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { supabaseConfigError } from './lib/supabase.js'
import { Heading } from './components/ui'

function SetupRequired({ message }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md bg-white border border-rose-200 rounded-2xl shadow-xl p-6">
        <Heading size="lg" className="!text-lg !text-rose-600 mb-2">Setup required</Heading>
        <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {supabaseConfigError ? (
      <SetupRequired message={supabaseConfigError} />
    ) : (
      <AuthProvider>
        <App />
      </AuthProvider>
    )}
  </StrictMode>,
)
