export interface ResizeImageOptions {
  /** Максимальная длина большей стороны изображения в пикселях */
  maxSize?: number
  /** Качество JPEG от 0 до 1 */
  quality?: number
}

const DEFAULT_MAX_SIZE = 1200
const DEFAULT_QUALITY = 0.8

/**
 * Декодирует изображение из File, пропорционально уменьшает его до maxSize
 * и возвращает сжатый data URL (JPEG). Используется, чтобы не переполнять
 * localStorage при регистрации — серверной загрузки в проекте нет.
 */
export async function resizeImageToDataUrl(
  file: File,
  { maxSize = DEFAULT_MAX_SIZE, quality = DEFAULT_QUALITY }: ResizeImageOptions = {},
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Файл не является изображением')
  }

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

  try {
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas недоступен')
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    bitmap.close()
  }
}
