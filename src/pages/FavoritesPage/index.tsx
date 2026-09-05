import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUsers } from '@/api/users'

import type { User } from '@/entities/user/model/types'
import { UserCard } from '@/entities/user/ui/UserCard'
import { Text } from '@/shared/ui/Text'
import { FAVORITES_CHANGED_EVENT, getFavoriteUserIds } from '@/features/favorites/model/favorites'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import styles from './FavoritesPage.module.css'
import { ROUTES } from '@/shared/lib/constants'

export default function FavoritesPage() {
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadFavorites = async () => {
      try {
        setIsLoading(true)

        const allUsers = await fetchUsers()
        const favoritesIds = getFavoriteUserIds()

        if (!isMounted) {
          return
        }

        setUsers(allUsers.filter((user) => favoritesIds.includes(user.id)))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadFavorites()

    const handleFavoritesChanged = () => {
      loadFavorites()
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged)

    return () => {
      isMounted = false
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged)
    }
  }, [])

  if (isLoading) {
    return (
      <Text variant="body" as="p">
        Загрузка...
      </Text>
    )
  }

  if (users.length === 0) {
    return (
      <main className={styles.page}>
        <Container>
          <div className={styles.emptyState}>
            <Text className={styles.emptyMessage} variant="body" as="p">
              {' '}
              В избранном пока ничего нет{' '}
            </Text>
            <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
              {' '}
              Вернуться в каталог
            </Button>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <Container>
        <Text variant="h1" className={styles.title}>
          Избранное
        </Text>
        <div className={styles.cardsGrid}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </Container>
    </main>
  )
}
