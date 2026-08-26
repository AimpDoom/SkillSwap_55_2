import { Logo } from '@/shared/ui/Logo'
import { AuthActions } from './AuthActions'
import { Navigation } from './Navigation'
import { SearchBar } from './SearchBar'
import { ThemeButton } from './ThemeButton'
import closeIcon from '@/shared/assets/icons/cross.svg'
import { Button } from '@/shared/ui/Button'
import styles from './Header.module.css'
import { AuthorizedActions } from './AuthorizedActions'
import { Container } from '@/shared/ui/Container'

export type HeaderVariant = 'default' | 'authorized' | 'minimal'

type HeaderProps = {
  variant?: HeaderVariant
  onClose?: () => void
  userName?: string
  avatarSrc?: string
}

export function Header({ variant = 'default', onClose, userName = '', avatarSrc }: HeaderProps) {
  if (variant === 'minimal') {
    return (
      <header className={styles.minimalHeader}>
        <Container className={styles.minimalContent}>
          <Logo />

          <Button
            className={styles.closeButton}
            type="button"
            variant="tertiary"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <span>Закрыть</span>

            <img className={styles.closeIcon} src={closeIcon} alt="" aria-hidden="true" />
          </Button>
        </Container>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <Container className={styles.content}>
        <div className={styles.leftGroup}>
          <Logo />
          <Navigation />
        </div>

        <SearchBar />

        <div className={styles.rightGroup}>
          <ThemeButton />

          {variant === 'authorized' ? (
            <AuthorizedActions userName={userName} avatarSrc={avatarSrc} />
          ) : (
            <AuthActions />
          )}
        </div>
      </Container>
    </header>
  )
}
