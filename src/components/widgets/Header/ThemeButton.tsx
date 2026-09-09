import { useEffect, useState } from 'react'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './ThemeButton.module.css'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const bodyTheme = document.body.getAttribute('data-theme')

  if (bodyTheme === 'dark' || bodyTheme === 'light') {
    return bodyTheme
  }

  try {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)

    return savedTheme === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function ThemeButton() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const isDark = theme === 'dark'

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)

    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme)
    } catch {
      // localStorage может быть недоступен
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const icon = <span className={`${styles.icon} ${isDark ? styles.sun : styles.moon}`} />

  return (
    <IconButton
      icon={icon}
      ariaLabel={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      onClick={toggleTheme}
    />
  )
}
