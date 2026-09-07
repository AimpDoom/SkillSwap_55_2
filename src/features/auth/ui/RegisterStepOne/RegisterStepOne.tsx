import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import type { AuthFormValues } from '../../model'
import EyeSlashIcon from '@/shared/assets/icons/eye-slash.svg?react'
import EyeIcon from '@/shared/assets/icons/eye.svg?react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { SocialAuthButtons } from '../SocialAuthButtons'
import { ROUTES } from '@/shared/lib/constants'
import { Link } from 'react-router-dom'
import { Text } from '@/shared/ui/Text'
import styles from './RegisterStepOne.module.css'

export interface RegisterStepOneProps {
  initialValues: AuthFormValues | null
  onNext: (values: AuthFormValues) => void
}

const schema = yup.object({
  email: yup.string().required('Введите email').email('Введите корректный email'),
  password: yup
    .string()
    .required('Введите пароль')
    .min(8, 'Пароль должен содержать не менее 8 знаков'),
})

// Копим email и пароль в общем черновике: initialValues приходят из черновика
// RegisterPage, onNext — сохранить их и перейти на следующий шаг
export const RegisterStepOne = ({ initialValues, onNext }: RegisterStepOneProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues ?? { email: '', password: '' },
  })

  return (
    <form className={styles.form} onSubmit={handleSubmit(onNext)} noValidate>
      <SocialAuthButtons />

      <div className={styles.inputs}>
        <Input
          label="Email"
          placeholder="Введите email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Пароль"
          placeholder="Придумайте надёжный пароль"
          type={showPassword ? 'text' : 'password'}
          error={errors.password?.message}
          endIcon={
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeSlashIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
            </button>
          }
          {...register('password')}
        />
      </div>

      <Button type="submit" variant="primary">
        Далее
      </Button>

      <Link to={ROUTES.LOGIN} className={styles.loginLink}>
        <Text as="span" variant="body">
          Уже есть аккаунт? Войти
        </Text>
      </Link>
    </form>
  )
}
