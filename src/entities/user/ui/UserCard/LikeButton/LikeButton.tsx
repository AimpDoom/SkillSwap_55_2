import { useState } from 'react'
import styles from './like-button.module.css'
import { IconButton } from '@/shared/ui/IconButton'

import LikedIcon from '@/shared/assets/icons/like-filled.svg'
import UnlikedIcon from '@/shared/assets/icons/like.svg'

type LikeButtonProps = {
  isLiked: boolean
  likeCount: number
}

export function LikeButton({ isLiked, likeCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked)

  const handleLikeClick = () => {
    setLiked((prev) => !prev)
  }

  return (
    <div className={styles.likeContainer}>
      <IconButton
        icon={<img src={liked ? LikedIcon : UnlikedIcon} alt="" />}
        ariaLabel={liked ? 'Убрать лайк' : 'Поставить лайк'}
        onClick={handleLikeClick}
        aria-pressed={liked}
        className={styles.like}
      />

      <span>{likeCount}</span>
    </div>
  )
}
