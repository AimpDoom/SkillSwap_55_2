import type { Skill } from '@/entities/skill'
import type { User } from '@/entities/user'
import type { AuthUser, RegisteredUser, RegistrationDraft } from './types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { generateId } from '@/shared/lib/helpers'
import { getStorageItem, setStorageItem } from '@/shared/lib/storage'

import { saveAuthUser } from './authUtils'

export function getRegisteredUsers(): RegisteredUser[] {
  return getStorageItem<RegisteredUser[]>(LOCAL_STORAGE_KEYS.REGISTERED_USERS, [])
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  setStorageItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, users)
}

export function buildRegisteredUser(draft: RegistrationDraft): RegisteredUser | null {
  const { account, profile, skill } = draft

  if (!account || !profile || !skill) {
    return null
  }

  const { birthDate, cityId, gender } = profile
  const { categoryId, subcategoryId } = skill

  if (!birthDate || !cityId || !gender || !categoryId || !subcategoryId) {
    return null
  }

  const now = new Date().toISOString()
  const userId = generateId()
  const skillId = generateId()

  const teachSkill: Skill = {
    id: skillId,
    title: skill.title,
    description: skill.description,
    categoryId,
    subcategoryId,
    imageUrls: skill.imageUrls,
    authorId: userId,
    createdAt: now,
  }

  const user: User = {
    id: userId,
    name: profile.name,
    email: account.email,
    avatarUrl: profile.avatarUrl,
    birthDate,
    cityId,
    gender,
    teachSkillId: skillId,
    learnSubcategoryIds: profile.learnSubcategoryIds,
    likesCount: 0,
    createdAt: now,
    about: '',
    likedUserIds: [],
  }

  return { user, password: account.password, skill: teachSkill }
}

export function completeRegistration(draft: RegistrationDraft): AuthUser | null {
  const record = buildRegisteredUser(draft)

  if (!record) {
    return null
  }

  const others = getRegisteredUsers().filter((entry) => entry.user.email !== record.user.email)

  setStorageItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, [...others, record])

  return saveAuthUser(record.user)
}
