import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getAuthUser } from '@/features/auth'
import { FAVORITES_CHANGED_EVENT, isUserFavorite, toggleFavoriteUser } from '@/features/favorites'
import { ROUTES } from '@/shared/lib/constants'
import { IconButton } from '@/shared/ui/IconButton'
import { Text } from '@/shared/ui/Text'

import styles from './like-button.module.css'

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

  const heartIcon = (
    <span className={`${styles.heartIcon} ${liked ? styles.heartLiked : styles.heartUnliked}`} />
  )

  return (
    <div className={styles.likeContainer}>
      <IconButton
        icon={heartIcon}
        ariaLabel={liked ? 'Убрать лайк' : 'Поставить лайк'}
        onClick={handleLikeClick}
        aria-pressed={liked}
        className={styles.like}
      />

      <Text variant="caption">{displayedLikeCount}</Text>
    </div>
  )
}
