import type { HTMLAttributes, ReactNode } from 'react'

import styles from './Tag.module.css'

export type TagVariant =
  | 'business'
  | 'languages'
  | 'home'
  | 'art'
  | 'education'
  | 'health'
  | 'neutral'

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: TagVariant
}

export function Tag({ children, variant = 'neutral', className = '', ...props }: TagProps) {
  return (
    <span {...props} className={`${styles.tag} ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}
