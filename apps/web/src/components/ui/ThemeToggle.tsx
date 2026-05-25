'use client'

import { Icon } from './Icon'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        className={theme === 'dark' ? 'active' : ''}
        onClick={() => setTheme('dark')}
        title="Dark"
        aria-label="Use dark theme"
        aria-pressed={theme === 'dark'}
      >
        <Icon name="moon" size={14} />
      </button>
      <button
        type="button"
        className={theme === 'light' ? 'active' : ''}
        onClick={() => setTheme('light')}
        title="Light"
        aria-label="Use light theme"
        aria-pressed={theme === 'light'}
      >
        <Icon name="sun" size={14} />
      </button>
    </div>
  )
}
