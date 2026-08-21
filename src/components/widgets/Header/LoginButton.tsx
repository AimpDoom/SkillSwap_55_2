import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './LoginButton.module.css'

export function LoginButton() {
  return (
    <Link className={styles.button} to={ROUTES.LOGIN}>
      Войти
    </Link>
  )
}
