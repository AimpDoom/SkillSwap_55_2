import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useRef } from 'react'

import styles from './Input.module.css'
import { clsx } from 'clsx'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  error?: string
  hint?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}

function InputImpl(
  {
    label,
    error,
    hint,
    startIcon,
    endIcon,
    id,
    className = '',
    type = 'text',
    onClick,
    disabled,
    readOnly,
    ...props
  }: InputProps,
  forwardedRef: ForwardedRef<HTMLInputElement>,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputRef = useRef<HTMLInputElement | null>(null)

  const messageId = error || hint ? `${inputId}-message` : undefined

  const openDatePicker = () => {
    if (type !== 'date' || disabled || readOnly) {
      return
    }

    inputRef.current?.showPicker?.()
  }

  return (
    <div className={clsx(styles.wrapper, className)}>
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
          ref={(node) => {
            inputRef.current = node

            if (typeof forwardedRef === 'function') {
              forwardedRef(node)
            } else if (forwardedRef) {
              forwardedRef.current = node
            }
          }}
          id={inputId}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          className={clsx(
            styles.input,
            startIcon && styles.inputWithStartIcon,
            endIcon && styles.inputWithEndIcon,
            error && styles.inputError,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          onClick={(event) => {
            onClick?.(event)

            if (!event.defaultPrevented) {
              openDatePicker()
            }
          }}
        />

        {endIcon &&
          (type === 'date' ? (
            <button
              type="button"
              className={clsx(styles.endIcon, styles.endIconButton)}
              aria-label="Открыть календарь"
              disabled={disabled}
              onClick={openDatePicker}
            >
              {endIcon}
            </button>
          ) : (
            <span className={styles.endIcon} aria-hidden="true">
              {endIcon}
            </span>
          ))}
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

export const Input = forwardRef(InputImpl)
