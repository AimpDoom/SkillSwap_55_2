import styles from './ProfileMenu.module.css'
import logoutIcon from '@/shared/assets/icons/logout.svg'
import { Text } from '@/shared/ui/Text'

export function ProfileMenu() {
  return (
    <div className={styles.menu}>
      <button type="button" className={styles.item}>
        <Text variant="h4" as="span">
          Личный кабинет
        </Text>
      </button>

      <button type="button" className={styles.item}>
        <Text variant="h4" as="span">Выйти из аккаунта</Text>
        <img src={logoutIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  )
}
