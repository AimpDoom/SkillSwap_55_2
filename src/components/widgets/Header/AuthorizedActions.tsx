import { useState, useRef, useEffect } from 'react';
import LikeIcon from '@/shared/assets/icons/like.svg?react';
import NotificationIcon from '@/shared/assets/icons/notification.svg?react';
import { Avatar } from '@/shared/ui/Avatar';
import { IconButton } from '@/shared/ui/IconButton';
import NotificationCard from '@/entities/notification/ui/NotificationCard';
import { mockNotifications } from '@/entities/notification/model';

import styles from './AuthorizedActions.module.css';

type AuthorizedActionsProps = {
  userName: string;
  avatarSrc?: string;
};

export function AuthorizedActions({ userName, avatarSrc }: AuthorizedActionsProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter((n) => !n.isRead).length
  );
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне окна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const handleUnreadCountChange = (count: number) => {
    setUnreadCount(count);
  };

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
          {unreadCount > 0 && (
            <span className={styles.notificationBadge} />
          )}
        </div>
        
        {isNotificationsOpen && (
          <div className={styles.notificationPopup}>
            <NotificationCard
              notifications={mockNotifications}
              onClose={closeNotifications}
              onUnreadCountChange={handleUnreadCountChange}
            />
          </div>
        )}
      </div>

      <IconButton icon={<LikeIcon />} ariaLabel="Избранное" />

      <div className={styles.user}>
        <span className={styles.userName}>{userName}</span>
        <Avatar className={styles.avatar} src={avatarSrc} alt={`Аватар пользователя ${userName}`} />
      </div>
    </div>
  );
}