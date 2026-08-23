import { IconButton } from '@/shared/ui/IconButton'

import styles from './ThemeButton.module.css'

export function ThemeButton() {
  const icon = (
    <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M15.9 12.5A6.2 6.2 0 0 1 7.5 4.1 6.25 6.25 0 1 0 15.9 12.5Z" />
    </svg>
  )

  return <IconButton icon={icon} ariaLabel="Переключить тему" />
}
