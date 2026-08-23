// TODO: реализовать страницу CatalogPage

import styles from './CatalogPage.module.css'
import { UserCard } from '@/entities/user/ui/UserCard'
import users from '@/../public/db/users.json'

export default function CatalogPage() {
  return (
    <main className={styles.page}>
      <UserCard user={users[0]} />
    </main>
  )
}
