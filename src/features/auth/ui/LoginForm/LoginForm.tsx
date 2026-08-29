import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import EyeSlashIcon from '@/shared/assets/icons/eye-slash.svg?react'
import EyeIcon from '@/shared/assets/icons/eye.svg?react'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Text } from '@/shared/ui/Text'
import { SocialAuthButtons } from '../SocialAuthButtons'
import styles from './LoginForm.module.css'

interface LoginFormValues {
  email: string
  password: string
}

const GENERIC_ERROR = 'Email или пароль введены неверно. Пожалуйста проверьте правильность введённых данных.'

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const { register, handleSubmit } = useForm<LoginFormValues>()
  const emailField = register('email')
  const passwordField = register('password')

  // TODO: проверка пользователя по localStorage — следующий шаг
  const onSubmit = (values: LoginFormValues) => {
    if (!values.email || !values.password) {
      setLoginError(GENERIC_ERROR)
      return
    }
    setLoginError(null)
    console.log(values)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <SocialAuthButtons />

      <div className={styles.inputs}>
        <Input
          label="Email"
          placeholder="Введите email"
          error={loginError ? ' ' : undefined}
          {...emailField}
          onChange={(event) => {
            emailField.onChange(event)
            setLoginError(null)
          }}
        />
        <Input
          label="Пароль"
          placeholder="Введите ваш пароль"
          type={showPassword ? 'text' : 'password'}
          error={loginError ? ' ' : undefined}
          endIcon={
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          }
          {...passwordField}
          onChange={(event) => {
            passwordField.onChange(event)
            setLoginError(null)
          }}
        />
        {loginError && (
          <Text variant="caption" className={styles.formError}>
            {loginError}
          </Text>
        )}
      </div>

      <Button type="submit" variant="primary">
        Войти
      </Button>

      <Link to={ROUTES.REGISTER} className={styles.registerLink}>
        <Text as="span" variant="body">
          Зарегистрироваться
        </Text>
      </Link>
    </form>
  )
}
