import { useState } from 'react'
import type { Skill } from '../../model/types'
import { Button } from '../../../../shared/ui/Button/Button'
import { IconButton } from '@/shared/ui/IconButton'
import styles from './SkillOffer.module.css'

interface SkillOfferProps {
  skill: Skill
  variant: 'confirmation' | 'default' | 'requested'
  categoryName: string // Передаем название текстом, так как в модели только id
  subcategoryName: string
  onEdit?: () => void;
  onDone?: () => void;
  onOfferExchange?: () => void;
  onShare?: () => void;
  onFavorite?: () => void;
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
}: SkillOfferProps) {
  const { title, description, imageUrls = [] } = skill
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const MAX_THUMBNAILS = 3
  const hasImages = imageUrls.length > 0
  const mainImage = hasImages ? imageUrls[activeImageIndex] : 'https://placehold.co'
  
  const thumbnailsToShow = imageUrls.slice(0, MAX_THUMBNAILS)
  const remainingImagesCount = imageUrls.length - MAX_THUMBNAILS

  const getCategoryClass = (cat: string) => {
    const lower = cat.toLowerCase()
    if (lower.includes('бизнес') || lower.includes('карьер')) return styles.tagBusiness
    if (lower.includes('язык')) return styles.tagLanguages
    if (lower.includes('дом') || lower.includes('уют')) return styles.tagHome
    if (lower.includes('творчеств') || lower.includes('искусств')) return styles.tagArt
    if (lower.includes('образован') || lower.includes('развити')) return styles.tagEducation
    if (lower.includes('здоров') || lower.includes('лайфстайл')) return styles.tagMint
    return styles.tagNeutral
  }

  const shareIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
    </svg>
  )

  const favoriteIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )

  return (
    <article className={styles.card} aria-label="Предложение навыка">
      {/* Левая секция — Галерея изображений */}
      <section className={styles.gallery}>
        <div className={styles.mainImageWrapper}>
          <img src={mainImage} alt={title} className={styles.mainImage} />
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
                    <span className={styles.remainingText}>+{remainingImagesCount}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Правая секция — Контентная часть */}
      <section className={styles.infoBlock}>
        {variant === 'confirmation' && (
          <h2 className={styles.confirmationHeader}>Ваше предложение</h2>
        )}

        <div className={styles.metaRow}>
          <span className={`${styles.tag} ${getCategoryClass(categoryName)}`}>
            {categoryName}
          </span>
          <span className={styles.subcategory}>{subcategoryName}</span>
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        {/* Интерактивный подвал карточки */}
        <div className={styles.actionsArea}>
          {variant === 'confirmation' && (
            <div className={styles.btnGroup}>
              <Button variant="secondary" onClick={onEdit}>
                Редактировать
              </Button>
              <Button variant="primary" onClick={onDone}>
                Готово
              </Button>
            </div>
          )}

          {variant === 'default' && (
            <div className={styles.defaultFooter}>
              <Button variant="primary" onClick={onOfferExchange}>
                Предложить обмен
              </Button>
              <div className={styles.iconActions}>
                <IconButton icon={shareIcon} ariaLabel="Поделиться навыком" onClick={onShare} />
                <IconButton icon={favoriteIcon} ariaLabel="Добавить в избранное" onClick={onFavorite} />
              </div>
            </div>
          )}

          {variant === 'requested' && (
            <div className={styles.requestedFooter}>
              <span className={styles.statusBadge}>Обмен предложен</span>
              <div className={styles.iconActions}>
                <IconButton icon={shareIcon} ariaLabel="Поделиться навыком" onClick={onShare} />
                <IconButton icon={favoriteIcon} ariaLabel="Добавить в избранное" onClick={onFavorite} />
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}
