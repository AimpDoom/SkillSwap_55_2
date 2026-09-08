import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

import UserCircleIcon from '@/shared/assets/icons/user-circle-big.svg?react'

import styles from './Avatar.module.css'

type AvatarProps = {
  src?: string
  alt: string
  className?: string
}

export function Avatar({ src, alt, className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  const showImage = Boolean(src) && !hasError

  return (
    <div
      className={clsx(styles.avatar, className)}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : alt}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt={alt} onError={() => setHasError(true)} />
      ) : (
        <UserCircleIcon
  className={styles.fallback}
  aria-hidden="true"
/>
      )}
    </div>
  )
}
