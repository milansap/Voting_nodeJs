'use client'

import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    // Get saved theme or detect system preference
    const savedTheme = localStorage.getItem('voting-app-theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setThemeState(currentTheme)
    
    // Apply theme
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    let themeToApply: 'light' | 'dark'
    
    if (newTheme === 'system') {
      localStorage.removeItem('voting-app-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      themeToApply = prefersDark ? 'dark' : 'light'
    } else {
      localStorage.setItem('voting-app-theme', newTheme)
      themeToApply = newTheme
    }
    
    // Apply theme to DOM
    if (themeToApply === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setThemeState(themeToApply)
  }

  return { theme: theme || 'light', setTheme }
}
