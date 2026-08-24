import { useState, useEffect } from 'react'
import styles from './can-teach.module.css'
import { fetchSkillById } from '@/api/skills'
import { Tag, TagVariant } from '@/shared/ui/Tag'

interface CanTeachProperties {
  skillId: string
  header: string
}

export function CanTeach({ skillId, header }: CanTeachProperties) {
  const [skill, setSkill] = useState<Awaited<ReturnType<typeof fetchSkillById>> | null>(null)
  useEffect(() => {
    const fetchSkills = async () => {
      const skillData = await fetchSkillById(skillId)
      setSkill(skillData)
    }

  fetchSkills()
}, [skillId])

  return (
    <div className={styles.badgeContainer}>
      <h4 className={styles.mainText}>{header}</h4>
      <div className={styles.skillsContainer}>
        {skill && (
          <Tag variant={skill.categoryId as TagVariant} title={skill.title}>
            {skill?.title}
          </Tag>
        )}
      </div>
    </div>
  )
}
