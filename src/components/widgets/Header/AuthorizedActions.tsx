import LikeIcon from '@/shared/assets/icons/like.svg?react'
import NotificationIcon from '@/shared/assets/icons/notification.svg?react'
import { Avatar } from '@/shared/ui/Avatar'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './AuthorizedActions.module.css'

type AuthorizedActionsProps = {
  userName: string
  avatarSrc?: string
}

export function AuthorizedActions({ userName, avatarSrc }: AuthorizedActionsProps) {
  return (
    <div className={styles.actions}>
      <IconButton icon={<NotificationIcon />} ariaLabel="Уведомления" />

      <IconButton icon={<LikeIcon />} ariaLabel="Избранное" />

      <div className={styles.user}>
        <span className={styles.userName}>{userName}</span>

        <Avatar className={styles.avatar} src={avatarSrc} alt={`Аватар пользователя ${userName}`} />
      </div>
    </div>
  )
}
