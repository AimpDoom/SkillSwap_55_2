import styles from './like-button.module.css'

import { IconButton } from '@/shared/ui/IconButton'
import LikedIcon from '@/shared/assets/icons/like-filled.svg'
import UnlikedIcon from '@/shared/assets/icons/like.svg'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

type LikeButtonProps = {
  userId: string
  likeCount: number
}

export function LikeButton({ userId, likeCount }: LikeButtonProps) {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    LOCAL_STORAGE_KEYS.FAVORITES,
    [],
  )

  const liked = favorites.includes(userId)

  const handleLikeClick = () => {
    setFavorites((prev) =>
      liked ? prev.filter((id) => id !== userId) : [...prev, userId],
    )
  }

  const displayedLikeCount = likeCount + Number(liked)

  return (
    <div className={styles.likeContainer}>
      <IconButton
        icon={<img src={liked ? LikedIcon : UnlikedIcon} alt="" />}
        ariaLabel={liked ? 'Убрать лайк' : 'Поставить лайк'}
        onClick={handleLikeClick}
        aria-pressed={liked}
        className={styles.like}
      />
      <span>{displayedLikeCount}</span>
    </div>
  )
}