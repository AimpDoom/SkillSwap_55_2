import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Text } from '@/shared/ui/Text'
import doneIcon from '@/shared/assets/icons/done.svg'

import styles from './RegistrationSuccessModal.module.css'

type RegistrationSuccessModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function RegistrationSuccessModal({ isOpen, onClose }: RegistrationSuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Успешное создание предложения"
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <img src={doneIcon} alt="" className={styles.icon} />
        </div>

        <div className={styles.contentBlock}>
          <div className={styles.textBlock}>
            <div className={styles.titleWrapper}>
              <Text variant="h2" as="h3">
                Ваше предложение создано
              </Text>
            </div>

            <div className={styles.descriptionWrapper}>
              <Text variant="body">
                Теперь вы можете предложить обмен
              </Text>
            </div>
          </div>

          <Button variant="primary" onClick={onClose} className={styles.button}>
            Готово
          </Button>
        </div>
      </div>
    </Modal>
  )
}
