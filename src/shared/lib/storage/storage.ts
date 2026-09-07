import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS]

export function getStorageItem<T>(key: LocalStorageKey, fallback: T): T {
  try {
    const item = localStorage.getItem(key)

    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: LocalStorageKey, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: LocalStorageKey): void {
  localStorage.removeItem(key)
}
