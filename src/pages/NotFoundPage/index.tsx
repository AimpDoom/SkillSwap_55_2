// src/pages/NotFoundPage/index.tsx
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './NotFoundPage.module.css'
import notFoundImageWebp from '@/shared/assets/images/NotFoundPageImages/error404.webp'
import notFoundImagePng from '@/shared/assets/images/NotFoundPageImages/error404.png'

export default function NotFoundPage() {
  const navigate = useNavigate()

  /**
   * Обработчик перехода на главную страницу
   * Использует ROUTES.HOME для навигации
   */
  const handleGoHome = () => {
    navigate(ROUTES.HOME)
  }

  /**
   * Обработчик кнопки "Сообщить об ошибке"
   * На данном этапе является UI-заглушкой
   * В будущем здесь будет реализована логика отправки сообщения об ошибке
   */
  const handleReportError = () => {
    // TODO: реализовать отправку сообщения об ошибке
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
        <h2 className={styles.title}>Страница не найдена</h2>
        <p className={styles.description}>
          К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.secondaryButton} onClick={handleReportError}>
            Сообщить об ошибке
          </button>

          <button className={styles.primaryButton} onClick={handleGoHome}>
            На главную
          </button>
        </div>
      </div>
    </main>
  )
}