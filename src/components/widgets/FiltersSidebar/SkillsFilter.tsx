import { useCategories } from '@/entities/category'
import chevronDown from '@/shared/assets/icons/chevron-down.svg'
import chevronUp from '@/shared/assets/icons/chevron-up.svg'
import checkboxDone from '@/shared/assets/icons/checkbox-done.svg'
import checkboxEmpty from '@/shared/assets/icons/checkbox-empty.svg'
import checkboxRemove from '@/shared/assets/icons/checkbox-remove.svg'
import { Checkbox } from '@/shared/ui/Checkbox'

import styles from './FiltersSidebar.module.css'

type SkillsFilterProps = {
  selectedSkills: string[]
  openCategory: string | null
  onToggleSkill: (skill: string) => void
  onToggleOpen: (category: string | null) => void
}

export const SkillsFilter = ({
  selectedSkills,
  openCategory,
  onToggleSkill,
  onToggleOpen,
}: SkillsFilterProps) => {
  const { categories } = useCategories()

  return (
    <section className={styles.group}>
      <h3 className={styles.sectionTitle}>Навыки</h3>

      <div className={styles.options}>
        {categories.map((category) => {
          const isOpen = openCategory === category.id

          const selectedCount = category.subcategories.filter((subcategory) =>
            selectedSkills.includes(subcategory.id),
          ).length

          const isChecked = selectedCount === category.subcategories.length
          const isPartial = selectedCount > 0 && !isChecked

          const handleCategoryClick = (e: React.MouseEvent) => {
            e.stopPropagation()

            if (isChecked || isPartial) {
              category.subcategories.forEach((subcategory) => {
                if (selectedSkills.includes(subcategory.id)) {
                  onToggleSkill(subcategory.id)
                }
              })
            } else {
              category.subcategories.forEach((subcategory) => {
                if (!selectedSkills.includes(subcategory.id)) {
                  onToggleSkill(subcategory.id)
                }
              })
            }
          }

          return (
            <div className={styles.category} key={category.id}>
              <div className={styles.categoryRow}>
                <button
                  className={styles.categoryCheckbox}
                  type="button"
                  onClick={handleCategoryClick}
                  aria-label={`Выбрать категорию ${category.name}`}
                >
                  <img
                    src={isChecked ? checkboxDone : isPartial ? checkboxRemove : checkboxEmpty}
                    alt=""
                    aria-hidden="true"
                  />
                </button>

                <button
                  className={styles.categoryToggle}
                  type="button"
                  onClick={() => onToggleOpen(isOpen ? null : category.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.optionText}>{category.name}</span>

                  <span className={styles.chevron} aria-hidden="true">
                    <img
                      className={styles.chevronIcon}
                      src={isOpen ? chevronUp : chevronDown}
                      alt=""
                    />
                  </span>
                </button>
              </div>

              {isOpen && (
                <div className={styles.subcategories}>
                  {category.subcategories.map((subcategory) => (
                    <Checkbox
                      key={subcategory.id}
                      className={styles.option}
                      checked={selectedSkills.includes(subcategory.id)}
                      label={subcategory.name}
                      onChange={() => onToggleSkill(subcategory.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
