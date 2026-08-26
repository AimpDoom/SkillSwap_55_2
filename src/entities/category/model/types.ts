export interface SkillCategory {
  id: string
  name: string
  subcategories: SkillSubcategory[]
}

export interface SkillSubcategory {
  id: string
  name: string
  categoryId: string
}
