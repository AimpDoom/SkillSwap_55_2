import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

import styles from './Input.module.css'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  error?: string
  hint?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}

export function Input({
  label,
  error,
  hint,
  startIcon,
  endIcon,
  id,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  const messageId = error || hint ? `${inputId}-message` : undefined

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={styles.control}>
        {startIcon && (
          <span className={styles.startIcon} aria-hidden="true">
            {startIcon}
          </span>
        )}

        <input
          {...props}
          id={inputId}
          className={`${styles.input} ${startIcon ? styles.inputWithStartIcon : ''} ${
            endIcon ? styles.inputWithEndIcon : ''
          } ${error ? styles.inputError : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
        />

        {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
      </div>

      {(error || hint) && (
        <span
          id={messageId}
          className={error ? styles.error : styles.hint}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
