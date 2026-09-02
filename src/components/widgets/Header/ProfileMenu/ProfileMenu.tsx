import { useNavigate } from 'react-router-dom'
import { clearAuthUser } from '@/features/auth/model'
import logoutIcon from '@/shared/assets/icons/logout.svg'
import { ROUTES } from '@/shared/lib/constants'
import { Text } from '@/shared/ui/Text'
import styles from './ProfileMenu.module.css'

type ProfileMenuProps = {
  onClose?: () => void
}

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  const navigate = useNavigate()

  const handleProfileClick = () => {
    onClose?.()
    navigate(ROUTES.PROFILE)
  }

  const handleLogoutClick = () => {
    clearAuthUser()
    onClose?.()
    navigate(ROUTES.HOME, { state: { loggedOut: true } })
  }

  return (
    <div className={styles.menu} onClick={(event) => event.stopPropagation()}>
      <button type="button" className={styles.item} onClick={handleProfileClick}>
        <Text variant="h4" as="span">
          Личный кабинет
        </Text>
      </button>

      <button type="button" className={styles.item} onClick={handleLogoutClick}>
        <Text variant="h4" as="span">Выйти из аккаунта</Text>
        <img src={logoutIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  )
}
