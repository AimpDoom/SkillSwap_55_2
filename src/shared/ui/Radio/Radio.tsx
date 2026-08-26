import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

import styles from './Radio.module.css'
import { clsx } from 'clsx'

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode
}

export function Radio({ label, id, className = '', ...props }: RadioProps) {
  const generatedId = useId()
  const radioId = id ?? generatedId

  return (
    <label className={clsx(styles.wrapper, className)} htmlFor={radioId}>
      <input {...props} id={radioId} className={styles.input} type="radio" />

      <span className={styles.visual} aria-hidden="true" />

      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
