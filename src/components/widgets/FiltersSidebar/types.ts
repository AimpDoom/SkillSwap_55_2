export type RoleValue = 'all' | 'learn' | 'teach'

export type GenderValue = 'any' | 'male' | 'female'

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