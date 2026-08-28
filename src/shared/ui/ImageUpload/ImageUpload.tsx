import clsx from 'clsx'

import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg?react'
import { Text } from '@/shared/ui/Text'

import styles from './ImageUpload.module.css'

export type ImageUploadProps = {
  className?: string
}

export function ImageUpload({ className }: ImageUploadProps) {
  return (
    <div className={clsx(styles.root, className)}>
      <Text variant="body" className={styles.caption}>
        Перетащите или выберите изображения навыка
      </Text>
      <button type="button" className={styles.button}>
        <GalleryEditIcon className={styles.icon} aria-hidden="true" />
        <Text as="span" variant="body">
          Выбрать изображения
        </Text>
      </button>
    </div>
  )
}
