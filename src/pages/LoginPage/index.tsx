import { useLocation, useNavigate } from 'react-router-dom'

import type { AuthFormValues } from '@/features/auth/model'
import { useRegistrationFlow } from '@/features/auth/model'
import { AuthForm } from '@/features/auth/ui'
import closeIcon from '@/shared/assets/icons/cross.svg'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import { Logo } from '@/shared/ui/Logo'
import { Stepper } from '@/shared/ui/Stepper'
import { PromoPanel } from '@/shared/ui/PromoPanel'
import LightBulbImage from '@/shared/assets/images/light-bulb.svg?react'

import styles from './LoginPage.module.css'

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const registration = useRegistrationFlow()

  const isRegister = location.pathname === ROUTES.REGISTER
  const isLogin = location.pathname === ROUTES.LOGIN

  const handleModeChange = () => {
    registration.reset()
    navigate(ROUTES.REGISTER)
  }

  const handleClose = () => {
    registration.reset()
    navigate(ROUTES.HOME)
  }

  const handleRegisterSubmit = (values: AuthFormValues) => {
    registration.saveAccount(values)
    registration.goNext()
  }

  const getPageTitle = () => {
    if (!isRegister) {
      return 'Вход'
    }

    if (registration.currentStep === 1) {
      return 'Регистрация'
    }

    return `Шаг ${registration.currentStep} из 3`
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Logo />

          <Button
            className={styles.closeButton}
            type="button"
            variant="tertiary"
            onClick={handleClose}
            aria-label="Закрыть"
          >
            <span>Закрыть</span>

            <img className={styles.closeIcon} src={closeIcon} alt="" aria-hidden="true" />
          </Button>
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>{getPageTitle()}</h1>

          {isRegister && <Stepper currentStep={registration.currentStep} />}
        </div>
      </header>

      <div className={styles.content}>
        {isLogin && <AuthForm mode="login" onModeChange={handleModeChange} />}

        {isRegister && registration.currentStep === 1 && (
          <AuthForm mode="register" onSubmit={handleRegisterSubmit} />
        )}

        {isRegister && registration.currentStep === 2 && (
          <section className={styles.pendingStep}>
            <div className={styles.pendingStepContent}>
              <h2 className={styles.pendingStepTitle}>Второй шаг регистрации</h2>

              <p className={styles.pendingStepDescription}>
                Форма личной информации будет реализована в отдельной задаче.
              </p>
            </div>

            <div className={styles.pendingStepActions}>
              <Button
                className={styles.pendingStepButton}
                type="button"
                variant="secondary"
                onClick={registration.goBack}
              >
                Назад
              </Button>

              <Button
                className={styles.pendingStepButton}
                type="button"
                variant="primary"
                onClick={registration.goNext}
              >
                Продолжить
              </Button>
            </div>
          </section>
        )}

        {isRegister && registration.currentStep === 3 && (
          <section className={styles.pendingStep}>
            <div className={styles.pendingStepContent}>
              <h2 className={styles.pendingStepTitle}>Третий шаг регистрации</h2>

              <p className={styles.pendingStepDescription}>
                Форма добавления навыка будет реализована в отдельной задаче.
              </p>
            </div>

            <div className={styles.pendingStepActions}>
              <Button
                className={styles.pendingStepButton}
                type="button"
                variant="secondary"
                onClick={registration.goBack}
              >
                Назад
              </Button>
            </div>
          </section>
        )}

        <PromoPanel
          image={<LightBulbImage />}
          title="С возвращением в SkillSwap!"
          description="Обменивайтесь знаниями и навыками с другими людьми"
        />
      </div>
    </main>
  )
}
