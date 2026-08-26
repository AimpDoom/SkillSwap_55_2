import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

import userCircleIcon from '@/shared/assets/icons/user-circle-big.svg'

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
        <img className={styles.fallback} src={userCircleIcon} alt="" aria-hidden="true" />
      )}
    </div>
  )
}
