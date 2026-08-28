import React, { useState } from 'react';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/shared/ui/Button';
import IdeaIcon from '@/shared/assets/icons/idea.svg?react';
import CloseIcon from '@/shared/assets/icons/cross.svg?react';
import styles from './NotificationBanner.module.css';

export interface NotificationBannerProps {
  /** Текст уведомления */
  message: string;
  /** Обработчик закрытия */
  onClose?: () => void;
  /** Обработчик перехода */
  onNavigate?: () => void;
  /** Текст кнопки перехода */
  navigateText?: string;
  /** Автоматическое скрытие через указанное количество миллисекунд */
  autoHideDuration?: number;
  /** Дополнительный CSS-класс */
  className?: string;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  onClose = () => {},
  onNavigate,
  navigateText = 'Перейти',
  autoHideDuration,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Автоматическое скрытие
  React.useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${styles.banner} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="alert"
    >
      {/* Иконка лампочки */}
      <div className={styles.iconWrapper}>
        <IdeaIcon />
      </div>

      {/* Текст уведомления */}
      <Text variant="h3" className={styles.message}>
        {message}
      </Text>

      {/* Кнопка закрытия */}
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Закрыть уведомление"
      >
        <CloseIcon />
      </button>

      {/* Кнопка "Перейти" - появляется при наведении */}
      {onNavigate && isHovered && (
        <div className={styles.navigateButtonWrapper}>
          <Button
            variant="tertiary"
            className={styles.navigateButton}
            onClick={handleNavigate}
          >
            {navigateText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationBanner;
