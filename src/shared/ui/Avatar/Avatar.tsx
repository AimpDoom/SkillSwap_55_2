import { useEffect, useState } from 'react'

import styles from './Avatar.module.css'

type AvatarProps = {
  src?: string
  alt: string
  fallback: string
  className?: string
}

export function Avatar({ src, alt, fallback, className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  const showImage = Boolean(src) && !hasError

  return (
    <div
      className={`${styles.avatar} ${className}`}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : alt}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt={alt} onError={() => setHasError(true)} />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {fallback}
        </span>
      )}
    </div>
  )
}
