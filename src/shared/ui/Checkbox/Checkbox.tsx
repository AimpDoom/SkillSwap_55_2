import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

import styles from './Checkbox.module.css'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <label className={`${styles.wrapper} ${className}`} htmlFor={checkboxId}>
      <input {...props} id={checkboxId} className={styles.input} type="checkbox" />

      <span className={styles.visual} aria-hidden="true" />

      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
