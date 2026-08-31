import type { AuthUser } from '@/features/auth/model/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function saveAuthUser(user: Omit<AuthUser, 'token'>): AuthUser {
  const authUser: AuthUser = { ...user, token: 'mock_token_' + user.id }
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser))
  return authUser
}

export function clearAuthUser(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER)
}
