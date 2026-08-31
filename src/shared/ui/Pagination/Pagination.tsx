import { clsx } from 'clsx'

import chevronRightIcon from '@/shared/assets/icons/chevron-right.svg'
import { Button } from '@/shared/ui/Button'

import styles from './Pagination.module.css'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  previousLabel?: string
  nextLabel?: string
  className?: string
  variant?: 'default' | 'compact'
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel = 'Назад',
  nextLabel = 'Вперёд',
  className = '',
  variant = 'default',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  if (variant === 'compact') {
  return (
    <nav
      className={clsx(
        styles.compactPagination,
        className,
      )}
      aria-label="Пагинация похожих предложений"
    >
      {currentPage > 1 && (
        <button
          type="button"
          className={clsx(
            styles.compactButton,
            styles.compactButtonPrevious,
          )}
          onClick={handlePrevious}
          aria-label="Предыдущие предложения"
        >
          <img
            src={chevronRightIcon}
            alt=""
            aria-hidden="true"
          />
        </button>
      )}

      {currentPage < totalPages && (
        <button
          type="button"
          className={styles.compactButton}
          onClick={handleNext}
          aria-label="Следующие предложения"
        >
          <img
            src={chevronRightIcon}
            alt=""
            aria-hidden="true"
          />
        </button>
      )}
    </nav>
  )
}

  return (
    <nav
      className={clsx(styles.pagination, className)}
      aria-label="Пагинация"
    >
      <Button
        type="button"
        variant="tertiary"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      >
        {previousLabel}
      </Button>

      <div className={styles.pages}>
        {pages.map((page) => {
          const isActive = page === currentPage

          return (
            <button
              key={page}
              className={clsx(
                styles.pageButton,
                isActive && styles.active,
              )}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Страница ${page}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        })}
      </div>

      <Button
        type="button"
        variant="tertiary"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        {nextLabel}
      </Button>
    </nav>
  )
}