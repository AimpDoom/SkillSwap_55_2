import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Button } from '../../shared/ui/Button';
import { Avatar } from '../../shared/ui/Avatar';
import { Textarea } from '../../shared/ui/Textarea';
import styles from './ProfilePage.module.css';

import editIcon from '../../shared/assets/icons/edit.svg';
import galleryEditIcon from '../../shared/assets/icons/gallery-edit.svg';

// Иконки для боковой панели по макету
import requestIcon from '../../shared/assets/icons/request.svg';
import likeIcon from '../../shared/assets/icons/like.svg';
import userIcon from '../../shared/assets/icons/user.svg';
import clockIcon from '../../shared/assets/icons/clock.svg'; // или любая другая для обменов
import ideaIcon from '../../shared/assets/icons/idea.svg';   // или другая для навыков


interface CityOption {
  value: string;
  label: string;
}

interface ProfileFormData {
  email: string;
  name: string;
  birthday: string;
  gender: string;
  city: string;
  about: string;
  avatarUrl: string;
}

const MENU_ITEMS = [
  { id: 'Заявки', label: 'Заявки', icon: requestIcon },
  { id: 'Мои обмены', label: 'Мои обмены', icon: clockIcon },
  { id: 'Избранное', label: 'Избранное', icon: likeIcon },
  { id: 'Мои навыки', label: 'Мои навыки', icon: ideaIcon },
  { id: 'Личные данные', label: 'Личные данные', icon: userIcon },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>('Личные данные');
  const [cities, setCities] = useState<CityOption[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      email: 'Maria@gmail.com', // дефолтные значения как на макете
      name: 'Мария',
      birthday: '1995-10-28',
      gender: 'female',
      city: 'Москва',
      about: 'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
      avatarUrl: '',
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log('Сформированный объект User:', data);
    alert('Профиль успешно сохранен!');
  };

  const currentAvatarUrl = watch('avatarUrl') || '';
  const currentName = watch('name') || 'Мария';

  useEffect(() => {
    axios.get('/db/cities.json')
      .then(res => { if (Array.isArray(res.data)) setCities(res.data); })
      .catch(err => console.error('Ошибка загрузки городов:', err));
  }, []);

  return (
    <main className={styles.container}>
      {/* Боковая панель с иконками по макету */}
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


      {/* Основной контент */}
      <section className={styles.content}>
        {activeTab === 'Личные данные' ? (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.profileGrid}>

            {/* Левая колонка формы */}
            <div className={styles.formFields}>

              <Input
                label="Почта"
                placeholder="example@mail.com"
                error={errors.email?.message}
                endIcon={<img src={editIcon} className={styles.editIcon} alt="Редактировать" />}
                {...register('email', { required: 'Email обязателен' })}
              />

              <button type="button" className={styles.passwordButton}>
                Изменить пароль
              </button>

              <Input
                label="Имя"
                placeholder="Ваше имя"
                error={errors.name?.message}
                endIcon={<img src={editIcon} className={styles.editIcon} alt="Редактировать" />}
                {...register('name', { required: 'Имя обязательно' })}
              />

              {/* Дата рождения и Пол в один ряд */}
              <div className={styles.rowFields}>
                <Input
                  label="Дата рождения"
                  type="date"
                  error={errors.birthday?.message}
                  {...register('birthday', { required: 'Укажите дату рождения' })}
                />

                <div className={styles.selectWrapper}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Пол"
                        placeholder="Выберите"
                        options={[
                          { value: 'male', label: 'Мужской' },
                          { value: 'female', label: 'Женский' }
                        ]}
                      />
                    )}
                  />
                </div>
              </div>

              <div className={styles.selectWrapper}>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: 'Выберите город' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Город"
                      options={cities}
                      placeholder="Выберите город"
                    />
                  )}
                />
                {errors.city?.message && <span className={styles.errorText}>{errors.city.message}</span>}
              </div>

              <Textarea
                label="О себе"
                placeholder="Расскажите о себе..."
                error={errors.about?.message}
                {...register('about')}
              />

              <Button type="submit" className={styles.submitBtn}>Сохранить</Button>
            </div>

            {/* Правая колонка: Аватар с кнопкой изменения */}
            <div className={styles.avatarContainer}>
              <div className={styles.avatarWrapper}>
                <Avatar
                  src={currentAvatarUrl}
                  alt={currentName}
                />
                <button type="button" className={styles.avatarEditBtn} aria-label="Изменить фото">
  <img src={galleryEditIcon} alt="" aria-hidden="true" />
</button>

              </div>
            </div>

          </form>
        ) : (
          <div>
            <h2>{activeTab}</h2>
            <p>Раздел работает в режиме визуального переключателя.</p>
          </div>
        )}
      </section>
    </main>
  );
}
