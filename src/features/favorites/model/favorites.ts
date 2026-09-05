import { getAuthUser, getRegisteredUsers } from '@/features/auth/model'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export const FAVORITES_CHANGED_EVENT = 'favorites-changed'

export function getFavoriteUserIds(): string[] {
  const authUser = getAuthUser()
  if (!authUser) {
    return []
  }

  const registeredUser = getRegisteredUsers().find((entry) => entry.user.id === authUser.id)

  return registeredUser?.user.likedUserIds ?? []
}

export function isUserFavorite(userId: string): boolean {
  return getFavoriteUserIds().includes(userId)
}

export function toggleFavoriteUser(userId: string): boolean {
  const authUser = getAuthUser()

  if (!authUser) {
    return false
  }

  const registeredUsers = getRegisteredUsers()
  const userIndex = registeredUsers.findIndex((entry) => entry.user.id === authUser.id)
  if (userIndex === -1) {
    return false
  }

  const existingEntry = registeredUsers[userIndex]
  const currentLikedUsersIds = existingEntry.user.likedUserIds ?? []
  const isFavorite = currentLikedUsersIds.includes(userId)

  const likedUserIds = isFavorite
    ? currentLikedUsersIds.filter((id) => id !== userId)
    : [...currentLikedUsersIds, userId]

  registeredUsers[userIndex] = {
    ...existingEntry,
    user: {
      ...existingEntry.user,
      likedUserIds,
    },
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers))
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT))

  return !isFavorite
}
