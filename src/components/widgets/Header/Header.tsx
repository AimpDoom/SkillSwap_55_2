import { Logo } from '@/shared/ui/Logo'
import { AuthActions } from './AuthActions'
import { Navigation } from './Navigation'
import { SearchBar } from './SearchBar'
import { ThemeButton } from './ThemeButton'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.leftGroup}>
          <Logo />
          <Navigation />
        </div>

        <SearchBar />

        <div className={styles.rightGroup}>
          <ThemeButton />
          <AuthActions />
        </div>
      </div>
    </header>
  )
}
