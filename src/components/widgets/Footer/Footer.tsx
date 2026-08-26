import { Container } from '@/shared/ui/Container'
import { Logo } from '@/shared/ui/Logo'

import { Copyright } from './Copyright'
import { FooterNavigation } from './FooterNavigation'

import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.content}>
        <Logo />

        <FooterNavigation />

        <Copyright />
      </Container>
    </footer>
  )
}
