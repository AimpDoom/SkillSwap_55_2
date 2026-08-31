import { useState } from 'react'

import type { Skill } from '../../model/types'

import chevronRightIcon from '@/shared/assets/icons/chevron-right.svg'
import clockIcon from '@/shared/assets/icons/clock.svg'
import editIcon from '@/shared/assets/icons/edit.svg'
import likeIcon from '@/shared/assets/icons/like.svg'
import moreIcon from '@/shared/assets/icons/more-square.svg'
import shareIcon from '@/shared/assets/icons/share.svg'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Text } from '@/shared/ui/Text'

import styles from './SkillOffer.module.css'

interface SkillOfferProps {
  skill: Pick<Skill, 'title' | 'description' | 'imageUrls'>
  variant: 'confirmation' | 'default' | 'requested'
  categoryName: string
  subcategoryName: string
  onEdit?: () => void
  onDone?: () => void
  onOfferExchange?: () => void
  onShare?: () => void
  onFavorite?: () => void
  onMore?: () => void
}

const MAX_THUMBNAILS = 3

export function SkillOffer({
  skill,
  variant,
  categoryName,
  subcategoryName,
  onEdit,
  onDone,
  onOfferExchange,
  onShare,
  onFavorite,
  onMore,
}: SkillOfferProps) {
  const { title, description, imageUrls = [] } = skill

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const hasImages = imageUrls.length > 0
  const hasSeveralImages = imageUrls.length > 1
  const isGalleryInteractive = variant !== 'confirmation'

  const mainImage = hasImages ? imageUrls[activeImageIndex] : ''

  const thumbnails = imageUrls
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => index !== activeImageIndex)

  const thumbnailsToShow = thumbnails.slice(0, MAX_THUMBNAILS)

  const remainingImagesCount = Math.max(
    thumbnails.length - MAX_THUMBNAILS,
    0,
  )

  const handlePrevImage = () => {
    if (!hasSeveralImages) return

    setActiveImageIndex((currentIndex) =>
      currentIndex === 0
        ? imageUrls.length - 1
        : currentIndex - 1,
    )
  }

  const handleNextImage = () => {
    if (!hasSeveralImages) return

    setActiveImageIndex((currentIndex) =>
      currentIndex === imageUrls.length - 1
        ? 0
        : currentIndex + 1,
    )
  }

  return (
    <article
      className={styles.card}
      aria-label="Предложение навыка"
    >
      {variant === 'confirmation' && (
        <header className={styles.confirmationHeaderBlock}>
          <Text variant="h2" className={styles.confirmationTitle}>
            Ваше предложение
          </Text>

          <Text
            variant="body"
            className={styles.confirmationSubtitle}
          >
            Пожалуйста, проверьте и подтвердите правильность данных
          </Text>
        </header>
      )}

      <div className={styles.cardContent}>
        <section
          className={`${styles.infoBlock} ${
            variant !== 'confirmation'
              ? styles.infoBlockWithActions
              : ''
          }`}
        >
          <Text
            variant="h1"
            as="h2"
            className={styles.title}
          >
            {title}
          </Text>

          <Text
            variant="caption"
            as="p"
            className={styles.categoryPath}
          >
            {categoryName} / {subcategoryName}
          </Text>

          <Text
            variant="body"
            className={styles.description}
          >
            {description}
          </Text>

          <div className={styles.actionsArea}>
            {variant === 'confirmation' && (
              <div className={styles.btnGroup}>
                <Button
                  variant="secondary"
                  onClick={onEdit}
                  className={styles.editBtn}
                >
                  Редактировать
                  <img
                    src={editIcon}
                    alt=""
                    className={styles.btnIcon}
                  />
                </Button>

                <Button
                  variant="primary"
                  onClick={onDone}
                  className={styles.doneBtn}
                >
                  Готово
                </Button>
              </div>
            )}

            {variant === 'default' && (
              <Button
                variant="primary"
                onClick={onOfferExchange}
                className={styles.fullWidthBtn}
              >
                Предложить обмен
              </Button>
            )}

            {variant === 'requested' && (
              <div className={styles.statusBadge}>
                <img
                  src={clockIcon}
                  alt=""
                  className={styles.statusIcon}
                />

                <Text variant="body" as="span">
                  Обмен предложен
                </Text>
              </div>
            )}
          </div>
        </section>

        <section className={styles.mediaColumn}>
          {variant !== 'confirmation' && (
            <div className={styles.topIconActions}>
              <IconButton
                icon={<img src={likeIcon} alt="" />}
                ariaLabel="Добавить в избранное"
                onClick={onFavorite}
              />

              <IconButton
                icon={<img src={shareIcon} alt="" />}
                ariaLabel="Поделиться навыком"
                onClick={onShare}
              />

              <IconButton
                icon={<img src={moreIcon} alt="" />}
                ariaLabel="Дополнительное меню"
                onClick={onMore}
              />
            </div>
          )}

          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={title}
                  className={styles.mainImage}
                />
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
                    <img
                      src={chevronRightIcon}
                      alt=""
                    />
                  </button>

                  <button
                    type="button"
                    className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
                    onClick={handleNextImage}
                    aria-label="Следующее изображение"
                  >
                    <img
                      src={chevronRightIcon}
                      alt=""
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
                      <img
                        src={image}
                        alt=""
                        className={styles.thumbnailImg}
                      />

                      {thumbnailIndex ===
                        MAX_THUMBNAILS - 1 &&
                        remainingImagesCount > 0 && (
                          <div
                            className={
                              styles.remainingOverlay
                            }
                          >
                            <Text
                              variant="body"
                              as="span"
                              className={
                                styles.remainingText
                              }
                            >
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
