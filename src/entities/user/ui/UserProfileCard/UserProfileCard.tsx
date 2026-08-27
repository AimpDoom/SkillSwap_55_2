import { Avatar } from '@/shared/ui/Avatar/Avatar'
import { Tag, type TagVariant } from '@/shared/ui/Tag/Tag'
import type { User } from '@/entities/user/model/types'
import styles from './UserProfileCard.module.css'

interface UserProfileCardProps {
  user: User
  teachSkills: Array<{ name: string; variant: TagVariant }>
  learnSkills: Array<{ name: string; variant: TagVariant }>
}

export function UserProfileCard({ user, teachSkills = [], learnSkills = [] }: UserProfileCardProps) {
  const { name, avatarUrl, birthDate, cityId, about } = user

  // Вспомогательная функция для расчета возраста на основе birthDate (ГГГГ-ММ-ДД)
  const calculateAge = (dateString: string): number => {
    const today = new Date()
    const birthDateObj = new Date(dateString)
    let age = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--
    }
    return age
  }

  const age = birthDate ? calculateAge(birthDate) : null

  // Хелпер для правильного склонения слова "год/года/лет" в русском языке
  const getAgeString = (years: number): string => {
    const lastDigit = years % 10
    const lastTwoDigits = years % 100

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return `${years} лет`
    if (lastDigit === 1) return `${years} год`
    if (lastDigit >= 2 && lastDigit <= 4) return `${years} года`
    return `${years} лет`
  }

  return (
    <article className={styles.card} aria-label={`Профиль пользователя ${name}`}>
      {/* Шапка карточки — информация о пользователе */}
      <section className={styles.header}>
        <Avatar src={avatarUrl || undefined} alt={name} className={styles.avatar} />
        
        <div className={styles.userInfo}>
          <h2 className={styles.name}>{name}</h2>
          <div className={styles.meta}>
            {cityId && <span className={styles.metaItem}>{cityId}</span>}
            {age && <span className={styles.metaItem}>{getAgeString(age)}</span>}
          </div>
        </div>
      </section>

      {/* Описание пользователя */}
      {about && (
        <section className={styles.aboutSection}>
          <p className={styles.aboutText}>{about}</p>
        </section>
      )}

      {/* Блоки навыков */}
      <section className={styles.skillsSection}>
        {/* Блок "Может научить" */}
        {teachSkills.length > 0 && (
          <div className={styles.skillsBlock}>
            <h3 className={styles.skillsTitle}>Может научить</h3>
            <div className={styles.tagsContainer}>
              {teachSkills.map((skill, idx) => (
                <Tag key={idx} variant={skill.variant}>
                  {skill.name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Блок "Хочет научиться" */}
        {learnSkills.length > 0 && (
          <div className={styles.skillsBlock}>
            <h3 className={styles.skillsTitle}>Хочет научиться</h3>
            <div className={styles.tagsContainer}>
              {learnSkills.map((skill, idx) => (
                <Tag key={idx} variant={skill.variant}>
                  {skill.name}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  )
}
