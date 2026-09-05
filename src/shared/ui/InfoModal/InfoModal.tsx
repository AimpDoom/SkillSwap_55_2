import type { ReactNode } from 'react'

import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Text } from '@/shared/ui/Text'

import styles from './InfoModal.module.css'

type InfoModalProps = {
  isOpen: boolean
  onClose: () => void
  icon: ReactNode
  title: string
  description: string
  buttonLabel?: string
  ariaLabel: string
}

export function InfoModal({
  isOpen,
  onClose,
  icon,
  title,
  description,
  buttonLabel = 'Готово',
  ariaLabel,
}: InfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={ariaLabel}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>{icon}</div>

        <div className={styles.contentBlock}>
          <div className={styles.textBlock}>
            <div className={styles.titleWrapper}>
              <Text variant="h2" as="h3">
                {title}
              </Text>
            </div>

            <div className={styles.descriptionWrapper}>
              <Text variant="body">{description}</Text>
            </div>
          </div>

          <Button variant="primary" onClick={onClose} className={styles.button}>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
