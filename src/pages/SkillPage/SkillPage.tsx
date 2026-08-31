import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { fetchCityById } from '@/api/cities'
import {
  fetchCategories,
  fetchSkillById,
  fetchSkills,
  fetchSubcategory,
} from '@/api/skills'
import { fetchUserById, fetchUsers } from '@/api/users'

import type { SkillCategory } from '@/entities/category/model/types'
import type { Skill } from '@/entities/skill/model/types'
import { SkillOffer } from '@/entities/skill/ui/SkillOffer/SkillOffer'
import type { User } from '@/entities/user/model/types'
import { UserCard } from '@/entities/user/ui/UserCard/UserCard'
import { UserProfileCard } from '@/entities/user/ui/UserProfileCard'

import type { TagVariant } from '@/shared/ui/Tag'
import { Container } from '@/shared/ui/Container'
import { Pagination } from '@/shared/ui/Pagination'

import styles from './SkillPage.module.css'

const CARDS_PER_PAGE = 4

type AuthorData = {
  user: User
  cityName: string
  age: number
  teachSkills: {
    name: string
    variant: TagVariant
  }[]
  learnSkills: {
    name: string
    variant: TagVariant
  }[]
}

function getAge(birthDate: string) {
  const birth = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()

  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate())

  if (!hasBirthdayPassed) {
    age -= 1
  }

  return age
}

function getTagVariant(categoryId: string): TagVariant {
  const variants: TagVariant[] = [
    'business-career',
    'foreign-languages',
    'home-comfort',
    'creativity-art',
    'education-development',
    'health-lifestyle',
  ]

  return variants.includes(categoryId as TagVariant)
    ? (categoryId as TagVariant)
    : 'neutral'
}

function findSubcategory(
  categories: SkillCategory[],
  subcategoryId: string,
) {
  for (const category of categories) {
    const subcategory = category.subcategories.find(
      (item) => item.id === subcategoryId,
    )

    if (subcategory) {
      return {
        subcategory,
        category,
      }
    }
  }

  return undefined
}

export default function SkillPage() {
  const { id } = useParams<{ id: string }>()

  const [skill, setSkill] = useState<Skill | null>(null)
  const [author, setAuthor] = useState<AuthorData | null>(null)

  const [categoryName, setCategoryName] = useState('')
  const [subcategoryName, setSubcategoryName] = useState('')

  const [similarUsers, setSimilarUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadSkillPage() {
      if (!id) {
        setError(true)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(false)
        setCurrentPage(1)

        const currentSkill = await fetchSkillById(id)

        if (!currentSkill) {
          setError(true)
          return
        }

        const [
          currentAuthor,
          categories,
          subcategory,
          city,
          allSkills,
          allUsers,
        ] = await Promise.all([
          fetchUserById(currentSkill.authorId),
          fetchCategories(),
          fetchSubcategory(currentSkill.subcategoryId),
          fetchUserById(currentSkill.authorId).then((user) =>
            user ? fetchCityById(user.cityId) : undefined,
          ),
          fetchSkills(),
          fetchUsers(),
        ])

        if (!currentAuthor) {
          setError(true)
          return
        }

        const category = categories.find(
          (item) => item.id === currentSkill.categoryId,
        )

        const teachSkills = [
          {
            name: currentSkill.title,
            variant: getTagVariant(currentSkill.categoryId),
          },
        ]

        const learnSkills = currentAuthor.learnSubcategoryIds
          .map((learnSubcategoryId) => {
            const result = findSubcategory(
              categories,
              learnSubcategoryId,
            )

            if (!result) {
              return null
            }

            return {
              name: result.subcategory.name,
              variant: getTagVariant(result.category.id),
            }
          })
          .filter(
            (
              item,
            ): item is {
              name: string
              variant: TagVariant
            } => item !== null,
          )

        const similarSkillIds = new Set(
          allSkills
            .filter(
              (item) =>
                item.id !== currentSkill.id &&
                item.authorId !== currentSkill.authorId &&
                item.categoryId === currentSkill.categoryId,
            )
            .map((item) => item.id),
        )

        const relatedUsers = allUsers.filter(
          (user) =>
            user.id !== currentSkill.authorId &&
            similarSkillIds.has(user.teachSkillId),
        )

        setSkill(currentSkill)

        setAuthor({
          user: currentAuthor,
          cityName: city?.name ?? '',
          age: getAge(currentAuthor.birthDate),
          teachSkills,
          learnSkills,
        })

        setCategoryName(category?.name ?? '')
        setSubcategoryName(subcategory?.name ?? '')
        setSimilarUsers(relatedUsers)
      } catch {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadSkillPage()
  }, [id])

  const totalPages = Math.ceil(
    similarUsers.length / CARDS_PER_PAGE,
  )

  const visibleSimilarUsers = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE

    return similarUsers.slice(
      start,
      start + CARDS_PER_PAGE,
    )
  }, [similarUsers, currentPage])

  if (isLoading) {
    return (
      <main className={styles.page}>
        <Container>
          <p>Загрузка...</p>
        </Container>
      </main>
    )
  }

  if (error || !skill || !author) {
    return (
      <main className={styles.page}>
        <Container>
          <p>Не удалось загрузить навык.</p>
        </Container>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <Container>
        <div className={styles.mainContent}>
          <aside className={styles.author}>
            <UserProfileCard
              avatarUrl={author.user.avatarUrl}
              name={author.user.name}
              city={author.cityName}
              age={author.age}
              about={author.user.about}
              teachSkills={author.teachSkills}
              learnSkills={author.learnSkills}
            />
          </aside>

          <section className={styles.skill}>
            <SkillOffer
              skill={skill}
              variant="default"
              categoryName={categoryName}
              subcategoryName={subcategoryName}
            />
          </section>
        </div>

        {similarUsers.length > 0 && (
          <section className={styles.similar}>
            <h2 className={styles.similarTitle}>
              Похожие предложения
            </h2>

            <div 
              key={currentPage}
              className={styles.similarCards}>
              {visibleSimilarUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                variant="compact"
                className={styles.pagination}
              />
            )}
          </section>
        )}
      </Container>
    </main>
  )
}