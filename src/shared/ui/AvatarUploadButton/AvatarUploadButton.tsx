import clsx from 'clsx'

import AddIcon from '@/shared/assets/icons/add.svg?react'
import { Avatar } from '@/shared/ui/Avatar'

import styles from './AvatarUploadButton.module.css'

type AvatarUploadButtonProps = {
  src?: string
  alt: string
  className?: string
}

export function AvatarUploadButton({ src, alt, className }: AvatarUploadButtonProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <Avatar src={src} alt={alt} className={styles.avatar} />
      <button type="button" className={styles.uploadButton} aria-label="Загрузить фото">
        <AddIcon className={styles.icon} aria-hidden="true" />
      </button>
    </div>
  )
}
