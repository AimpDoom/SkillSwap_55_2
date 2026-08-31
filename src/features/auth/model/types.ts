import type { Gender } from '@/entities/user/model/types'

export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}

export type AuthFormMode = 'login' | 'register'

export type AuthFormValues = {
  email: string
  password: string
}

export type RegistrationStep = 1 | 2 | 3

/** Данные профиля. Храним примитивы (id и строки), чтобы черновик
 *  сериализовался в localStorage без преобразований и совпадал по форме с `User` */
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
