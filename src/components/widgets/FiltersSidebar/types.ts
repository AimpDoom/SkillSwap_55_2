import type { Gender } from '@/entities/user'

export type RoleValue = 'all' | 'learn' | 'teach'

export type GenderValue = 'any' | Gender

export type CatalogFilters = {
  role: RoleValue
  selectedSkills: string[]
  gender: GenderValue
  selectedCities: string[]
}

export const INITIAL_CATALOG_FILTERS: CatalogFilters = {
  role: 'all',
  selectedSkills: [],
  gender: 'any',
  selectedCities: [],
}
