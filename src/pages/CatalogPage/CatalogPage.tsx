import { useCallback, useEffect, useMemo, useState } from 'react'

import { ThreeDots } from 'react-loader-spinner'

import categories from '@/../public/db/categories.json'
import cities from '@/../public/db/cities.json'
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
import sortingArrows from '@/shared/assets/icons/sort.svg'
import crossIcon from '@/shared/assets/icons/cross.svg'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'

import { filterCatalogUsers, hasActiveCatalogFilters } from './catalogFiltering'
import { getNewUsers, getPopularUsers, shuffleUsers } from './catalogSectionSelection'
import { useInfiniteScroll } from './useInfiniteScroll'

import styles from './CatalogPage.module.css'

const LOAD_BATCH_SIZE = 6
const INITIAL_RECOMMENDED_USERS_COUNT = 6
const INITIAL_FILTERED_USERS_COUNT = 9

type ActiveFilterTag = {
  id: string
  type: 'role' | 'skill' | 'gender' | 'city'
  value: string
  label: string
}

type CatalogPageProps = {
  onFilteringChange?: (isFiltering: boolean) => void
}

type SortOrder = 'newest' | 'oldest'

const catalogUsers = users as User[]
const catalogSkills = skills as Skill[]

const popularUsers = getPopularUsers(catalogUsers)
const newUsers = getNewUsers(catalogUsers)

const roleLabels = {
  learn: 'Хочу научиться',
  teach: 'Могу научить',
}

const genderLabels = {
  male: 'Мужской',
  female: 'Женский',
}

const skillLabels = new Map(
  categories.flatMap((category) =>
    category.subcategories.map((subcategory) => [subcategory.id, subcategory.name]),
  ),
)

const cityLabels = new Map(cities.map((city) => [city.id, city.name]))

export default function CatalogPage({ onFilteringChange }: CatalogPageProps) {
  const [filters, setFilters] = useState<CatalogFilters>(INITIAL_CATALOG_FILTERS)

  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  const [showAllPopular, setShowAllPopular] = useState(false)
  const [showAllNew, setShowAllNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [visibleFilteredCount, setVisibleFilteredCount] = useState(INITIAL_FILTERED_USERS_COUNT)

  const [recommendedUsers] = useState<User[]>(() => shuffleUsers(catalogUsers))

  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(
    INITIAL_RECOMMENDED_USERS_COUNT,
  )

  const visiblePopularUsers = showAllPopular ? popularUsers : popularUsers.slice(0, 3)

  const visibleNewUsers = showAllNew ? newUsers : newUsers.slice(0, 3)

  const visibleRecommendedUsers = recommendedUsers.slice(0, visibleRecommendedCount)

  const hasMore = visibleRecommendedCount < recommendedUsers.length

  const isFiltering = hasActiveCatalogFilters(filters)

  useEffect(() => {
    onFilteringChange?.(isFiltering)
  }, [isFiltering, onFilteringChange])

  useEffect(() => {
    if (!isFiltering) {
      setSortOrder('newest')
    }
  }, [isFiltering])

  const filteredUsers = useMemo(
    () => filterCatalogUsers(catalogUsers, catalogSkills, filters),
    [filters],
  )

  const sortedFilteredUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const firstDate = Date.parse(a.createdAt)
      const secondDate = Date.parse(b.createdAt)

      return sortOrder === 'newest' ? secondDate - firstDate : firstDate - secondDate
    })
  }, [filteredUsers, sortOrder])

  const activeFilterTags = useMemo<ActiveFilterTag[]>(() => {
    const tags: ActiveFilterTag[] = []

    if (filters.role !== 'all') {
      tags.push({
        id: `role-${filters.role}`,
        type: 'role',
        value: filters.role,
        label: roleLabels[filters.role],
      })
    }

    filters.selectedSkills.forEach((skillId) => {
      const label = skillLabels.get(skillId)

      if (label) {
        tags.push({
          id: `skill-${skillId}`,
          type: 'skill',
          value: skillId,
          label,
        })
      }
    })

    if (filters.gender !== 'any') {
      tags.push({
        id: `gender-${filters.gender}`,
        type: 'gender',
        value: filters.gender,
        label: genderLabels[filters.gender],
      })
    }

    filters.selectedCities.forEach((cityId) => {
      const label = cityLabels.get(cityId)

      if (label) {
        tags.push({
          id: `city-${cityId}`,
          type: 'city',
          value: cityId,
          label,
        })
      }
    })

    return tags
  }, [filters])

  const handleRemoveFilter = (tag: ActiveFilterTag) => {
    setFilters((current) => {
      switch (tag.type) {
        case 'role':
          return {
            ...current,
            role: 'all',
          }

        case 'skill':
          return {
            ...current,
            selectedSkills: current.selectedSkills.filter((skillId) => skillId !== tag.value),
          }

        case 'gender':
          return {
            ...current,
            gender: 'any',
          }

        case 'city':
          return {
            ...current,
            selectedCities: current.selectedCities.filter((cityId) => cityId !== tag.value),
          }
      }
    })
  }

  const visibleFilteredUsers = sortedFilteredUsers.slice(0, visibleFilteredCount)

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
                <div className={styles.filterTags}>
                  {activeFilterTags.map((tag) => (
                    <div className={styles.filterTag} key={tag.id}>
                      <span>{tag.label}</span>

                      <button
                        className={styles.filterTagRemove}
                        type="button"
                        onClick={() => handleRemoveFilter(tag)}
                        aria-label={`Удалить фильтр ${tag.label}`}
                      >
                        <img
                          className={styles.filterTagIcon}
                          src={crossIcon}
                          alt=""
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    Подходящие предложения: {filteredUsers.length}
                  </h2>

                  <Button
                    variant="tertiary"
                    className={styles.sortButton}
                    onClick={() =>
                      setSortOrder((current) => (current === 'newest' ? 'oldest' : 'newest'))
                    }
                  >
                    <img
                      className={styles.sortIcon}
                      src={sortingArrows}
                      alt=""
                      aria-hidden="true"
                    />
                    <span>{sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}</span>
                  </Button>
                </div>

                {filteredUsers.length > 0 ? (
                  <div className={`${styles.cardsGrid} ${styles.filteredCardsGrid}`}>
                    {visibleFilteredUsers.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyMessage}>По выбранным фильтрам ничего не найдено</p>
                )}

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

                {hasMoreFilteredUsers && <div ref={observerRef} className={styles.observer} />}
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
