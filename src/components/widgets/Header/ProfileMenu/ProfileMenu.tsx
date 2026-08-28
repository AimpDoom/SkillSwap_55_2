import styles from './ProfileMenu.module.css'
import logoutIcon from '@/shared/assets/icons/logout.svg'

export function ProfileMenu() {
  return (
    <div className={styles.menu}>
      <button type="button" className={styles.item}>
        Личный кабинет
      </button>

      <button type="button" className={styles.item}>
        <span>Выйти из аккаунта</span>
        <img src={logoutIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  )
}
