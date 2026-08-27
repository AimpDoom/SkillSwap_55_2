import type { ElementType, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Text.module.css'

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'

const defaultTag: Record<TextVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'span',
}

export interface TextProps {
  variant: TextVariant
  as?: ElementType
  className?: string
  children: ReactNode
}

export const Text = ({ variant, as, className, children }: TextProps) => {
  const Tag = as ?? defaultTag[variant]
  return <Tag className={clsx(styles[variant], className)}>{children}</Tag>
}
