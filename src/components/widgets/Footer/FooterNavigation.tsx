import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'

import styles from './FooterNavigation.module.css'

export function FooterNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Навигация в подвале">
      <div className={styles.column}>
        <a className={styles.link} href="#about">
          О проекте
        </a>

        <Link className={styles.link} to={ROUTES.HOME}>
          Все навыки
        </Link>
      </div>

      <div className={styles.column}>
        <span className={styles.link}>Контакты</span>
        <span className={styles.link}>Блог</span>
      </div>

      <div className={styles.column}>
        <span className={styles.link}>Политика конфиденциальности</span>
        <span className={styles.link}>Пользовательское соглашение</span>
      </div>
    </nav>
  )
}