import { InfoModal } from '@/shared/ui/InfoModal'
import DoneIcon from '@/shared/assets/icons/done.svg?react'

type RegistrationSuccessModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function RegistrationSuccessModal({ isOpen, onClose }: RegistrationSuccessModalProps) {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Успешное создание предложения"
      icon={<DoneIcon />}
      title="Ваше предложение создано"
      description="Теперь вы можете предложить обмен"
    />
  )
}
