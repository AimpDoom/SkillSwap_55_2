import moonIcon from '@/shared/assets/icons/moon.svg'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './ThemeButton.module.css'

export function ThemeButton() {
  const icon = <img className={styles.icon} src={moonIcon} alt="" />

  return <IconButton icon={icon} ariaLabel="Переключить тему" />
}