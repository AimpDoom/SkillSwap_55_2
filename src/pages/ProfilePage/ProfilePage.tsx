import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

import { Input } from '../../shared/ui/Input'
import { Select } from '../../shared/ui/Select'
import { Button } from '../../shared/ui/Button'
import { Avatar } from '../../shared/ui/Avatar'
import { Textarea } from '../../shared/ui/Textarea'

import styles from './ProfilePage.module.css'

import editIcon from '../../shared/assets/icons/edit.svg'
import galleryEditIcon from '../../shared/assets/icons/gallery-edit.svg'
import calendarIcon from '../../shared/assets/icons/calendar.svg'
import requestIcon from '../../shared/assets/icons/request.svg'
import likeIcon from '../../shared/assets/icons/like.svg'
import userIcon from '../../shared/assets/icons/user.svg'
import clockIcon from '../../shared/assets/icons/clock.svg'
import ideaIcon from '../../shared/assets/icons/idea.svg'

interface CityOption {
  value: string
  label: string
}

interface ProfileFormData {
  email: string
  name: string
  birthday: string
  gender: string
  city: string
  about: string
  avatarUrl: string
}

type User = ProfileFormData

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
      city: 'Москва',
      about:
        'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
      avatarUrl: '',
    },
  })

  useEffect(() => {
    axios
      .get('/db/cities.json')
      .then(({ data }) => {
        if (!Array.isArray(data)) return

        const result = data.map(
          (item: string | { name?: string; value?: string; label?: string }) => {
            if (typeof item === 'string') {
              return {
                value: item,
                label: item,
              }
            }

            return {
              value: item.value ?? item.name ?? '',
              label: item.label ?? item.name ?? '',
            }
          },
        )

        setCities(result)
      })
      .catch(console.error)
  }, [])

  const avatar = watch('avatarUrl')
  const name = watch('name')

  const onSubmit = (data: ProfileFormData) => {
    const user: User = {
      ...data,
    }

    console.log(user)
    alert('Профиль успешно сохранён!')
  }

  return (
    <main className={styles.container}>
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
        {activeTab === 'Личные данные' ? (
          <form className={styles.profileGrid} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFields}>
              <Input
                label="Почта"
                placeholder="example@mail.com"
                error={errors.email?.message}
                endIcon={
                  <img src={editIcon} className={styles.editIcon} alt="" aria-hidden="true" />
                }
                {...register('email', {
                  required: 'Email обязателен',
                })}
              />

              <button type="button" className={styles.passwordButton}>
                Изменить пароль
              </button>

              <Input
                label="Имя"
                placeholder="Ваше имя"
                error={errors.name?.message}
                endIcon={
                  <img src={editIcon} className={styles.editIcon} alt="" aria-hidden="true" />
                }
                {...register('name', {
                  required: 'Имя обязательно',
                })}
              />

              <div className={styles.rowFields}>
                <Input
                  label="Дата рождения"
                  type="date"
                  error={errors.birthday?.message}
                  endIcon={
                    <div className={styles.visualCalendarContainer}>
                      <img
                        src={calendarIcon}
                        className={styles.editIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  }
                  {...register('birthday', {
                    required: 'Укажите дату рождения',
                  })}
                />

                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Пол"
                      placeholder="Выберите"
                      options={[
                        {
                          value: 'male',
                          label: 'Мужской',
                        },
                        {
                          value: 'female',
                          label: 'Женский',
                        },
                      ]}
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
                render={({ field }) => (
                  <Select {...field} label="Город" placeholder="Выберите город" options={cities} />
                )}
              />

              {errors.city && <span className={styles.errorText}>{errors.city.message}</span>}

              <div className={styles.textareaContainer}>
                <Textarea
                  label="О себе"
                  placeholder="Расскажите о себе..."
                  endIcon={<img src={editIcon} alt="" aria-hidden="true" />}
                  {...register('about')}
                />
              </div>
              <Button type="submit">Сохранить</Button>
            </div>

            <div className={styles.avatarContainer}>
              <div className={styles.avatarWrapper}>
                <Avatar src={avatar} alt={name} />

                <button type="button" className={styles.avatarEditBtn}>
                  <img src={galleryEditIcon} alt="" aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.placeholder}>
            <h2>{activeTab}</h2>
            <p>Раздел работает как визуальный переключатель.</p>
          </div>
        )}
      </section>
    </main>
  )
}
