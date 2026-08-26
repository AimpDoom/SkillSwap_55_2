import { LikeButton } from './LikeButton/LikeButton'
import { WantToLearn } from './WantToLearn/WantToLearn'
import { UserInfo } from './UserInfo/UserInfo'
import { CanTeach } from './CanTeach/CanTeach'
import styles from './user-card.module.css'
import type { User } from '@/entities/user/model/types'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { ROUTES } from '@/shared/lib/constants'

export const UserCard = ({ user }: { user: User }) => {
  return (
    <div className={styles.userCard}>
      <div className={styles.cardTopBlock}>
        <Avatar
          src={user.avatarUrl || ''}
          alt={`Изображение пользователя ${user.name}`}
          className={styles.userImage}
        />
        <UserInfo name={user.name} cityId={user.cityId} birthDate={user.birthDate} />
        <LikeButton userId={user.id} likeCount={user.likesCount} />
      </div>
      <div className={styles.cardMiddleBlock}>
        <CanTeach skillId={user.teachSkillId} header="Может научить:" />
        <WantToLearn skillsIds={user.learnSubcategoryIds} header="Хочет научиться:" />
      </div>
      <Button
        to={ROUTES.SKILL.replace(':id', user.teachSkillId)}
        className={styles.button}
        variant="primary"
      >
        Подробнее
      </Button>
    </div>
  )
}
