import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import axios from 'axios'

import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import type { SelectOption } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { Avatar } from '@/shared/ui/Avatar'
import { Textarea } from '@/shared/ui/Textarea'
import { Calendar } from '@/shared/ui/Calendar'

import styles from './ProfilePage.module.css'

import editIcon from '@/shared/assets/icons/edit.svg'
import galleryEditIcon from '@/shared/assets/icons/gallery-edit.svg'
import requestIcon from '@/shared/assets/icons/request.svg'
import likeIcon from '@/shared/assets/icons/like.svg'
import userIcon from '@/shared/assets/icons/user.svg'
import clockIcon from '@/shared/assets/icons/message-text.svg'
import ideaIcon from '@/shared/assets/icons/idea.svg'
import { Container } from '@/shared/ui/Container'
import type { Gender, User } from '@/entities/user/model/types'
import type { City } from '@/entities/city/model/types'

interface CityOption {
  value: string
  label: string
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Не указан' },
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
  gender: Gender
  city: string
  about: string
  avatarUrl: string
}

const MENU_ITEMS = [
  { id: 'Заявки', label: 'Заявки', icon: requestIcon },
  { id: 'Мои обмены', label: 'Мои обмены', icon: clockIcon },
  { id: 'Избранное', label: 'Избранное', icon: likeIcon },
  { id: 'Мои навыки', label: 'Мои навыки', icon: ideaIcon },
  { id: 'Личные данные', label: 'Личные данные', icon: userIcon },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Личные данные')
  const [cities, setCities] = useState<CityOption[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      email: 'Maria@gmail.com',
      name: 'Мария',
      birthday: '1995-10-28',
      gender: 'female',
      city: 'city-01',
      about:
        'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
      avatarUrl: '',
    },
  })

  useEffect(() => {
    axios
      .get<City[]>('/db/cities.json')
      .then(({ data }) => {
        setCities(
          data.map((city) => ({
            value: city.id,
            label: city.name,
          })),
        )
      })
      .catch(console.error)
  }, [])

  const avatar = watch('avatarUrl')
  const name = watch('name')

  const onSubmit = (data: ProfileFormData) => {
    const user: User = {
      id: '',
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl || null,
      birthDate: data.birthday,
      cityId: data.city,
      gender: data.gender,
      teachSkillId: '',
      learnSubcategoryIds: [],
      likesCount: 0,
      createdAt: new Date().toISOString(),
      about: data.about,
      likedUserIds: [],
    }

    return user
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
            <form className={styles.profileGrid} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.formFields}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email обязателен',
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
                        onChange={(option) => onChange(option?.value ?? '')}
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

                <div className={styles.textareaContainer}>
                  <Textarea
                    label="О себе"
                    placeholder="Расскажите о себе..."
                    withIcon
                    endIcon={<img src={editIcon} alt="" aria-hidden="true" />}
                    {...register('about')}
                  />
                </div>
                <Button className={styles.submitButton} type="submit">
                  Сохранить
                </Button>
              </div>

              <div className={styles.avatarContainer}>
                <div className={styles.avatarWrapper}>
                  <Avatar className={styles.profileAvatar} src={avatar} alt={name} />
                  <button type="button" className={styles.avatarEditBtn}>
                    <img src={galleryEditIcon} alt="" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </Container>
    </main>
  )
}
