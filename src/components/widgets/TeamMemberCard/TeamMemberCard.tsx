import { Text } from '@/shared/ui/Text'

import styles from './TeamMemberCard.module.css'

type TeamMemberCardProps = {
  name: string
  role: string
  about: string
  github: string
  githubUsername: string
}

export function TeamMemberCard({ name, role, about, github, githubUsername }: TeamMemberCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img
            className={styles.avatar}
            src={`https://github.com/${githubUsername}.png`}
            alt={name}
          />
        </div>

        <div className={styles.info}>
          <Text variant="h3" as="h3" className={styles.name}>
            {name}
          </Text>

          <Text variant="body" as="p" className={styles.role}>
            Роль в проекте: {role}
          </Text>
        </div>
      </div>

      <div className={styles.about}>
        <Text variant="body" as="h4" className={styles.subtitle}>
          Обо мне:
        </Text>

        <Text variant="body" as="p" className={styles.description}>
          {about}
        </Text>
      </div>

      <div className={styles.contacts}>
        <Text variant="body" as="h4" className={styles.subtitle}>
          Связаться со мной:
        </Text>

        <a className={styles.link} href={github} target="_blank" rel="noopener noreferrer">
          <span className={styles.githubIcon} aria-hidden="true" />

          <span>{github}</span>
        </a>
      </div>
    </article>
  )
}
