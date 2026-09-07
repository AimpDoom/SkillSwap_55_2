import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

import styles from './IconButton.module.css'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
  ariaLabel: string
}

export function IconButton({
  icon,
  ariaLabel,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={clsx(styles.button, className)}
      aria-label={ariaLabel}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
