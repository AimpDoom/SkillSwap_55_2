import { Link } from 'react-router-dom'

import LogoImage from '@/shared/assets/images/logo.svg?react'
import { ROUTES } from '@/shared/lib/constants'

import styles from './Logo.module.css'

export function Logo() {
  return (
    <Link className={styles.logo} to={ROUTES.HOME} aria-label="SkillSwap — на главную">
      <LogoImage className={styles.image} />
    </Link>
  )
}
