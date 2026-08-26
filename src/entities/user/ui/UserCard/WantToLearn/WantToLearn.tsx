import { useState, useEffect } from 'react'

import styles from './want-to-learn.module.css'

import { fetchCategories } from '@/api/skills'
import type { SkillSubcategory } from '@/entities/category/model/types'
import { Tag, TagVariant } from '@/shared/ui/Tag/Tag'

interface WantToLearnProperties {
  skillsIds: string[]
  header: string
}

export function WantToLearn({ skillsIds, header }: WantToLearnProperties) {
  const [skillList, setSkillList] = useState<SkillSubcategory[]>([])

  useEffect(() => {
    const fetchSkills = async () => {
      const categories = await fetchCategories()
      const subcategories = categories.flatMap((category) => category.subcategories)

      const skillData = skillsIds
        .map((skillId) => subcategories.find((subcategory) => subcategory.id === skillId))
        .filter((subcategory): subcategory is SkillSubcategory => subcategory !== undefined)

      setSkillList(skillData)
    }

    fetchSkills()
  }, [skillsIds])

  return (
    <div className={styles.badgeContainer}>
      <h4 className={styles.mainText}>{header}</h4>
      <div className={styles.skillsContainer}>
        {skillList.map((skill, index) => {
          if (index < 2) {
            return (
              <Tag
                variant={skill.categoryId as TagVariant}
                className={styles.skillBadge}
                key={skill.id}
                title={skill.name}
              >
                {skill.name}
              </Tag>
            )
          }

          return null
        })}

        {skillsIds.length - 2 > 0 && (
          <Tag className={styles.skillBadge}>+{skillsIds.length - 2}</Tag>
        )}
      </div>
    </div>
  )
}
