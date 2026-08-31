import { useState, useEffect } from 'react'
import styles from './want-to-learn.module.css'
import { fetchCategories } from '@/api/skills'
import type { SkillSubcategory } from '@/entities/category/model/types'
import { Tag, TagVariant } from '@/shared/ui/Tag/Tag'
import { Text } from '@/shared/ui/Text'
import { CardVariant } from '../UserCard'
import clsx from 'clsx'

interface WantToLearnProperties {
  skillsIds: string[]
  header: string,
  variant: CardVariant
}

export function WantToLearn({ skillsIds, header, variant }: WantToLearnProperties) {
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
    <div className={clsx(styles.badgeContainer, variant === "profile" && styles.badgeProfileContainer)}>
      <Text variant='h4' className={styles.mainText}>{header}</Text>
      <div className={clsx( styles.skillsContainer, 
        variant === 'catalog' && styles.skillsCatalogContainer,
        variant === 'profile' && styles.skillsProfileContainer)}>
        {skillList.map((skill, index) => {
          if (index < 2 || variant === 'profile') {
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

        {(skillsIds.length - 2 > 0 && variant === 'catalog') && (
          <Tag className={styles.skillBadge}>+{skillsIds.length - 2}</Tag>
        )}
      </div>
    </div>
  )
}
