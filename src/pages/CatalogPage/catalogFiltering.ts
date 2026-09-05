import type { CatalogFilters } from '@/components/widgets/FiltersSidebar/types'
import type { Skill } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'

export const hasActiveCatalogFilters = (filters: CatalogFilters): boolean => {
  return (
    filters.role !== 'all' ||
    filters.selectedSkills.length > 0 ||
    filters.gender !== 'any' ||
    filters.selectedCities.length > 0
  )
}

export const filterCatalogUsers = (
  users: User[],
  skills: Skill[],
  filters: CatalogFilters,
): User[] => {
  const skillsById = new Map(skills.map((skill) => [skill.id, skill]))

  return users.filter((user) => {
    const teachSkill = skillsById.get(user.teachSkillId)

    const teachesSelectedSkill =
      teachSkill !== undefined && filters.selectedSkills.includes(teachSkill.subcategoryId)

    const wantsSelectedSkill = user.learnSubcategoryIds.some((subcategoryId) =>
      filters.selectedSkills.includes(subcategoryId),
    )

    let matchesSkills = true

    if (filters.selectedSkills.length > 0) {
      if (filters.role === 'learn') {
        matchesSkills = teachesSelectedSkill
      } else if (filters.role === 'teach') {
        matchesSkills = wantsSelectedSkill
      } else {
        matchesSkills = teachesSelectedSkill || wantsSelectedSkill
      }
    }

    const matchesGender = filters.gender === 'any' || user.gender === filters.gender

    const matchesCity =
      filters.selectedCities.length === 0 || filters.selectedCities.includes(user.cityId)

    return matchesSkills && matchesGender && matchesCity
  })
}
