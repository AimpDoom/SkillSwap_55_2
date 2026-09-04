import { InfoModal } from '@/shared/ui/InfoModal'
import NotificationIcon from '@/shared/assets/icons/notification.svg?react'

type ExchangeOfferedModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ExchangeOfferedModal({ isOpen, onClose }: ExchangeOfferedModalProps) {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Обмен предложен"
      icon={<NotificationIcon />}
      title="Вы предложили обмен"
      description="Теперь дождитесь подтверждения. Вам придёт уведомление"
    />
  )
}
