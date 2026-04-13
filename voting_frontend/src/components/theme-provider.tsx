'use client'

import { ReactNode, useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Apply saved theme or default to system preference
    const savedTheme = localStorage.getItem('voting-app-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = savedTheme || (prefersDark ? 'dark' : 'light')
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return <>{children}</>
}
