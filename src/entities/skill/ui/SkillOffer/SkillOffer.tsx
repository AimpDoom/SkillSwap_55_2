import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type { Skill } from '../../model/types'

import ChevronRightIcon from '@/shared/assets/icons/chevron-right.svg?react'
import ClockIcon from '@/shared/assets/icons/clock.svg?react'
import EditIcon from '@/shared/assets/icons/edit.svg?react'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import LikeFilledIcon from '@/shared/assets/icons/like-filled.svg?react'
import MoreIcon from '@/shared/assets/icons/more-square.svg?react'
import ShareIcon from '@/shared/assets/icons/share.svg?react'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Text } from '@/shared/ui/Text'
import { FAVORITES_CHANGED_EVENT, isUserFavorite, toggleFavoriteUser } from '@/features/favorites'
import { getAuthUser } from '@/features/auth'
import { ROUTES } from '@/shared/lib/constants'

import styles from './SkillOffer.module.css'
import clsx from 'clsx'

interface SkillOfferProps {
  skill: Pick<Skill, 'title' | 'description' | 'imageUrls'>
  userId?: string
  variant: 'confirmation' | 'default' | 'requested' | 'profile'
  categoryName: string
  subcategoryName: string
  onEdit?: () => void
  onDone?: () => void
  onOfferExchange?: () => void
  onShare?: () => void
  onMore?: () => void
}

const MAX_THUMBNAILS = 3

export function SkillOffer({
  skill,
  userId,
  variant,
  categoryName,
  subcategoryName,
  onEdit,
  onDone,
  onOfferExchange,
  onShare,
  onMore,
}: SkillOfferProps) {
  const { title, description, imageUrls = [] } = skill

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const [liked, setLiked] = useState(() => (userId ? isUserFavorite(userId) : false))

  useEffect(() => {
    if (!userId) return

    const handleFavoritesChanged = () => {
      setLiked(isUserFavorite(userId))
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged)

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged)
    }
  }, [userId])

  const hasImages = imageUrls.length > 0
  const hasSeveralImages = imageUrls.length > 1
  const isGalleryInteractive = variant !== 'confirmation'

  const mainImage = hasImages ? imageUrls[activeImageIndex] : ''

  const thumbnails = imageUrls
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => index !== activeImageIndex)

  const thumbnailsToShow = thumbnails.slice(0, MAX_THUMBNAILS)

  const remainingImagesCount = Math.max(thumbnails.length - MAX_THUMBNAILS, 0)

  const handlePrevImage = () => {
    if (!hasSeveralImages) return

    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1,
    )
  }

  const handleNextImage = () => {
    if (!hasSeveralImages) return

    setActiveImageIndex((currentIndex) =>
      currentIndex === imageUrls.length - 1 ? 0 : currentIndex + 1,
    )
  }

  const handleFavorite = () => {
    if (!userId) return

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

  return (
    <article
      className={clsx(styles.card, variant === 'profile' && styles.profileCard)}
      aria-label="Предложение навыка"
    >
      {variant === 'confirmation' && (
        <header className={styles.confirmationHeaderBlock}>
          <Text variant="h2" className={styles.confirmationTitle}>
            Ваше предложение
          </Text>

          <Text variant="body" className={styles.confirmationSubtitle}>
            Пожалуйста, проверьте и подтвердите правильность данных
          </Text>
        </header>
      )}

      <div className={styles.cardContent}>
        <section
          className={`${styles.infoBlock} ${
            variant === 'default' || variant === 'requested' ? styles.infoBlockWithActions : ''
          }`}
        >
          <Text variant="h1" as="h2" className={styles.title}>
            {title}
          </Text>

          <Text variant="caption" as="p" className={styles.categoryPath}>
            {categoryName} / {subcategoryName}
          </Text>

          <Text variant="body" className={styles.description}>
            {description}
          </Text>

          <div className={styles.actionsArea}>
            {variant === 'confirmation' && (
              <div className={styles.btnGroup}>
                <Button variant="secondary" onClick={onEdit} className={styles.editBtn}>
  Редактировать
  <EditIcon className={styles.btnIcon} aria-hidden="true" />
</Button>

                <Button variant="primary" onClick={onDone} className={styles.doneBtn}>
                  Готово
                </Button>
              </div>
            )}

            {variant === 'default' && (
              <Button variant="primary" onClick={onOfferExchange} className={styles.fullWidthBtn}>
                Предложить обмен
              </Button>
            )}

            {variant === 'requested' && (
              <div className={styles.statusBadge}>
                <ClockIcon className={styles.statusIcon} aria-hidden="true" />

                <Text variant="body" as="span">
                  Обмен предложен
                </Text>
              </div>
            )}
          </div>
        </section>

        <section className={styles.mediaColumn}>
          {(variant === 'default' || variant === 'requested') && (
            <div className={styles.topIconActions}>
              <IconButton
                icon={
                  liked ? (
                    <LikeFilledIcon aria-hidden="true" />
                  ) : (
                    <LikeIcon className={styles.actionIcon} aria-hidden="true" />
                  )
                }
                ariaLabel={liked ? 'Убрать из избранного' : 'Добавить в избранное'}
                aria-pressed={liked}
                onClick={handleFavorite}
              />

              <IconButton
                icon={<ShareIcon className={styles.actionIcon} aria-hidden="true" />}
                ariaLabel="Поделиться навыком"
                onClick={onShare}
              />

              <IconButton
                icon={<MoreIcon className={styles.actionIcon} aria-hidden="true" />}
                ariaLabel="Дополнительное меню"
                onClick={onMore}
              />
            </div>
          )}

          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              {mainImage ? (
                <img src={mainImage} alt={title} className={styles.mainImage} />
              ) : (
                <div
                  className={styles.noImageFallback}
                  aria-label="Изображение навыка отсутствует"
                />
              )}

              {isGalleryInteractive && hasSeveralImages && (
                <>
                  <button
                    type="button"
                    className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
                    onClick={handlePrevImage}
                    aria-label="Предыдущее изображение"
                  >
                    <ChevronRightIcon
  className={styles.arrowIcon}
  aria-hidden="true"
/>
                  </button>

                  <button
                    type="button"
                    className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
                    onClick={handleNextImage}
                    aria-label="Следующее изображение"
                  >
                    <ChevronRightIcon
  className={styles.arrowIcon}
  aria-hidden="true"
/>
                  </button>
                </>
              )}
            </div>

            {hasSeveralImages && (
              <div className={styles.thumbnailsTrack}>
                {thumbnailsToShow.map(({ image, index }, thumbnailIndex) => {
                  const thumbnailContent = (
                    <>
                      <img src={image} alt="" className={styles.thumbnailImg} />

                      {thumbnailIndex === MAX_THUMBNAILS - 1 && remainingImagesCount > 0 && (
                        <div className={styles.remainingOverlay}>
                          <Text variant="body" as="span" className={styles.remainingText}>
                            +{remainingImagesCount}
                          </Text>
                        </div>
                      )}
                    </>
                  )

                  return isGalleryInteractive ? (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={styles.thumbnailButton}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Открыть изображение ${index + 1}`}
                    >
                      {thumbnailContent}
                    </button>
                  ) : (
                    <div key={`${image}-${index}`} className={styles.thumbnailButton}>
                      {thumbnailContent}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}
