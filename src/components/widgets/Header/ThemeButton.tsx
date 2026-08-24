import { useEffect, useState } from 'react'

import moonIcon from '@/shared/assets/icons/moon.svg'
import sunIcon from '@/shared/assets/icons/sun.svg'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './ThemeButton.module.css'

export function ThemeButton() {
  const [isDark, setIsDark] = useState(() => document.body.getAttribute('data-theme') === 'dark')

  useEffect(() => {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  const icon = <img className={styles.icon} src={isDark ? sunIcon : moonIcon} alt="" />

  return (
    <IconButton
      icon={icon}
      ariaLabel={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      onClick={toggleTheme}
    />
  )
}
