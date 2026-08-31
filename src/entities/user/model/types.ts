export type Gender = 'male' | 'female'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  birthDate: string
  cityId: string
  gender: Gender | 'unspecified'
  teachSkillId: string
  learnSubcategoryIds: string[]
  likesCount: number
  createdAt: string
  about: string
  likedUserIds: string[]
}