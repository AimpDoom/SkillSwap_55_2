import AppleIcon from '@/shared/assets/icons/auth/apple.svg?react'
import GoogleIcon from '@/shared/assets/icons/auth/google.svg?react'
import { Button } from '@/shared/ui/Button'
import { Text } from '@/shared/ui/Text'
import styles from './SocialAuthButtons.module.css'

export const SocialAuthButtons = () => {
  return (
    <div className={styles.wrapper}>
      <Button variant="social" disabled>
        <GoogleIcon className={styles.icon} aria-hidden="true" />
        Продолжить с Google
      </Button>

      <Button variant="social" disabled>
        <AppleIcon className={styles.icon} aria-hidden="true" />
        Продолжить с Apple
      </Button>
      <div className={styles.divider}>
        <span className={styles.line} />
        <Text variant="body" className={styles.dividerText}>
          или
        </Text>
        <span className={styles.line} />
      </div>
    </div>
  )
}
