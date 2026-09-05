import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import NotificationIcon from '@/shared/assets/icons/notification.svg?react'
import { Avatar } from '@/shared/ui/Avatar'
import { IconButton } from '@/shared/ui/IconButton'
import NotificationBanner from '@/shared/ui/NotificationBanner'
import NotificationCard from '@/entities/notification/ui/NotificationCard'
import {
  clearRead,
  dismissToast,
  markAllAsRead,
  notificationRead,
} from '@/entities/notification/model'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ProfileMenu } from './ProfileMenu'
import styles from './AuthorizedActions.module.css'
import { ROUTES } from '@/shared/lib/constants'

type AuthorizedActionsProps = {
  userId: string
  userName: string
  avatarSrc?: string
}

export function AuthorizedActions({ userId, userName, avatarSrc }: AuthorizedActionsProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const allNotifications = useAppSelector((state) => state.notifications.items)
  const notifications = allNotifications.filter(
    (notification) => notification.recipientUserId === userId,
  )
  const toastIds = useAppSelector((state) => state.notifications.toastIds)
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev)
  }

  const wrapperRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Закрытие при клике вне окна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationsOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
  }

  const closeNotifications = () => {
    setIsNotificationsOpen(false)
  }

  const toastNotifications = toastIds
    .map((toastId) => notifications.find((notification) => notification.id === toastId))
    .filter(
      (notification): notification is (typeof notifications)[number] =>
        notification !== undefined && !notification.isRead,
    )

  return (
    <div className={styles.actions}>
      <div className={styles.notificationWrapper} ref={wrapperRef}>
        <div className={styles.notificationButtonWrapper}>
          <IconButton
            icon={<NotificationIcon />}
            ariaLabel="Уведомления"
            onClick={toggleNotifications}
          />
          {/* Индикатор новых уведомлений */}
          {unreadCount > 0 && <span className={styles.notificationBadge} />}
        </div>

        {isNotificationsOpen && (
          <div className={styles.notificationPopup}>
            <NotificationCard
              notifications={notifications}
              onClose={closeNotifications}
              onNotificationRead={(notificationId) => dispatch(notificationRead(notificationId))}
              onMarkAllAsRead={() => dispatch(markAllAsRead(userId))}
              onClearRead={() => dispatch(clearRead(userId))}
            />
          </div>
        )}
      </div>

      <IconButton
        icon={<LikeIcon />}
        ariaLabel="Избранное"
        onClick={() => navigate(ROUTES.FAVORITES)}
      />

      <div className={styles.user} ref={profileMenuRef} onClick={toggleProfileMenu}>
        <span className={styles.userName}>{userName}</span>

        <Avatar className={styles.avatar} src={avatarSrc} alt={`Аватар пользователя ${userName}`} />

        {isProfileMenuOpen && <ProfileMenu onClose={() => setIsProfileMenuOpen(false)} />}
      </div>

      {toastNotifications.length > 0 && (
        <div className={styles.toastStack}>
          {toastNotifications.map((notification) => (
            <NotificationBanner
              key={notification.id}
              message={`${notification.user} ${notification.message}`}
              onClose={() => dispatch(dismissToast(notification.id))}
              onNavigate={() => {
                dispatch(notificationRead(notification.id))
                navigate(`/skill/${notification.skillId}`)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
