import styles from './CatalogPage.module.css'

import { ThreeDots } from 'react-loader-spinner'

import users from '@/../public/db/users.json'
import { Button } from '@/shared/ui/Button'
import type { User } from '@/entities/user/model/types'
import { useCallback, useState } from 'react'
import { useInfiniteScroll } from './useInfiniteScroll'
import { FiltersSidebar } from '@/components/widgets/FiltersSidebar'
import { UserCard } from '@/entities/user/ui/UserCard'
import { Container } from '@/shared/ui/Container'
import chevronRightIcon from '@/shared/assets/icons/chevron-right.svg'

const LOAD_BATCH_SIZE = 6

const popularUsers = users.slice(0, 9)
const newUsers = users.slice(9, 18)
const recommendedUsers = users.slice(18, 27)

const remainingUsers = users.slice(27)

export default function CatalogPage() {
  const [showAllPopular, setShowAllPopular] = useState(false)
  const [showAllNew, setShowAllNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadedUsers, setLoadedUsers] = useState<User[]>([])

  const visiblePopularUsers = showAllPopular ? popularUsers : popularUsers.slice(0, 3)
  const visibleNewUsers = showAllNew ? newUsers : newUsers.slice(0, 3)

  const hasMore = loadedUsers.length < remainingUsers.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const startIndex = loadedUsers.length

      const nextUsers = remainingUsers.slice(startIndex, startIndex + LOAD_BATCH_SIZE)

      setLoadedUsers((currentUsers) => [...currentUsers, ...nextUsers])

      setIsLoading(false)
    }, 1000)
  }, [isLoading, hasMore, loadedUsers.length])

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
                >
                  Смотреть все
                  <img className={styles.arrow} src={chevronRightIcon} alt="" aria-hidden="true" />
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
                >
                  Смотреть все
                  <img className={styles.arrow} src={chevronRightIcon} alt="" aria-hidden="true" />
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
                {[...recommendedUsers, ...loadedUsers].map((user) => (
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
