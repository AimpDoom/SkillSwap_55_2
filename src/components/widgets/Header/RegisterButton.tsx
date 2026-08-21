import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './RegisterButton.module.css'

export function RegisterButton() {
  return (
    <Link className={styles.button} to={ROUTES.REGISTER}>
      Зарегистрироваться
    </Link>
  )
}
