import { useCallback, useEffect, useMemo, useState } from 'react'

import { ThreeDots } from 'react-loader-spinner'
import { useSearchParams } from 'react-router-dom'

import { fetchCities } from '@/api/cities'
import { fetchCategories, fetchSkills } from '@/api/skills'
import { fetchUsers } from '@/api/users'

import { FiltersSidebar } from '@/components/widgets/FiltersSidebar'
import {
  INITIAL_CATALOG_FILTERS,
  type CatalogFilters,
} from '@/components/widgets/FiltersSidebar/types'

import type { SkillCategory } from '@/entities/category/model/types'
import type { City } from '@/entities/city/model/types'
import type { Skill } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'
import { UserCard } from '@/entities/user/ui/UserCard'

import chevronRightIcon from '@/shared/assets/icons/chevron-right.svg'
import crossIcon from '@/shared/assets/icons/cross.svg'
import sortingArrows from '@/shared/assets/icons/sort.svg'
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

const roleLabels = {
  learn: 'Хочу научиться',
  teach: 'Могу научить',
}

const genderLabels = {
  male: 'Мужской',
  female: 'Женский',
}

export default function CatalogPage({ onFilteringChange }: CatalogPageProps) {
  const [searchParams] = useSearchParams()

  const [catalogUsers, setCatalogUsers] = useState<User[]>([])
  const [catalogSkills, setCatalogSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [isDataLoading, setIsDataLoading] = useState(true)
  const [dataError, setDataError] = useState(false)

  const [filters, setFilters] = useState<CatalogFilters>(INITIAL_CATALOG_FILTERS)

  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  const [showAllPopular, setShowAllPopular] = useState(false)

  const [showAllNew, setShowAllNew] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [visibleFilteredCount, setVisibleFilteredCount] = useState(INITIAL_FILTERED_USERS_COUNT)

  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(
    INITIAL_RECOMMENDED_USERS_COUNT,
  )

  useEffect(() => {
    let isMounted = true

    const loadCatalogData = async () => {
      try {
        setIsDataLoading(true)
        setDataError(false)

        const [loadedUsers, loadedSkills, loadedCategories, loadedCities] = await Promise.all([
          fetchUsers(),
          fetchSkills(),
          fetchCategories(),
          fetchCities(),
        ])

        if (!isMounted) {
          return
        }

        setCatalogUsers(loadedUsers)
        setCatalogSkills(loadedSkills)
        setCategories(loadedCategories)
        setCities(loadedCities)
      } catch {
        if (isMounted) {
          setDataError(true)
        }
      } finally {
        if (isMounted) {
          setIsDataLoading(false)
        }
      }
    }

    void loadCatalogData()

    return () => {
      isMounted = false
    }
  }, [])

  const searchQuery = searchParams.get('search')?.trim().toLocaleLowerCase('ru-RU') ?? ''

  const hasSearchQuery = searchQuery.length > 0

  /*
   * Поиск выполняется только по title навыка.
   * После этого по authorId найденных навыков
   * выбираются соответствующие пользователи.
   */
  const searchUsers = useMemo(() => {
    if (!hasSearchQuery) {
      return catalogUsers
    }

    const matchedAuthorIds = new Set(
      catalogSkills
        .filter((skill) => skill.title.toLocaleLowerCase('ru-RU').includes(searchQuery))
        .map((skill) => skill.authorId),
    )

    return catalogUsers.filter((user) => matchedAuthorIds.has(user.id))
  }, [catalogSkills, catalogUsers, hasSearchQuery, searchQuery])

  /*
   * Обычные секции каталога всегда формируются
   * из полного каталога.
   *
   * При активном поиске они просто не отображаются.
   */
  const popularUsers = useMemo(() => getPopularUsers(catalogUsers), [catalogUsers])

  const newUsers = useMemo(() => getNewUsers(catalogUsers), [catalogUsers])

  const recommendedUsers = useMemo(() => shuffleUsers(catalogUsers), [catalogUsers])

  const skillLabels = useMemo(
    () =>
      new Map(
        categories.flatMap((category) =>
          category.subcategories.map((subcategory) => [subcategory.id, subcategory.name]),
        ),
      ),
    [categories],
  )

  const cityLabels = useMemo(() => new Map(cities.map((city) => [city.id, city.name])), [cities])

  const hasActiveFilters = hasActiveCatalogFilters(filters)

  /*
   * Единый режим выдачи включается,
   * если активен поиск ИЛИ хотя бы один фильтр.
   */
  const isResultsMode = hasSearchQuery || hasActiveFilters

  useEffect(() => {
    onFilteringChange?.(isResultsMode)
  }, [isResultsMode, onFilteringChange])

  /*
   * Сортировку сбрасываем только после полного выхода
   * из режима результатов — когда нет ни поиска,
   * ни активных фильтров.
   */
  useEffect(() => {
    if (!isResultsMode) {
      setSortOrder('newest')
    }
  }, [isResultsMode])

  /*
   * При изменении поиска возвращаем пагинацию
   * результатов в исходное состояние.
   */
  useEffect(() => {
    setVisibleFilteredCount(INITIAL_FILTERED_USERS_COUNT)
  }, [searchQuery])

  /*
   * Сначала применяется поиск,
   * затем поверх найденных пользователей —
   * существующая логика FiltersSidebar.
   */
  const resultUsers = useMemo(
    () => filterCatalogUsers(searchUsers, catalogSkills, filters),
    [catalogSkills, filters, searchUsers],
  )

  /*
   * Существующая сортировка единого списка.
   */
  const sortedResultUsers = useMemo(() => {
    return [...resultUsers].sort((a, b) => {
      const firstDate = Date.parse(a.createdAt)
      const secondDate = Date.parse(b.createdAt)

      return sortOrder === 'newest' ? secondDate - firstDate : firstDate - secondDate
    })
  }, [resultUsers, sortOrder])

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
  }, [cityLabels, filters, skillLabels])

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

  const visibleResultUsers = sortedResultUsers.slice(0, visibleFilteredCount)

  const hasMoreResultUsers = visibleFilteredCount < resultUsers.length

  useEffect(() => {
    setVisibleFilteredCount(INITIAL_FILTERED_USERS_COUNT)
  }, [filters])

  const visiblePopularUsers = showAllPopular ? popularUsers : popularUsers.slice(0, 3)

  const visibleNewUsers = showAllNew ? newUsers : newUsers.slice(0, 3)

  const visibleRecommendedUsers = recommendedUsers.slice(0, visibleRecommendedCount)

  const hasMoreRecommendedUsers = visibleRecommendedCount < recommendedUsers.length

  const loadMoreRecommendedUsers = useCallback(() => {
    if (isLoading || !hasMoreRecommendedUsers) {
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setVisibleRecommendedCount((currentCount) =>
        Math.min(currentCount + LOAD_BATCH_SIZE, recommendedUsers.length),
      )

      setIsLoading(false)
    }, 1000)
  }, [hasMoreRecommendedUsers, isLoading, recommendedUsers.length])

  const loadMoreResultUsers = useCallback(() => {
    if (isLoading || !hasMoreResultUsers) {
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setVisibleFilteredCount((currentCount) =>
        Math.min(currentCount + LOAD_BATCH_SIZE, resultUsers.length),
      )

      setIsLoading(false)
    }, 1000)
  }, [hasMoreResultUsers, isLoading, resultUsers.length])

  const observerRef = useInfiniteScroll({
    onLoadMore: isResultsMode ? loadMoreResultUsers : loadMoreRecommendedUsers,
    hasMore: isResultsMode ? hasMoreResultUsers : hasMoreRecommendedUsers,
    isLoading,
  })

  if (isDataLoading) {
    return (
      <main className={styles.page}>
        <Container>
          <div className={styles.loader}>
            <ThreeDots
              height="40"
              width="40"
              color="var(--color-text-secondary)"
              ariaLabel="Загрузка каталога"
            />
          </div>
        </Container>
      </main>
    )
  }

  if (dataError) {
    return (
      <main className={styles.page}>
        <Container>
          <p className={styles.emptyMessage}>Не удалось загрузить каталог</p>
        </Container>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <FiltersSidebar filters={filters} onChange={setFilters} />

          <div className={styles.content}>
            {isResultsMode ? (
              <section className={styles.section}>
                {activeFilterTags.length > 0 && (
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
                )}

                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    Подходящие предложения: {resultUsers.length}
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

                {resultUsers.length > 0 ? (
                  <div className={`${styles.cardsGrid} ${styles.filteredCardsGrid}`}>
                    {visibleResultUsers.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyMessage}>Ничего не найдено</p>
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

                {hasMoreResultUsers && <div ref={observerRef} className={styles.observer} />}
              </section>
            ) : (
              <>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Популярное</h2>

                    <Button
                      variant="tertiary"
                      className={styles.showAllButton}
                      onClick={() => setShowAllPopular((current) => !current)}
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
                      onClick={() => setShowAllNew((current) => !current)}
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

                  {hasMoreRecommendedUsers && <div ref={observerRef} className={styles.observer} />}
                </section>
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
