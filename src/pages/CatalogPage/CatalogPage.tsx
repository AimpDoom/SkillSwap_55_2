import styles from './CatalogPage.module.css'

import { ThreeDots } from 'react-loader-spinner'

import users from '@/../public/db/users.json'
import { Button } from '@/shared/ui/Button'
import type { User } from '@/entities/user/model/types'
import { useCallback, useState } from 'react'
import { useInfiniteScroll } from './useInfiniteScroll'
import { getNewUsers, getPopularUsers, shuffleUsers } from './catalogSectionSelection'
import { FiltersSidebar } from '@/components/widgets/FiltersSidebar'
import { UserCard } from '@/entities/user/ui/UserCard'
import { Container } from '@/shared/ui/Container'
import chevronRightIcon from '@/shared/assets/icons/chevron-right.svg'
import crossIcon from '@/shared/assets/icons/cross.svg'

const LOAD_BATCH_SIZE = 6
const INITIAL_RECOMMENDED_USERS_COUNT = 9

const popularUsers = getPopularUsers(users)
const newUsers = getNewUsers(users)

export default function CatalogPage() {
  const [showAllPopular, setShowAllPopular] = useState(false)
  const [showAllNew, setShowAllNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [recommendedUsers] = useState<User[]>(() => shuffleUsers(users))

  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(
    INITIAL_RECOMMENDED_USERS_COUNT,
  )

  const visiblePopularUsers = showAllPopular ? popularUsers : popularUsers.slice(0, 3)

  const visibleNewUsers = showAllNew ? newUsers : newUsers.slice(0, 3)

  const visibleRecommendedUsers = recommendedUsers.slice(0, visibleRecommendedCount)

  const hasMore = visibleRecommendedCount < recommendedUsers.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setVisibleRecommendedCount((currentCount) =>
        Math.min(currentCount + LOAD_BATCH_SIZE, recommendedUsers.length),
      )

      setIsLoading(false)
    }, 1000)
  }, [isLoading, hasMore, recommendedUsers.length])

  const observerRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading,
  })

  return (
    <main className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <FiltersSidebar />

          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Популярное</h2>
                <Button
                  variant="tertiary"
                  className={styles.showAllButton}
                  onClick={() => setShowAllPopular(!showAllPopular)}
                  aria-expanded={showAllPopular}
                >
                  {showAllPopular ? 'Скрыть' : 'Смотреть все'}

                  <img
                    className={showAllPopular ? styles.crossIcon : styles.arrow}
                    src={showAllPopular ? crossIcon : chevronRightIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </Button>
              </div>

              <div className={styles.cardsGrid}>
                {visiblePopularUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Новое</h2>
                <Button
                  variant="tertiary"
                  className={styles.showAllButton}
                  onClick={() => setShowAllNew(!showAllNew)}
                  aria-expanded={showAllNew}
                >
                  {showAllNew ? 'Скрыть' : 'Смотреть все'}

                  <img
                    className={showAllNew ? styles.crossIcon : styles.arrow}
                    src={showAllNew ? crossIcon : chevronRightIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </Button>
              </div>

              <div className={styles.cardsGrid}>
                {visibleNewUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Рекомендуем</h2>
              </div>

              <div className={styles.cardsGrid}>
                {visibleRecommendedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>

              {isLoading && (
                <div className={styles.loader}>
                  <ThreeDots
                    height="40"
                    width="40"
                    color="var(--color-text-secondary)"
                    ariaLabel="Загрузка карточек"
                  />
                </div>
              )}

              {hasMore && <div ref={observerRef} className={styles.observer} />}
            </section>
          </div>
        </div>
      </Container>
    </main>
  )
}