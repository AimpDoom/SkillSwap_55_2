import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getStorageItem, setStorageItem } from '@/shared/lib/storage'

import type { Notification } from './types'

export function getNotifications(): Notification[] {
  const notifications = getStorageItem<unknown>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, [])

  if (!Array.isArray(notifications)) {
    return []
  }

  return notifications.filter(
    (notification): notification is Notification =>
      typeof notification === 'object' &&
      notification !== null &&
      typeof (notification as Notification).recipientUserId === 'string',
  )
}

export function persistNotifications(items: Notification[]): void {
  setStorageItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, items)
}
