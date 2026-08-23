import { TextareaHTMLAttributes, forwardRef, useId } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const internalId = useId();
    const textareaId = id || internalId;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={styles.control}>
          <textarea
            ref={ref}
            id={textareaId}
            className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
            {...props}
          />
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
