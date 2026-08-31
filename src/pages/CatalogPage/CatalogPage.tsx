import styles from './CatalogPage.module.css'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'

import skills from '@/../public/db/skills.json'
import users from '@/../public/db/users.json'
import { FiltersSidebar } from '@/components/widgets/FiltersSidebar'
import {
  INITIAL_CATALOG_FILTERS,
  type CatalogFilters,
} from '@/components/widgets/FiltersSidebar/types'
import type { Skill } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'
import { UserCard } from '@/entities/user/ui/UserCard'
import chevronRightIcon from '@/shared/assets/icons/chevron-right.svg'
import crossIcon from '@/shared/assets/icons/cross.svg'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'

import { filterCatalogUsers, hasActiveCatalogFilters } from './catalogFiltering'
import { getNewUsers, getPopularUsers, shuffleUsers } from './catalogSectionSelection'
import { useInfiniteScroll } from './useInfiniteScroll'

const LOAD_BATCH_SIZE = 6
const INITIAL_RECOMMENDED_USERS_COUNT = 6
const INITIAL_FILTERED_USERS_COUNT = 9

const catalogUsers = users as User[]
const catalogSkills = skills as Skill[]

const popularUsers = getPopularUsers(catalogUsers)
const newUsers = getNewUsers(catalogUsers)

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>(INITIAL_CATALOG_FILTERS)

  const [showAllPopular, setShowAllPopular] = useState(false)
  const [showAllNew, setShowAllNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [visibleFilteredCount, setVisibleFilteredCount] = useState(
    INITIAL_FILTERED_USERS_COUNT,
  )

  const [recommendedUsers] = useState<User[]>(() => shuffleUsers(catalogUsers))

  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(
    INITIAL_RECOMMENDED_USERS_COUNT,
  )

  const visiblePopularUsers = showAllPopular ? popularUsers : popularUsers.slice(0, 3)

  const visibleNewUsers = showAllNew ? newUsers : newUsers.slice(0, 3)

  const visibleRecommendedUsers = recommendedUsers.slice(0, visibleRecommendedCount)

  const hasMore = visibleRecommendedCount < recommendedUsers.length

  const isFiltering = hasActiveCatalogFilters(filters)

  const filteredUsers = useMemo(
    () => filterCatalogUsers(catalogUsers, catalogSkills, filters),
    [filters],
  )

  const visibleFilteredUsers = filteredUsers.slice(0, visibleFilteredCount)

  const hasMoreFilteredUsers = visibleFilteredCount < filteredUsers.length

  useEffect(() => {
    setVisibleFilteredCount(INITIAL_FILTERED_USERS_COUNT)
  }, [filters])

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

  const loadMoreFilteredUsers = useCallback(() => {
    if (isLoading || !hasMoreFilteredUsers) {
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setVisibleFilteredCount((currentCount) =>
        Math.min(currentCount + LOAD_BATCH_SIZE, filteredUsers.length),
      )

      setIsLoading(false)
    }, 1000)
  }, [isLoading, hasMoreFilteredUsers, filteredUsers.length])

  const observerRef = useInfiniteScroll({
    onLoadMore: isFiltering ? loadMoreFilteredUsers : loadMore,
    hasMore: isFiltering ? hasMoreFilteredUsers : hasMore,
    isLoading,
  })

  return (
    <main className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <FiltersSidebar filters={filters} onChange={setFilters} />

          <div className={styles.content}>
          {isFiltering ? (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Подходящие предложения: {filteredUsers.length}
                </h2>
              </div>

              <div className={styles.cardsGrid}>
                {visibleFilteredUsers.map((user) => (
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

              {hasMoreFilteredUsers && (
                <div ref={observerRef} className={styles.observer} />
              )}
            </section>
          ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}