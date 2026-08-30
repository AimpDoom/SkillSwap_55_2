import type { User } from '@/entities/user/model/types'

const SECTION_USERS_LIMIT = 9

export const getPopularUsers = (users: User[]): User[] =>
  [...users].sort((a, b) => b.likesCount - a.likesCount).slice(0, SECTION_USERS_LIMIT)

export const getNewUsers = (users: User[]): User[] =>
  [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, SECTION_USERS_LIMIT)

export const shuffleUsers = (users: User[]): User[] => {
  const shuffledUsers = [...users]

  for (let index = shuffledUsers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))

    const currentUser = shuffledUsers[index]
    shuffledUsers[index] = shuffledUsers[randomIndex]
    shuffledUsers[randomIndex] = currentUser
  }

  return shuffledUsers
}