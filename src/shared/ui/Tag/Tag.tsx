import type { HTMLAttributes, ReactNode } from 'react'

import styles from './Tag.module.css'
import { clsx } from 'clsx'

export type TagVariant =
  | 'business-career'
  | 'foreign-languages'
  | 'home-comfort'
  | 'creativity-art'
  | 'education-development'
  | 'health-lifestyle'
  | 'neutral'

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: TagVariant
}

export function Tag({ children, variant = 'neutral', className = '', ...props }: TagProps) {
  return (
    <span {...props} className={clsx(styles.tag, styles[variant], className)}>
      {children}
    </span>
  )
}
