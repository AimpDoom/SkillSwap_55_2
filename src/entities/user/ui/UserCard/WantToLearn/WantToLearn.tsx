import { useState, useEffect } from 'react'
import styles from './want-to-learn.module.css'
import { fetchSubcategory } from '@/api/skills'
import { Tag, TagVariant } from '@/shared/ui/Tag/Tag'

interface WantToLearnProperties {
  skillsIds: string[]
  header: string
}

export function WantToLearn({ skillsIds, header }: WantToLearnProperties) {
  const [skillList, setSkillList] = useState<Awaited<ReturnType<typeof fetchSubcategory>>[]>([])
  useEffect(() => {
    const fetchSkills = async () => {
      const skillData = await Promise.all(
        skillsIds.map(async (skillId) => {
          const skill = await fetchSubcategory(skillId)
          return skill
        }),
      )
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
                variant={skill?.categoryId as TagVariant}
                className={styles.skillBadge}
                key={skill?.id}
                title={skill?.name}
              >
                {skill?.name}
              </Tag>
            )
          } else {
            return null
          }
        })}
        {skillsIds.length - 2 > 0 && (
          <Tag className={styles.skillBadge}>+{skillsIds.length - 2}</Tag>
        )}
      </div>
    </div>
  )
}
