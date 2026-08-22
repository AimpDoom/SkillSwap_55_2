import { useLocation, useNavigate } from 'react-router-dom';

import { AuthForm } from '@/features/auth/ui';
import { Logo } from '@/shared/ui/Logo';
import lightBulb from '@/shared/assets/images/auth/light-bulb.svg';

import styles from './LoginPage.module.css';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === '/register';
  const mode = isRegister ? 'register' : 'login';

  const handleModeChange = () => {
    navigate('/register');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <main className={styles.page}>
     <header className={styles.header}>
  <div className={styles.headerTop}>
    <Logo />

    <button
      className={styles.closeButton}
      type="button"
      onClick={handleClose}
      aria-label="Закрыть"
    >
      <span>Закрыть</span>
      <span className={styles.closeIcon} aria-hidden="true">
        ×
      </span>
    </button>
  </div>

  <div className={styles.heading}>
    <h1 className={styles.title}>
      {isRegister ? 'Регистрация' : 'Вход'}
    </h1>

    {isRegister && (
      <div
        className={styles.steps}
        aria-label="Шаг 1 из 3"
      >
        <span
          className={`${styles.step} ${styles.stepActive}`}
        />
        <span className={styles.step} />
        <span className={styles.step} />
      </div>
    )}
  </div>
</header>
      <div className={styles.content}>
        <AuthForm
          mode={mode}
          onModeChange={handleModeChange}
        />

        <section
          className={styles.onboarding}
          aria-label={
            isRegister
              ? 'Добро пожаловать в SkillSwap'
              : 'С возвращением в SkillSwap'
          }
        >
          <img
            className={styles.illustration}
            src={lightBulb}
            alt=""
            aria-hidden="true"
          />

          <div className={styles.onboardingText}>
            <h2 className={styles.onboardingTitle}>
              {isRegister
                ? 'Добро пожаловать в SkillSwap!'
                : 'С возвращением в SkillSwap!'}
            </h2>

            <p className={styles.onboardingDescription}>
              {isRegister
                ? 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми'
                : 'Обменивайтесь знаниями и навыками с другими людьми'}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
