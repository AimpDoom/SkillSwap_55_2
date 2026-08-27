import { Avatar } from '@/shared/ui/Avatar'
import { Tag, type TagVariant } from '@/shared/ui/Tag'
import { Text } from '@/shared/ui/Text'

import styles from './UserProfileCard.module.css'

interface SkillTag {
  name: string
  variant: TagVariant
}

interface UserProfileCardProps {
  avatarUrl?: string | null
  name: string
  city: string
  age: number
  about?: string
  teachSkills?: SkillTag[]
  learnSkills?: SkillTag[]
}

function getAgeString(age: number) {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${age} лет`
  }

  if (lastDigit === 1) {
    return `${age} год`
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`
  }

  return `${age} лет`
}

export function UserProfileCard({
  avatarUrl,
  name,
  city,
  age,
  about,
  teachSkills = [],
  learnSkills = [],
}: UserProfileCardProps) {
  const hasSkills = teachSkills.length > 0 || learnSkills.length > 0

  return (
    <article
      className={styles.card}
      aria-label={`Профиль пользователя ${name}`}
    >
      <div className={styles.header}>
        <Avatar
          src={avatarUrl ?? undefined}
          alt={name}
          className={styles.avatar}
        />

        <div className={styles.userInfo}>
          <Text variant="h2" as="h2" className={styles.name}>
            {name}
          </Text>

          <Text variant="caption" as="p" className={styles.meta}>
            {city}, {getAgeString(age)}
          </Text>
        </div>
      </div>

      {about && (
        <Text variant="body" as="p" className={styles.aboutText}>
          {about}
        </Text>
      )}

      {hasSkills && (
        <div className={styles.skillsSection}>
          {teachSkills.length > 0 && (
            <div className={styles.skillsBlock}>
              <Text variant="h4" as="h3" className={styles.skillsTitle}>
                Может научить
              </Text>

              <div className={styles.tagsContainer}>
                {teachSkills.map((skill) => (
                  <Tag
                    key={`${skill.variant}-${skill.name}`}
                    variant={skill.variant}
                  >
                    {skill.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {learnSkills.length > 0 && (
            <div className={styles.skillsBlock}>
              <Text variant="h4" as="h3" className={styles.skillsTitle}>
                Хочет научиться
              </Text>

              <div className={styles.tagsContainer}>
                {learnSkills.map((skill) => (
                  <Tag
                    key={`${skill.variant}-${skill.name}`}
                    variant={skill.variant}
                  >
                    {skill.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}