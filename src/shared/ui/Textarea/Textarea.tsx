import {
  TextareaHTMLAttributes,
  forwardRef,
  useId,
  ReactNode,
} from 'react';

import styles from './Textarea.module.css';

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  endIcon?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      endIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label
            className={styles.label}
            htmlFor={textareaId}
          >
            {label}
          </label>
        )}

        <div className={styles.control}>
          <textarea
            ref={ref}
            id={textareaId}
            className={`${styles.textarea} ${
              error ? styles.textareaError : ''
            }`}
            {...props}
          />

          {endIcon && (
            <span className={styles.endIcon}>
              {endIcon}
            </span>
          )}
        </div>

        {error ? (
          <span className={styles.error}>{error}</span>
        ) : (
          hint && <span className={styles.hint}>{hint}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
