import { useId, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg?react'
import { resizeImageToDataUrl } from '@/shared/lib/image'
import { Text } from '@/shared/ui/Text'

import styles from './ImageUpload.module.css'

export type ImageUploadProps = {
  value?: string[]
  onChange?: (value: string[]) => void
  /** Максимальное количество изображений */
  maxCount?: number
  className?: string
}

const DEFAULT_MAX_COUNT = 10

export function ImageUpload({
  value,
  onChange,
  maxCount = DEFAULT_MAX_COUNT,
  className,
}: ImageUploadProps) {
  const images = useMemo(() => value ?? [], [value])
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const [isDragOver, setIsDragOver] = useState(false)

  const isLimitReached = images.length >= maxCount

  const hint = isLimitReached
    ? `Достигнут лимит — ${maxCount} изображений`
    : images.length === 0
      ? `Добавьте до ${maxCount} изображений`
      : `Добавлено ${images.length} из ${maxCount}`

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const freeSlots = Math.max(0, maxCount - images.length)
    if (freeSlots === 0) return

    // Обрабатываем не больше maxCount файлов, дедуп делаем по итоговому data URL,
    // и только потом отсекаем по свободным слотам — чтобы повторно выбранные
    // (уже добавленные) файлы не съедали лимит.
    const files = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, maxCount)

    const results = await Promise.allSettled(files.map((file) => resizeImageToDataUrl(file)))

    const existing = new Set(images)
    const added: string[] = []
    for (const result of results) {
      if (result.status === 'fulfilled' && !existing.has(result.value)) {
        existing.add(result.value)
        added.push(result.value)
      }
    }

    const accepted = added.slice(0, freeSlots)
    if (accepted.length > 0) {
      onChange?.([...images, ...accepted])
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void addFiles(event.target.files)
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    if (isLimitReached) return
    void addFiles(event.dataTransfer.files)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = isLimitReached ? 'none' : 'copy'
    setIsDragOver(true)
  }

  const handleRemove = (index: number) => {
    onChange?.(images.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div
      className={clsx(
        styles.root,
        isDragOver && (isLimitReached ? styles.dragReject : styles.dragOver),
        className,
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
    >
      <Text variant="body" className={styles.caption}>
        Перетащите или выберите изображения навыка
      </Text>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className={styles.input}
        onChange={handleInputChange}
      />
      <button
        type="button"
        className={styles.button}
        aria-controls={inputId}
        disabled={isLimitReached}
        onClick={() => inputRef.current?.click()}
      >
        <GalleryEditIcon className={styles.icon} aria-hidden="true" />
        <Text as="span" variant="body">
          Выбрать изображения
        </Text>
      </button>

      <Text
        as="span"
        variant="caption"
        className={clsx(styles.counter, isLimitReached && styles.counterLimit)}
      >
        {hint}
      </Text>

      {images.length > 0 && (
        <ul className={styles.previews}>
          {images.map((src, index) => (
            <li key={src} className={styles.preview}>
              <img
                className={styles.previewImage}
                src={src}
                alt={`Изображение навыка ${index + 1}`}
              />
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Удалить изображение ${index + 1}`}
                onClick={() => handleRemove(index)}
              >
                <CrossIcon className={styles.removeIcon} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
