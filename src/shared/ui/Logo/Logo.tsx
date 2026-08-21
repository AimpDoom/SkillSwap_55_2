import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './Logo.module.css'

export function Logo() {
  return (
    <Link className={styles.logo} to={ROUTES.HOME} aria-label="SkillSwap — на главную">
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 5.2c.7 3.8 3 6.1 6.8 6.8-3.8.7-6.1 3-6.8 6.8-.7-3.8-3-6.1-6.8-6.8 3.8-.7 6.1-3 6.8-6.8Z" />
        </svg>
      </span>

      <span>SkillSwap</span>
    </Link>
  )
}
