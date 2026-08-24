import { useState, useEffect } from 'react'
import moonIcon from '@/shared/assets/icons/moon.svg'
import { IconButton } from '@/shared/ui/IconButton'
import styles from './ThemeButton.module.css'

export function ThemeButton() {
  const [isDark, setIsDark] = useState(() => {
    return document.body.getAttribute('data-theme') === 'dark'
  })

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark')
    } else {
      document.body.setAttribute('data-theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  // Применяем инверсию цветов и яркости напрямую, если тема темная
  const iconStyle = isDark 
    ? { filter: 'invert(100%) brightness(0.2)' } // Инвертирует очертания и подстраивает под темный фон
    : undefined

  const icon = <img className={styles.icon} src={moonIcon} alt="" style={iconStyle} />

  return <IconButton icon={icon} ariaLabel="Переключить тему" onClick={toggleTheme} />
}
