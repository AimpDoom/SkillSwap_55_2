import { Logo } from '@/shared/ui/Logo'

import { FooterNavigation } from './FooterNavigation'
import { Copyright } from './Copyright'

import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Logo />

      <FooterNavigation />

      <Copyright />
    </footer>
  )
}