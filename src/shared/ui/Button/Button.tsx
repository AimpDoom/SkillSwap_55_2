import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

type CommonProps = {
  children: ReactNode
  variant?: ButtonVariant
  className?: string
}

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
  }

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to: string
    disabled?: boolean
  }

export type ButtonProps = NativeButtonProps | LinkButtonProps

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '' } = props

  const variantClass = styles[`${variant}Button`] ?? styles.primaryButton

  const classes = `${styles.button} ${variantClass} ${className}`

  if ('to' in props && props.to) {
    const { to, disabled, onClick, ...linkProps } = props

    return (
      <Link
        {...linkProps}
        to={to}
        className={`${classes} ${disabled ? styles.disabled : ''}`}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : linkProps.tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            return
          }

          onClick?.(event)
        }}
      >
        {children}
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = props as NativeButtonProps

  return (
    <button {...buttonProps} type={type} className={classes}>
      {children}
    </button>
  )
}
