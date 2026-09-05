import { useState, useEffect } from 'react'
import styles from './can-teach.module.css'
import { fetchSkillById } from '@/api/skills'
import { Tag, TagVariant } from '@/shared/ui/Tag'
import { Text } from '@/shared/ui/Text'
import clsx from 'clsx'
import { CardVariant } from '../UserCard'

interface CanTeachProperties {
  skillId: string
  header: string
  variant: CardVariant
}

export function CanTeach({ skillId, header, variant }: CanTeachProperties) {
  const [skill, setSkill] = useState<Awaited<ReturnType<typeof fetchSkillById>> | null>(null)
  useEffect(() => {
    const fetchSkills = async () => {
      const skillData = await fetchSkillById(skillId)
      setSkill(skillData)
    }

    fetchSkills()
  }, [skillId])

  return (
    <div
      className={clsx(styles.badgeContainer, variant === 'profile' && styles.profileBadgeContainer)}
    >
      <Text variant="h4" className={styles.mainText}>
        {header}
      </Text>
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
