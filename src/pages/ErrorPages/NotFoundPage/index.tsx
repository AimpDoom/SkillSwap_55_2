// src/pages/NotFoundPage/index.tsx
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import styles from '../ErrorPages.module.css'
import notFoundImageWebp from '@/shared/assets/images/ErrorPageImages/NotFoundPageImages/error404.webp'
import notFoundImagePng from '@/shared/assets/images/ErrorPageImages/NotFoundPageImages/error404.png'

export default function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(ROUTES.HOME)
  }

  const handleReportError = () => {
    console.log('Сообщить об ошибке')
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <picture>
            <source srcSet={notFoundImageWebp} type="image/webp" />
            <img 
              src={notFoundImagePng} 
              alt="Страница не найдена"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.description}>
          К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже
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