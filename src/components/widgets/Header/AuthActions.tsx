import { LoginButton } from './LoginButton'
import { RegisterButton } from './RegisterButton'
import styles from './AuthActions.module.css'

export function AuthActions() {
  return (
    <div className={styles.actions}>
      <LoginButton />
      <RegisterButton />
    </div>
  )
}
