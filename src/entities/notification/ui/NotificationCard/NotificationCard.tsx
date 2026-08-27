import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';
import IdeaIcon from '@/shared/assets/icons/idea.svg?react';
import { Notification, NotificationCardProps } from '../../model/types';
import { mockNotifications } from '../../model/constants';
import styles from './NotificationCard.module.css';

interface NotificationCardExtendedProps extends NotificationCardProps {
  onUnreadCountChange?: (count: number) => void;
}

const NotificationCard: React.FC<NotificationCardExtendedProps> = ({
  notifications = mockNotifications,
  onClose,
  onNotificationRead,
  onMarkAllAsRead,
  onClearRead,
  onUnreadCountChange,
}) => {
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState<Notification[]>(notifications);

  // Подсчет непрочитанных уведомлений
  const unreadCount = notificationList.filter((n) => !n.isRead).length;

  // Уведомляем родителя об изменении количества непрочитанных
  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Разделяем уведомления на новые и просмотренные
  const newNotifications = notificationList.filter((n) => !n.isRead);
  const readNotifications = notificationList.filter((n) => n.isRead);

  // Обработчик перехода на страницу навыка
  const handleNavigateToSkill = useCallback(
    (skillId: string, notificationId: string | number) => {
      // Отмечаем уведомление как прочитанное
      setNotificationList((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      onNotificationRead?.(notificationId);
      navigate(`/skill/${skillId}`);
      
      if (onClose) onClose();
    },
    [navigate, onClose, onNotificationRead]
  );

  // Обработчик отметки всех как прочитанных
  const handleMarkAllAsRead = useCallback(() => {
    setNotificationList((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
    onMarkAllAsRead?.();
  }, [onMarkAllAsRead]);

  // Обработчик очистки просмотренных
  const handleClearRead = useCallback(() => {
    setNotificationList((prev) => prev.filter((n) => !n.isRead));
    onClearRead?.();
  }, [onClearRead]);

  // Рендер отдельного уведомления
  const renderNotification = (notification: Notification) => {
    const { id, user, message, detail, skillId, date, isRead } = notification;

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
              {date && (
                <Text variant="caption" className={styles.dateText}>
                  {date}
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
    );
  };

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
          <div className={styles.notificationsList}>
            {newNotifications.map(renderNotification)}
          </div>
        </div>
      )}

      {/* Просмотренные уведомления */}
      {readNotifications.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text variant="h2" className={styles.sectionTitle}>
              Просмотренные
            </Text>
            <Button
              variant="tertiary"
              className={styles.sectionAction}
              onClick={handleClearRead}
            >
              Очистить
            </Button>
          </div>
          <div className={styles.notificationsList}>
            {readNotifications.map(renderNotification)}
          </div>
        </div>
      )}

      {/* Пустое состояние */}
      {notificationList.length === 0 && (
        <div className={styles.emptyState}>
          <IdeaIcon className={styles.emptyIcon} />
          <Text variant="body" className={styles.emptyText}>
            Нет уведомлений
          </Text>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;