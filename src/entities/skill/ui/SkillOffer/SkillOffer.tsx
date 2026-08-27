import { useState } from 'react'
import type { Skill } from '../../model/types'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Text } from '@/shared/ui/Text'

import arrowLeftIcon from '@/shared/assets/icons/arrow-square-left.svg'
import arrowRightIcon from '@/shared/assets/icons/arrow-square-right.svg'
import shareIcon from '@/shared/assets/icons/share.svg'
import likeIcon from '@/shared/assets/icons/like.svg'
import moreIcon from '@/shared/assets/icons/more-square.svg'
import editIcon from '@/shared/assets/icons/edit.svg'
import clockIcon from '@/shared/assets/icons/clock.svg'

import styles from './SkillOffer.module.css'

interface SkillOfferProps {
  skill: Skill
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

  const MAX_THUMBNAILS = 3
  const hasImages = imageUrls.length > 0
  const mainImage = hasImages ? imageUrls[activeImageIndex] : ''

  const thumbnailsToShow = imageUrls.slice(0, MAX_THUMBNAILS)
  const remainingImagesCount = imageUrls.length - MAX_THUMBNAILS

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1))
  }

  return (
    <article className={styles.card} aria-label="Предложение навыка">
      
      {/* Вариант confirmation: заголовок и подзаголовок вынесены наверх всей карточки */}
      {variant === 'confirmation' && (
        <header className={styles.confirmationHeaderBlock}>
          <Text variant="h2" className={styles.confirmationTitle}>
            Ваше предложение
          </Text>
          <Text variant="body" className={styles.confirmationSubtitle}>
            Пожалуйста, проверьте и подтвердите правильность данных.
          </Text>
        </header>
      )}

      <div className={styles.cardContent}>
        {/* Левая секция — Текстовая информация */}
        <section className={styles.infoBlock}>
          
          {/* Категория и подкатегория выведены одной строкой через слеш */}
          <div className={styles.metaRow}>
            <Text variant="caption" className={styles.categoryPath}>
              {categoryName} / {subcategoryName}
            </Text>
          </div>

          <Text variant="h2" className={styles.title}>
            {title}
          </Text>
          
          <Text variant="body" className={styles.description}>
            {description}
          </Text>

          <div className={styles.actionsArea}>
            {variant === 'confirmation' && (
              <div className={styles.btnGroup}>
                <Button variant="secondary" onClick={onEdit} className={styles.editBtn}>
                  <img src={editIcon} alt="" className={styles.btnIcon} />
                  Редактировать
                </Button>
                <Button variant="primary" onClick={onDone} className={styles.doneBtn}>
                  Готово
                </Button>
              </div>
            )}

            {variant === 'default' && (
              <div className={styles.defaultFooter}>
                {/* Кнопка растянута по всей доступной ширине текстового блока */}
                <Button variant="primary" onClick={onOfferExchange} className={styles.fullWidthBtn}>
                  Предложить обмен
                </Button>
              </div>
            )}

            {variant === 'requested' && (
              <div className={styles.requestedFooter}>
                {/* Статус растянут по ширине макета, включает clock.svg и Text компонент */}
                <div className={styles.statusBadge}>
                  <img src={clockIcon} alt="" className={styles.btnIcon} />
                  <Text variant="body">Обмен предложен</Text>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Правая секция — Галерея изображений */}
        <section className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            
            {/* Иконки действий в default и requested вынесены строго в верхний правый угол */}
            {variant !== 'confirmation' && (
              <div className={styles.topIconActions}>
                <IconButton icon={<img src={likeIcon} alt="" />} ariaLabel="Добавить в избранное" onClick={onFavorite} />
                <IconButton icon={<img src={shareIcon} alt="" />} ariaLabel="Поделиться навыком" onClick={onShare} />
                <IconButton icon={<img src={moreIcon} alt="" />} ariaLabel="Дополнительное меню" onClick={onMore} />
              </div>
            )}

            {mainImage ? (
              <img src={mainImage} alt={title} className={styles.mainImage} />
            ) : (
              <div className={styles.noImageFallback} />
            )}
            
            {imageUrls.length > 1 && (
              <div className={styles.galleryControls}>
                <button type="button" className={styles.arrowButton} onClick={handlePrevImage} aria-label="Предыдущее изображение">
                  <img src={arrowLeftIcon} alt="" />
                </button>
                <button type="button" className={styles.arrowButton} onClick={handleNextImage} aria-label="Следующее изображение">
                  <img src={arrowRightIcon} alt="" />
                </button>
              </div>
            )}
          </div>
          
          {imageUrls.length > 1 && (
            <div className={styles.thumbnailsTrack}>
              {thumbnailsToShow.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.thumbnailButton} ${idx === activeImageIndex ? styles.thumbnailActive : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`Миниатюра ${idx + 1}`} className={styles.thumbnailImg} />
                  
                  {idx === MAX_THUMBNAILS - 1 && remainingImagesCount > 0 && (
                    <div className={styles.remainingOverlay}>
                      <Text variant="caption" className={styles.remainingText}>
                        +{remainingImagesCount}
                      </Text>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </article>
  )
}
