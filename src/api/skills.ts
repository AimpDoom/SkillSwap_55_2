import type { Skill } from '@/entities/skill/model/types'
import type { SkillCategory, SkillSubcategory } from '@/entities/category/model/types'

const BASE_URL = '/db'

export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch(`${BASE_URL}/skills.json`)
  if (!response.ok) throw new Error('Failed to fetch skills')
  return response.json()
}

export async function fetchSkillById(id: string): Promise<Skill | undefined> {
  const skills = await fetchSkills()
  return skills.find((skill) => skill.id === id)
}

export async function fetchCategories(): Promise<SkillCategory[]> {
  const response = await fetch(`${BASE_URL}/categories.json`)

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}

export async function fetchSubcategory(id: string): Promise<SkillSubcategory | undefined> {
  const categories = await fetchCategories()

  for (const category of categories) {
    const subcategory = category.subcategories.find((subcategory) => subcategory.id === id)

    if (subcategory) {
      return subcategory
    }
  }

  return undefined
}
