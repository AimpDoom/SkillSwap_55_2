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
  if ('to' in props && props.to) {
    const {
      children,
      variant = 'primary',
      className = '',
      to,
      disabled,
      onClick,
      ...linkProps
    } = props

    const variantClass = styles[`${variant}Button`] ?? styles.primaryButton
    const classes = `${styles.button} ${variantClass} ${className}`

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

  const {
    children,
    variant = 'primary',
    className = '',
    type = 'button',
    ...buttonProps
  } = props as NativeButtonProps

  const variantClass = styles[`${variant}Button`] ?? styles.primaryButton
  const classes = `${styles.button} ${variantClass} ${className}`

  return (
    <button {...buttonProps} type={type} className={classes}>
      {children}
    </button>
  )
}