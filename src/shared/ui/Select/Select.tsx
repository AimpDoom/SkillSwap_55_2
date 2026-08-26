import type { SelectHTMLAttributes } from 'react'
import { useId } from 'react'

import styles from './Select.module.css'
import { clsx } from 'clsx'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label?: string
  placeholder?: string
  options: SelectOption[]
}

export function Select({ label, placeholder, options, id, className = '', ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}

      <div className={styles.control}>
        <select {...props} id={selectId} className={styles.select}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <span className={styles.chevron} aria-hidden="true" />
      </div>
    </div>
  )
}
