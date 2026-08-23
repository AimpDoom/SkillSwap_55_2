import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'

import styles from './AuthActions.module.css'

export function AuthActions() {
  return (
    <div className={styles.actions}>
      <Button variant="secondary" to={ROUTES.LOGIN}>
        Войти
      </Button>

      <Button variant="primary" to={ROUTES.REGISTER}>
        Зарегистрироваться
      </Button>
    </div>
  )
}
