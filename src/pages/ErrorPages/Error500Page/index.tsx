// src/pages/ServerErrorPage/index.tsx
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import styles from '../ErrorPages.module.css'
import serverErrorImageWebp from '@/shared/assets/images/ErrorPageImages/Error500PageImages/error500.webp'
import serverErrorImagePng from '@/shared/assets/images/ErrorPageImages/Error500PageImages/error500.png'

interface ServerErrorPageProps {
  statusCode?: number
}

export default function ServerErrorPage({ statusCode = 500 }: ServerErrorPageProps) {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(ROUTES.HOME)
  }

  const handleReportError = () => {
    console.log('Сообщить об ошибке', { statusCode })
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <picture>
            <source srcSet={serverErrorImageWebp} type="image/webp" />
            <img 
              src={serverErrorImagePng} 
              alt={`Ошибка сервера ${statusCode}`}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <h1 className={styles.title}>На сервере произошла ошибка</h1>
        <p className={styles.description}>
          Попробуйте позже или вернитесь на главную страницу
        </p>
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