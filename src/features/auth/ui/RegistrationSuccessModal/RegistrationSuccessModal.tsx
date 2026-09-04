import { InfoModal } from '@/shared/ui/InfoModal'
import doneIcon from '@/shared/assets/icons/done.svg'

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
      icon={<img src={doneIcon} alt="" />}
      title="Ваше предложение создано"
      description="Теперь вы можете предложить обмен"
    />
  )
}
