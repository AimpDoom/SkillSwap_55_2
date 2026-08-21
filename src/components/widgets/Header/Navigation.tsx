import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './Navigation.module.css'

export function Navigation() {
  return (
    <nav className={styles.navigation} aria-label="Основная навигация">
      <a className={styles.link} href="#about">
        О проекте
      </a>

      <Link className={styles.link} to={ROUTES.HOME}>
        <span>Все навыки</span>

        <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4.5 6 3.5 3.5L11.5 6" />
        </svg>
      </Link>
    </nav>
  )
}
