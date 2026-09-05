import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { Text } from '@/shared/ui/Text'
import IdeaIcon from '@/shared/assets/icons/idea.svg?react'
import { formatNotificationDate } from '@/entities/notification/model'
import { Notification, NotificationCardProps } from '../../model/types'
import styles from './NotificationCard.module.css'

const NotificationCard: React.FC<NotificationCardProps> = ({
  notifications,
  onClose,
  onNotificationRead,
  onMarkAllAsRead,
  onClearRead,
}) => {
  const navigate = useNavigate()

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  // Разделяем уведомления на новые и просмотренные
  const newNotifications = notifications.filter((n) => !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  // Обработчик перехода на страницу навыка
  const handleNavigateToSkill = useCallback(
    (skillId: string, notificationId: string | number) => {
      onNotificationRead?.(notificationId)
      navigate(`/skill/${skillId}`)

      if (onClose) onClose()
    },
    [navigate, onClose, onNotificationRead],
  )

  // Обработчик отметки всех как прочитанных
  const handleMarkAllAsRead = useCallback(() => {
    onMarkAllAsRead?.()
  }, [onMarkAllAsRead])

  // Обработчик очистки просмотренных
  const handleClearRead = useCallback(() => {
    onClearRead?.()
  }, [onClearRead])

  // Рендер отдельного уведомления
  const renderNotification = (notification: Notification) => {
    const { id, user, message, detail, skillId, date, isRead } = notification
    const formattedDate = formatNotificationDate(date)

    return (
      <div key={id} className={styles.notificationItem}>
        {/* Первый контейнер: иконка + текст */}
        <div className={styles.notificationContent}>
          <div className={styles.notificationIcon}>
            <IdeaIcon />
          </div>
          <div className={styles.notificationTextWrapper}>
            <div className={styles.notificationHeader}>
              <Text variant="body" className={styles.mainText}>
                {user} {message}
              </Text>
              {formattedDate && (
                <Text variant="caption" className={styles.dateText}>
                  {formattedDate}
                </Text>
              )}
            </div>
            <Text variant="caption" className={styles.detailText}>
              {detail}
            </Text>
          </div>
        </div>
        {/* Второй контейнер: кнопка */}
        {!isRead && (
          <div className={styles.notificationButtonWrapper}>
            <Button
              variant="primary"
              className={styles.notificationButton}
              onClick={() => handleNavigateToSkill(skillId, id)}
            >
              Перейти
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.notificationCard}>
      {/* Новые уведомления */}
      {newNotifications.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text variant="h2" className={styles.sectionTitle}>
              Новые уведомления
            </Text>
            <Button
              variant="tertiary"
              className={styles.sectionAction}
              onClick={handleMarkAllAsRead}
            >
              Прочитать все
            </Button>
          </div>
          <div className={styles.notificationsList}>{newNotifications.map(renderNotification)}</div>
        </div>
      )}

      {/* Просмотренные уведомления */}
      {readNotifications.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text variant="h2" className={styles.sectionTitle}>
              Просмотренные
            </Text>
            <Button variant="tertiary" className={styles.sectionAction} onClick={handleClearRead}>
              Очистить
            </Button>
          </div>
          <div className={styles.notificationsList}>
            {readNotifications.map(renderNotification)}
          </div>
        </div>
      )}

      {/* Пустое состояние */}
      {notifications.length === 0 && (
        <div className={styles.emptyState}>
          <IdeaIcon className={styles.emptyIcon} />
          <Text variant="body" className={styles.emptyText}>
            Нет уведомлений
          </Text>
        </div>
      )}
    </div>
  )
}

export default NotificationCard
