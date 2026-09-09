import { useNavigate } from 'react-router-dom'

import ServerErrorImage from '@/shared/assets/images/error500.svg?react'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'

import styles from '../ErrorPages.module.css'

interface ServerErrorPageProps {
  statusCode?: number
}

export default function ServerErrorPage({ statusCode = 500 }: ServerErrorPageProps) {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(ROUTES.HOME)
  }

  const handleReportError = () => {
    console.log('Сообщить об ошибке', {
      statusCode,
    })
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <ServerErrorImage
            className={styles.errorImage}
            aria-label={`Ошибка сервера ${statusCode}`}
            role="img"
          />
        </div>

        <h1 className={styles.title}>На сервере произошла ошибка</h1>

        <p className={styles.description}>Попробуйте позже или вернитесь на главную страницу</p>

        <div className={styles.buttonGroup}>
          <Button variant="secondary" onClick={handleReportError}>
            Сообщить об ошибке
          </Button>

          <Button variant="primary" onClick={handleGoHome}>
            На главную
          </Button>
        </div>
      </div>
    </main>
  )
}
