import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef, useId, useRef } from 'react'

import styles from './Textarea.module.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  className?: string
  endIcon?: ReactNode
  withIcon?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, hint, className = '', endIcon, withIcon = false, id, onInput, ...props },
    ref,
  ) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId
    const messageId = error || hint ? `${textareaId}-message` : undefined
    const showIcon = withIcon && Boolean(endIcon)

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      const textarea = event.currentTarget

      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`

      onInput?.(event)
    }

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label className={styles.label} htmlFor={textareaId}>
            {label}
          </label>
        )}

        <div className={styles.control}>
          <textarea
            {...props}
            ref={(element) => {
              textareaRef.current = element

              if (typeof ref === 'function') {
                ref(element)
              } else if (ref) {
                ref.current = element
              }
            }}
            id={textareaId}
            onInput={handleInput}
            className={`${styles.textarea} ${
              showIcon ? styles.textareaWithIcon : ''
            } ${error ? styles.textareaError : ''}`}
            aria-invalid={Boolean(error)}
            aria-describedby={messageId}
          />

          {showIcon && (
            <span className={styles.endIcon} aria-hidden="true">
              {endIcon}
            </span>
          )}
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
  },
)

Textarea.displayName = 'Textarea'
