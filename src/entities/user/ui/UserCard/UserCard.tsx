import { LikeButton } from './LikeButton/LikeButton'
import { WantToLearn } from './WantToLearn/WantToLearn'
import { UserInfo } from './UserInfo/UserInfo'
import { CanTeach } from './CanTeach/CanTeach'
import styles from './user-card.module.css'
import type { SwapRequest } from '@/entities/request/model/types'
import type { User } from '@/entities/user/model/types'
import { getAuthUser } from '@/features/auth/model/authUtils'
import clockIcon from '@/shared/assets/icons/clock.svg'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'
import { Text } from '@/shared/ui/Text'
import clsx from 'clsx'

export type CardVariant = "catalog" | "profile";

interface UserCardProps {
  user: User,
  variant?: CardVariant
} 

export const UserCard = ({ user, variant = 'catalog' }: UserCardProps) => {
  const authUser = getAuthUser()

  let isExchangeRequested = false

  if (authUser) {
    try {
      const rawRequests = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)
      const requests: SwapRequest[] = rawRequests ? JSON.parse(rawRequests) : []

      isExchangeRequested = requests.some(
        (request) =>
          request.fromUserId === authUser.id &&
          request.toUserId === user.id &&
          request.skillId === user.teachSkillId,
      )
    } catch {
      isExchangeRequested = false
    }
  }

  return (
    <article 
      className={clsx(styles.userCard, variant === "profile" && styles.userProfileCard) } 
      aria-label={(variant === "catalog" ? 
        `карточка пользователя ${user.name}` : 
        `профиль пользователя ${user.name}`)}>
      <div className={styles.cardTopBlock}>
        <Avatar
          src={user.avatarUrl || ''}
          alt={`Изображение пользователя ${user.name}`}
          className={styles.userImage}
        />
        <UserInfo name={user.name} cityId={user.cityId} birthDate={user.birthDate} />
        {variant === "catalog" && <LikeButton userId={user.id} likeCount={user.likesCount} />}
      </div>
      {(variant === "profile") && 
         <Text variant="body" as="p" className={styles.aboutText}>
          {user.about}
        </Text>
      }
      <div className={styles.cardMiddleBlock}>
        <CanTeach variant={variant} skillId={user.teachSkillId} header= {`Может научить${variant === 'catalog'? ':' : ''}`} />
        <WantToLearn variant={variant} skillsIds={user.learnSubcategoryIds} header={`Хочет научиться${variant === 'catalog'? ':' : ''}`} />
      </div>
      {variant === 'catalog' &&
        (isExchangeRequested ? (
          <div className={styles.exchangeRequested} aria-label="Обмен предложен">
            <img className={styles.statusIcon} src={clockIcon} alt="" aria-hidden="true" />
            <Text variant="body" as="span">
              Обмен предложен
            </Text>
          </div>
        ) : (
          <Button
            to={ROUTES.SKILL.replace(':id', user.teachSkillId)}
            className={styles.button}
            variant="primary"
          >
            Подробнее
          </Button>
        ))}
    </article>
  )
}
