import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import { fetchSubcategory, fetchCategories, fetchSkillById, fetchSkills } from '@/api/skills'
import { fetchUserById, fetchUsers } from '@/api/users'

import type { SkillCategory } from '@/entities/category/model/types'
import type { Skill } from '@/entities/skill/model/types'
import { SkillOffer } from '@/entities/skill/ui/SkillOffer/SkillOffer'
import type { User } from '@/entities/user/model/types'
import { UserCard } from '@/entities/user/ui/UserCard/UserCard'
import type { SwapRequest } from '@/entities/request/model/types'

import { getAuthUser } from '@/features/auth/model/authUtils'
import { RegistrationSuccessModal } from '@/features/auth/ui/RegistrationSuccessModal'
import { Container } from '@/shared/ui/Container'
import { Pagination } from '@/shared/ui/Pagination'
import { ROUTES, LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

import styles from './SkillPage.module.css'

const CARDS_PER_PAGE = 4

export default function SkillPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [skill, setSkill] = useState<Skill | null>(null)
  const [author, setAuthor] = useState<User | null>(null)

  const [categoryName, setCategoryName] = useState('')
  const [subcategoryName, setSubcategoryName] = useState('')

  const [similarUsers, setSimilarUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isExchangeRequested, setIsExchangeRequested] = useState(false)

  useEffect(() => {
    if (location.state?.showSuccessModal) {
      setIsSuccessModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

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
          allSkills,
          allUsers,
        ] = await Promise.all([
          fetchUserById(currentSkill.authorId),
          fetchCategories(),
          fetchSubcategory(currentSkill.subcategoryId),
          fetchSkills(),
          fetchUsers(),
        ])

        if (!currentAuthor) {
          setError(true)
          return
        }

        const category = categories.find(
          (item: SkillCategory) => item.id === currentSkill.categoryId,
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
        setAuthor(currentAuthor)

        setCategoryName(category?.name ?? '')
        setSubcategoryName(subcategory?.name ?? '')
        setSimilarUsers(relatedUsers)

        const authUser = getAuthUser()
        if (authUser) {
          try {
            const rawRequests = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)
            const requests: SwapRequest[] = rawRequests ? JSON.parse(rawRequests) : []

            const hasDuplicate = requests.some(
              (req) =>
                req.fromUserId === authUser.id &&
                req.toUserId === currentSkill.authorId &&
                req.skillId === currentSkill.id,
            )

            setIsExchangeRequested(hasDuplicate)
          } catch {
            setIsExchangeRequested(false)
          }
        }
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

  const handleOfferExchange = () => {
    const authUser = getAuthUser()

    if (!authUser) {
      navigate(ROUTES.REGISTER, {
        state: { from: location.pathname },
      })
      return
    }

    if (!skill) return

    try {
      const rawRequests = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)
      const requests: SwapRequest[] = rawRequests ? JSON.parse(rawRequests) : []

      const isDuplicate = requests.some(
        (req) =>
          req.fromUserId === authUser.id &&
          req.toUserId === skill.authorId &&
          req.skillId === skill.id,
      )

      if (isDuplicate) {
        setIsExchangeRequested(true)
        return
      }

      const now = new Date().toISOString()

      const newRequest: SwapRequest = {
        id: 'req_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now(),
        skillId: skill.id,
        fromUserId: authUser.id,
        toUserId: skill.authorId,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      }

      requests.push(newRequest)
      localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(requests))

      setIsExchangeRequested(true)
    } catch (e) {
      console.error('Ошибка сохранения запроса в localStorage:', e)
    }
  }

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
            <UserCard
              user={author}
              variant="profile"
            />
          </aside>

          <section className={styles.skill}>
            <SkillOffer
              skill={skill}
              variant={isExchangeRequested ? 'requested' : 'default'}
              categoryName={categoryName}
              subcategoryName={subcategoryName}
              onOfferExchange={handleOfferExchange}
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
              className={styles.similarCards}
            >
              {visibleSimilarUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  variant="catalog"
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

      <RegistrationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </main>
  )
}
