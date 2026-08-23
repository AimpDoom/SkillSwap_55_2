import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './IconButton.module.css'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
  ariaLabel: string
}

export function IconButton({
  icon,
  ariaLabel,
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  )
}
