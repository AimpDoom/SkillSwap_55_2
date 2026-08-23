import type { MouseEvent, ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import styles from './Modal.module.css'

type ModalProps = {
  isOpen: boolean
  children: ReactNode
  onClose?: () => void
  className?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  closeOnOverlayClick?: boolean
}

export function Modal({
  isOpen,
  children,
  onClose,
  className = '',
  ariaLabel,
  ariaLabelledBy,
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen || !onClose) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && onClose && event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div
        className={`${styles.modal} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
