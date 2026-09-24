import { create } from 'zustand'

function getInitialDarkMode() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
  return false
}

export const useThemeStore = create((set) => ({
  darkMode: getInitialDarkMode(),
  setDarkMode: (darkMode) => {
    set({ darkMode })
    localStorage.setItem('darkMode', String(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  },
}))

document.documentElement.classList.toggle('dark', useThemeStore.getState().darkMode)
