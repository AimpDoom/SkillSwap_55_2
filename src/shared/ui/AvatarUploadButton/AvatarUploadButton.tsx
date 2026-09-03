import { useId, useRef } from 'react'
import clsx from 'clsx'

import AddIcon from '@/shared/assets/icons/add.svg?react'
import { resizeImageToDataUrl } from '@/shared/lib/image'
import { Avatar } from '@/shared/ui/Avatar'

import styles from './AvatarUploadButton.module.css'

type AvatarUploadButtonProps = {
  value?: string | null
  onChange?: (value: string | null) => void
  alt: string
  className?: string
  icon?: React.ReactNode
  avatarClassName?: string
  uploadButtonClassName?: string
}

export function AvatarUploadButton({
  value,
  onChange,
  alt,
  className,
  icon,
  avatarClassName,
  uploadButtonClassName,
}: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const dataUrl = await resizeImageToDataUrl(file, { maxSize: 512 })
      onChange?.(dataUrl)
    } catch {
      onChange?.(null)
    }
  }

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Avatar src={value ?? undefined} alt={alt} className={clsx(styles.avatar, avatarClassName)} />
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className={styles.input}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className={clsx(styles.uploadButton, uploadButtonClassName)}
        aria-label="Загрузить фото"
        aria-controls={inputId}
        onClick={() => inputRef.current?.click()}
      >
        {icon ?? <AddIcon className={styles.icon} aria-hidden="true" />}
      </button>
    </div>
  )
}
