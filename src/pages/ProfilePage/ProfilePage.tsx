import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import type { SelectOption } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Textarea'
import { Calendar } from '@/shared/ui/Calendar'
import { AvatarUploadButton } from '@/shared/ui/AvatarUploadButton'
import { Container } from '@/shared/ui/Container'
import { fetchCities } from '@/api/cities'

import styles from './ProfilePage.module.css'

import editIcon from '@/shared/assets/icons/edit.svg'
import requestIcon from '@/shared/assets/icons/request.svg'
import likeIcon from '@/shared/assets/icons/like.svg'
import userIcon from '@/shared/assets/icons/user.svg'
import clockIcon from '@/shared/assets/icons/message-text.svg'
import ideaIcon from '@/shared/assets/icons/idea.svg'
import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg?react'

import type { Gender, User } from '@/entities/user/model/types'

import { getAuthUser, getRegisteredUsers } from '@/features/auth/model'
import type { AuthUser, RegisteredUser } from '@/features/auth/model'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

interface CityOption {
  value: string
  label: string
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'unspecified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

const parseDateValue = (value: string): Date | null => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const formatDateValue = (date: Date | null): string => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface ProfileFormData {
  email: string
  name: string
  birthday: string
  gender: Gender | 'unspecified'
  city: string
  about: string
  avatarUrl: string | null
}

const MENU_ITEMS = [
  { id: 'Заявки', label: 'Заявки', icon: requestIcon },
  { id: 'Мои обмены', label: 'Мои обмены', icon: clockIcon },
  { id: 'Избранное', label: 'Избранное', icon: likeIcon },
  { id: 'Мои навыки', label: 'Мои навыки', icon: ideaIcon },
  { id: 'Личные данные', label: 'Личные данные', icon: userIcon },
]

function saveRegisteredUsers(users: RegisteredUser[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users))
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Личные данные')
  const [cities, setCities] = useState<CityOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      email: '',
      name: '',
      birthday: '',
      gender: 'unspecified',
      city: '',
      about: '',
      avatarUrl: null,
    },
  })

  const avatar = watch('avatarUrl')
  const name = watch('name')

  useEffect(() => {
    const loadUserData = () => {
      try {
        setLoading(true)
        setError(null)

        const authUser = getAuthUser()

        if (!authUser) {
          setError('Пользователь не найден. Пожалуйста, войдите в систему.')
          setLoading(false)
          return
        }

        const registeredUsers = getRegisteredUsers()
        const registeredUser = registeredUsers.find((entry) => entry.user.id === authUser.id)

        if (!registeredUser) {
          setError('Данные пользователя не найдены')
          setLoading(false)
          return
        }

        const userData = registeredUser.user

        reset({
          email: userData.email || '',
          name: userData.name || '',
          birthday: userData.birthDate || '',
          gender: userData.gender || 'unspecified',
          city: userData.cityId || '',
          about: userData.about || '',
          avatarUrl: userData.avatarUrl || null,
        })

        setLoading(false)
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Ошибка загрузки данных пользователя')
        setLoading(false)
      }
    }

    loadUserData()
  }, [reset])

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await fetchCities()
        setCities(
          citiesData.map((city) => ({
            value: city.id,
            label: city.name,
          })),
        )
      } catch (err) {
        console.error('Error loading cities:', err)
        setError('Ошибка загрузки списка городов')
      }
    }

    void loadCities()
  }, [])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      setSaveSuccess(false)

      const authUser = getAuthUser()

      if (!authUser) {
        setError('Пользователь не найден')
        setIsSubmitting(false)
        return
      }

      const registeredUsers = getRegisteredUsers()
      const userIndex = registeredUsers.findIndex((entry) => entry.user.id === authUser.id)

      if (userIndex === -1) {
        setError('Данные пользователя не найдены')
        setIsSubmitting(false)
        return
      }

      const existingEntry = registeredUsers[userIndex]

      const updatedUser: User = {
        ...existingEntry.user,
        name: data.name,
        email: data.email,
        birthDate: data.birthday,
        gender: data.gender,
        cityId: data.city,
        about: data.about,
        avatarUrl: data.avatarUrl || null,
      }

      const updatedEntry: RegisteredUser = {
        ...existingEntry,
        user: updatedUser,
      }

      registeredUsers[userIndex] = updatedEntry
      saveRegisteredUsers(registeredUsers)

      if (authUser.name !== data.name || authUser.email !== data.email) {
        const updatedAuthUser: AuthUser = {
          ...authUser,
          name: data.name,
          email: data.email,
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedAuthUser))
      }

      setSaveSuccess(true)

      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error saving user data:', err)
      setError('Ошибка сохранения данных')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main>
        <Container>
          <div>Загрузка...</div>
        </Container>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <Container>
          <div className={styles.pageError}>{error}</div>
        </Container>
      </main>
    )
  }

  return (
    <main>
      <Container>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.menuButton} ${activeTab === item.id ? styles.activeButton : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <img src={item.icon} className={styles.menuIcon} alt="" aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </aside>

          <section className={styles.content}>
            {saveSuccess && <div className={styles.successMessage}>Данные успешно сохранены</div>}

            <form className={styles.profileGrid} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.formFields}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Введите корректный email',
                    },
                  }}
                  render={({ field: { ref: _ref, ...field } }) => (
                    <Input
                      {...field}
                      label="Почта"
                      placeholder="example@mail.com"
                      error={errors.email?.message}
                      endIcon={
                        <img src={editIcon} className={styles.editIcon} alt="" aria-hidden="true" />
                      }
                    />
                  )}
                />

                <button type="button" className={styles.passwordButton}>
                  Изменить пароль
                </button>

                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Имя обязательно' }}
                  render={({ field: { ref: _ref, ...field } }) => (
                    <Input
                      {...field}
                      label="Имя"
                      placeholder="Ваше имя"
                      error={errors.name?.message}
                      endIcon={
                        <img src={editIcon} className={styles.editIcon} alt="" aria-hidden="true" />
                      }
                    />
                  )}
                />

                <div className={styles.rowFields}>
                  <Controller
                    name="birthday"
                    control={control}
                    rules={{
                      required: 'Укажите дату рождения',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <Calendar
                        label="Дата рождения"
                        value={parseDateValue(value)}
                        onChange={(date) => onChange(formatDateValue(date))}
                        error={errors.birthday?.message}
                      />
                    )}
                  />

                  <Controller
                    name="gender"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label="Пол"
                        placeholder="Выберите"
                        options={GENDER_OPTIONS}
                        value={GENDER_OPTIONS.find((option) => option.value === value) ?? null}
                        onChange={(option) => onChange(option?.value ?? 'unspecified')}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="city"
                  control={control}
                  rules={{
                    required: 'Выберите город',
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label="Город"
                      placeholder="Выберите город"
                      options={cities}
                      value={cities.find((option) => option.value === value) ?? null}
                      onChange={(option) => onChange(option?.value ?? '')}
                      error={errors.city?.message}
                      isSearchable
                    />
                  )}
                />

                <div>
                  <Textarea
                    label="О себе"
                    placeholder="Расскажите о себе..."
                    withIcon
                    endIcon={<img src={editIcon} alt="" aria-hidden="true" />}
                    {...register('about')}
                  />
                </div>

                <Button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>

              <div className={styles.avatarContainer}>
                <AvatarUploadButton
                  value={avatar}
                  onChange={(newAvatar) => setValue('avatarUrl', newAvatar)}
                  alt={name || 'Пользователь'}
                  className={styles.avatarWrapper}
                  avatarClassName={styles.profileAvatar}
                  uploadButtonClassName={styles.profileUploadButton}
                  icon={<GalleryEditIcon className={styles.profileUploadIcon} aria-hidden="true" />}
                />
              </div>
            </form>
          </section>
        </div>
      </Container>
    </main>
  )
}
