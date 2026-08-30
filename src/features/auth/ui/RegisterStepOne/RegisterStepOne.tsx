import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import EyeSlashIcon from '@/shared/assets/icons/eye-slash.svg?react'
import EyeIcon from '@/shared/assets/icons/eye.svg?react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { SocialAuthButtons } from '../SocialAuthButtons'
import styles from './RegisterStepOne.module.css'

interface RegisterStepOneValues {
  email: string
  password: string
}

export interface RegisterStepOneProps {
  onNext: () => void
}

const schema = yup.object({
  email: yup.string().required('Введите email').email('Введите корректный email'),
  password: yup
    .string()
    .required('Введите пароль')
    .min(8, 'Пароль должен содержать не менее 8 знаков'),
})

// TODO: данные между шагами пока не копим — только вёрстка + проверка формата на этом шаге
export const RegisterStepOne = ({ onNext }: RegisterStepOneProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStepOneValues>({ resolver: yupResolver(schema) })

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
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          }
          {...register('password')}
        />
      </div>

      <Button type="submit" variant="primary">
        Далее
      </Button>
    </form>
  )
}
