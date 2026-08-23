import { useState } from 'react'
import type { FormEvent } from 'react'

import type { AuthFormMode, AuthFormValues } from '@/features/auth/model'
import appleIcon from '@/shared/assets/icons/auth/apple.svg'
import eyeIcon from '@/shared/assets/icons/auth/eye.svg'
import googleIcon from '@/shared/assets/icons/auth/google.svg'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Input } from '@/shared/ui/Input'

import styles from './AuthForm.module.css'

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

  const passwordIcon = <img className={styles.eyeIcon} src={eyeIcon} alt="" aria-hidden="true" />

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
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            placeholder="Введите email"
            autoComplete="email"
            error={errors.email}
            onChange={(event) => handleEmailChange(event.target.value)}
          />

          <div className={styles.passwordField}>
            <Input
              label="Пароль"
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              placeholder={isLogin ? 'Введите ваш пароль' : 'Придумайте надёжный пароль'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              error={errors.password}
              hint={!isLogin ? 'Пароль должен содержать не менее 8 знаков' : undefined}
              onChange={(event) => handlePasswordChange(event.target.value)}
            />

            <IconButton
              className={styles.eyeButton}
              icon={passwordIcon}
              ariaLabel={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
              aria-pressed={isPasswordVisible}
              onClick={() => setIsPasswordVisible((current) => !current)}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button className={styles.submitButton} type="submit" variant="primary">
          {isLogin ? 'Войти' : 'Далее'}
        </Button>

        {isLogin && (
          <Button
            className={styles.modeButton}
            type="button"
            variant="tertiary"
            onClick={() => onModeChange?.('register')}
          >
            Зарегистрироваться
          </Button>
        )}
      </div>
    </form>
  )
}
