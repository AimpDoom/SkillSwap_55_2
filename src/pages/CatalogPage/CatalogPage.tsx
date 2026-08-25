import styles from './CatalogPage.module.css'

import users from '@/../public/db/users.json'
import { FiltersSidebar } from '@/components/widgets/FiltersSidebar'
import { UserCard } from '@/entities/user/ui/UserCard'
import { Container } from '@/shared/ui/Container'
import chevronRightIcon from '@/shared/assets/icons/chevron-right.svg'

const popularUsers = users.slice(0, 3)
const newUsers = users.slice(3, 6)
const recommendedUsers = users.slice(6, 15)

export default function CatalogPage() {
  return (
    <main className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <FiltersSidebar />

          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Популярное</h2>

                <button className={styles.showAllButton} type="button">
                  Смотреть все
                  <img className={styles.arrow} src={chevronRightIcon} alt="" aria-hidden="true" />
                </button>
              </div>

              <div className={styles.cardsGrid}>
                {popularUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Новое</h2>

                <button className={styles.showAllButton} type="button">
                  Смотреть все
                  <img className={styles.arrow} src={chevronRightIcon} alt="" aria-hidden="true" />
                </button>
              </div>

              <div className={styles.cardsGrid}>
                {newUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Рекомендуем</h2>

                <button className={styles.showAllButton} type="button">
                  Смотреть все
                  <img className={styles.arrow} src={chevronRightIcon} alt="" aria-hidden="true" />
                </button>
              </div>

              <div className={styles.cardsGrid}>
                {recommendedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </main>
  )
}