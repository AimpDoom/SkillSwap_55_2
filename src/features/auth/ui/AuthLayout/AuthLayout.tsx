import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/widgets/Header'
import { Container } from '@/shared/ui/Container'
import { ROUTES } from '@/shared/lib/constants'
import styles from './AuthLayout.module.css'

export interface AuthLayoutProps {
  heading: ReactNode
  form: ReactNode
  promo: ReactNode
}

export const AuthLayout = ({ heading, form, promo }: AuthLayoutProps) => {
  const navigate = useNavigate()

  return (
    <>
      <Header variant="minimal" onClose={() => navigate(ROUTES.HOME)} />

      <Container>
        <div className={styles.content}>
          <div className={styles.heading}>{heading}</div>

          <div className={styles.columns}>
            <div className={styles.column}>{form}</div>
            <div className={styles.column}>{promo}</div>
          </div>
        </div>
      </Container>
    </>
  )
}
