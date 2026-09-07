import { useEffect, useState } from 'react'

import { getStorageItem, setStorageItem, type LocalStorageKey } from '@/shared/lib/storage'

export function useLocalStorage<T>(key: LocalStorageKey, initialValue: T) {
  const [value, setValue] = useState<T>(() => getStorageItem(key, initialValue))

  useEffect(() => {
    setStorageItem(key, value)
  }, [key, value])

  return [value, setValue] as const
}
