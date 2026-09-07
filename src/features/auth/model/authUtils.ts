import type { AuthUser } from './types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getStorageItem, removeStorageItem, setStorageItem } from '@/shared/lib/storage'

export function getAuthUser(): AuthUser | null {
  return getStorageItem<AuthUser | null>(LOCAL_STORAGE_KEYS.AUTH_USER, null)
}

export function saveAuthUser(user: Omit<AuthUser, 'token'>): AuthUser {
  const authUser: AuthUser = {
    ...user,
    token: `mock_token_${user.id}`,
  }

  setStorageItem(LOCAL_STORAGE_KEYS.AUTH_USER, authUser)

  return authUser
}

export function updateAuthUser(
  updates: Partial<Pick<AuthUser, 'name' | 'email'>>,
): AuthUser | null {
  const authUser = getAuthUser()

  if (!authUser) {
    return null
  }

  const updatedAuthUser: AuthUser = {
    ...authUser,
    ...updates,
  }

  setStorageItem(LOCAL_STORAGE_KEYS.AUTH_USER, updatedAuthUser)

  return updatedAuthUser
}

export function clearAuthUser(): void {
  removeStorageItem(LOCAL_STORAGE_KEYS.AUTH_USER)
}
