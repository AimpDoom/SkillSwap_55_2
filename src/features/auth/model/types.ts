import type { Skill } from '@/entities/skill/model/types'
import type { Gender, User } from '@/entities/user/model/types'

export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}

export type RegisteredUser = {
  user: User
  password: string
  skill: Skill
}

export type AuthFormMode = 'login' | 'register'

export type AuthFormValues = {
  email: string
  password: string
}

export type RegistrationStep = 1 | 2 | 3

export type RegistrationProfileDraft = {
  name: string
  birthDate: string | null
  gender: Gender | 'unspecified' | null
  cityId: string | null
  learnCategoryIds: string[]
  learnSubcategoryIds: string[]
}

export type RegistrationSkillDraft = {
  title: string
  categoryId: string | null
  subcategoryId: string | null
  description: string
}

export type RegistrationDraft = {
  account: AuthFormValues | null
  profile: RegistrationProfileDraft | null
  skill: RegistrationSkillDraft | null
}
