import styles from './like-button.module.css'

import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton } from '@/shared/ui/IconButton'
import LikedIcon from '@/shared/assets/icons/like-filled.svg'
import UnlikedIcon from '@/shared/assets/icons/like.svg'
import { Text } from '@/shared/ui/Text'
import { FAVORITES_CHANGED_EVENT, isUserFavorite, toggleFavoriteUser } from '@/features/favorites'
import { getAuthUser } from '@/features/auth'
import { ROUTES } from '@/shared/lib/constants'
import { useEffect, useState } from 'react'

type LikeButtonProps = {
  userId: string
  likeCount: number
}

export function LikeButton({ userId, likeCount }: LikeButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const [liked, setLiked] = useState<boolean>(() => isUserFavorite(userId))
  useEffect(() => {
    const handleFavoritesChanged = () => {
      setLiked(isUserFavorite(userId))
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged)

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged)
    }
  }, [userId])

  const handleLikeClick = () => {
    if (!getAuthUser()) {
      navigate(ROUTES.LOGIN, {
        state: {
          from: location.pathname + location.search + location.hash,
        },
      })

      return
    }

    const newLikedState = toggleFavoriteUser(userId)
    setLiked(newLikedState)
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
      <Text variant="caption">{displayedLikeCount}</Text>
    </div>
  )
}
