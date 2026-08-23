import { useId, useState } from 'react'
import type { FormEvent } from 'react'

import appleIcon from '@/shared/assets/icons/auth/apple.svg'
import eyeIcon from '@/shared/assets/icons/auth/eye.svg'
import googleIcon from '@/shared/assets/icons/auth/google.svg'
import { Button } from '@/shared/ui/Button'

import styles from './AuthForm.module.css'

export type AuthFormMode = 'login' | 'register'

export type AuthFormValues = {
  email: string
  password: string
}

type AuthFormProps = {
  mode?: AuthFormMode
  onSubmit?: (values: AuthFormValues) => void
  onModeChange?: (mode: AuthFormMode) => void
  onGoogleClick?: () => void
  onAppleClick?: () => void
}

type FormErrors = {
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export function AuthForm({
  mode = 'login',
  onSubmit,
  onModeChange,
  onGoogleClick,
  onAppleClick,
}: AuthFormProps) {
  const emailId = useId()
  const passwordId = useId()

  const emailErrorId = `${emailId}-error`
  const passwordMessageId = `${passwordId}-message`

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const isLogin = mode === 'login'

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Введите корректный email'
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = 'Пароль должен содержать не менее 8 знаков'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit?.({
      email: email.trim(),
      password,
    })
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)

    if (errors.email) {
      setErrors((current) => ({
        ...current,
        email: undefined,
      }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)

    if (errors.password) {
      setErrors((current) => ({
        ...current,
        password: undefined,
      }))
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formContent}>
        <div className={styles.socialButtons}>
          <Button
            className={styles.socialButton}
            type="button"
            variant="secondary"
            onClick={onGoogleClick}
          >
            <img className={styles.socialIcon} src={googleIcon} alt="" aria-hidden="true" />

            <span>Продолжить с Google</span>
          </Button>

          <Button
            className={styles.socialButton}
            type="button"
            variant="secondary"
            onClick={onAppleClick}
          >
            <img className={styles.socialIcon} src={appleIcon} alt="" aria-hidden="true" />

            <span>Продолжить с Apple</span>
          </Button>
        </div>

        <div className={styles.divider} aria-hidden="true">
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>или</span>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.inputs}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={emailId}>
              Email
            </label>

            <input
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              id={emailId}
              name="email"
              type="email"
              value={email}
              placeholder="Введите email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? emailErrorId : undefined}
              onChange={(event) => handleEmailChange(event.target.value)}
            />

            {errors.email && (
              <span className={styles.errorMessage} id={emailErrorId} role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={passwordId}>
              Пароль
            </label>

            <div className={styles.passwordControl}>
              <input
                className={`${styles.input} ${
                  styles.passwordInput
                } ${errors.password ? styles.inputError : ''}`}
                id={passwordId}
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                placeholder={isLogin ? 'Введите ваш пароль' : 'Придумайте надёжный пароль'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={passwordMessageId}
                onChange={(event) => handlePasswordChange(event.target.value)}
              />

              <button
                className={styles.eyeButton}
                type="button"
                aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                <img className={styles.eyeIcon} src={eyeIcon} alt="" aria-hidden="true" />
              </button>
            </div>

            <span
              className={errors.password ? styles.errorMessage : styles.helperText}
              id={passwordMessageId}
              role={errors.password ? 'alert' : undefined}
            >
              {errors.password ?? (!isLogin ? 'Пароль должен содержать не менее 8 знаков' : '')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button className={styles.submitButton} type="submit" variant="primary">
          {isLogin ? 'Войти' : 'Далее'}
        </Button>

        {isLogin && (
          <button
            className={styles.modeButton}
            type="button"
            onClick={() => onModeChange?.('register')}
          >
            Зарегистрироваться
          </button>
        )}
      </div>
    </form>
  )
}
