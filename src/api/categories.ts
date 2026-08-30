import type { SkillCategory } from '@/entities/category/model/types'

const BASE_URL = '/db'

export async function fetchCategories(): Promise<SkillCategory[]> {
  const response = await fetch(`${BASE_URL}/categories.json`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}
