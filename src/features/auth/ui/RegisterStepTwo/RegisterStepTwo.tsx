import { useMemo, useState } from 'react'
import { useCategories } from '@/entities/category/model/useCategories'
import { useCities } from '@/entities/city/model/useCities'
import type { Gender } from '@/entities/user/model/types'
import { AvatarUploadButton } from '@/shared/ui/AvatarUploadButton'
import { Button } from '@/shared/ui/Button'
import { Calendar } from '@/shared/ui/Calendar'
import { Input } from '@/shared/ui/Input'
import { MultiSelect, type MultiSelectOption } from '@/shared/ui/MultiSelect'
import { Select, type SelectOption } from '@/shared/ui/Select'
import styles from './RegisterStepTwo.module.css'

export interface RegisterStepTwoProps {
  onBack: () => void
  onNext: () => void
}

const GENDER_OPTIONS: Array<SelectOption & { value: Gender | 'unspecified' }> = [
  { value: 'unspecified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

interface StepTwoErrors {
  name?: string
  birthDate?: string
  gender?: string
  city?: string
  categories?: string
  subcategories?: string
}

export const RegisterStepTwo = ({ onBack, onNext }: RegisterStepTwoProps) => {
  const { categories: categoryList } = useCategories()
  const { cities } = useCities()

  // TODO: ниже состояние для загрузки аватарки
  // const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [gender, setGender] = useState<SelectOption | null>(null)
  const [city, setCity] = useState<SelectOption | null>(null)
  const [categories, setCategories] = useState<MultiSelectOption[]>([])
  const [subcategories, setSubcategories] = useState<MultiSelectOption[]>([])
  const [errors, setErrors] = useState<StepTwoErrors>({})

  const cityOptions: SelectOption[] = useMemo(
    () => cities.map((item) => ({ value: item.id, label: item.name })),
    [cities],
  )

  const categoryOptions: MultiSelectOption[] = useMemo(
    () => categoryList.map((category) => ({ value: category.id, label: category.name })),
    [categoryList],
  )

  const subcategoriesByCategory = useMemo(() => {
    const map: Record<string, MultiSelectOption[]> = {}
    categoryList.forEach((category) => {
      map[category.id] = category.subcategories.map((sub) => ({ value: sub.id, label: sub.name }))
    })
    return map
  }, [categoryList])

  const categoryBySubcategory = useMemo(() => {
    const map: Record<string, string> = {}
    categoryList.forEach((category) => {
      category.subcategories.forEach((sub) => {
        map[sub.id] = category.id
      })
    })
    return map
  }, [categoryList])

  const subcategoryOptions =
    categories.length > 0
      ? categories.flatMap((category) => subcategoriesByCategory[category.value] ?? [])
      : Object.values(subcategoriesByCategory).flat()

  const handleCategoriesChange = (next: MultiSelectOption[]) => {
    setCategories(next)
    const nextValues = next.flatMap((category) => subcategoriesByCategory[category.value] ?? []).map((o) => o.value)
    setSubcategories((prev) => prev.filter((sub) => nextValues.includes(sub.value)))
    setErrors((prev) => ({ ...prev, categories: undefined }))
  }

  const handleSubcategoriesChange = (next: MultiSelectOption[]) => {
    setSubcategories(next)
    const requiredCategoryValues = next.map((sub) => categoryBySubcategory[sub.value]).filter(Boolean)
    setCategories((prev) => {
      const missing = requiredCategoryValues.filter(
        (value) => !prev.some((category) => category.value === value),
      )
      if (missing.length === 0) return prev
      const added = missing
        .map((value) => categoryOptions.find((category) => category.value === value))
        .filter((category): category is MultiSelectOption => Boolean(category))
      return [...prev, ...added]
    })
    setErrors((prev) => ({ ...prev, subcategories: undefined }))
  }

  const validate = (): StepTwoErrors => {
    const nextErrors: StepTwoErrors = {}
    if (!name.trim()) nextErrors.name = 'Введите имя'
    if (!birthDate) nextErrors.birthDate = 'Укажите дату рождения'
    if (!gender) nextErrors.gender = 'Выберите пол'
    if (!city) nextErrors.city = 'Выберите город'
    if (categories.length === 0) nextErrors.categories = 'Выберите хотя бы одну категорию'
    if (subcategories.length === 0) nextErrors.subcategories = 'Выберите хотя бы одну подкатегорию'
    return nextErrors
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onNext()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <AvatarUploadButton alt="Фото пользователя" className={styles.avatar} />
      <div className={styles.inputs}>
        <Input
          name="name"
          label="Имя"
          placeholder="Введите ваше имя"
          value={name}
          error={errors.name}
          onChange={(event) => {
            setName(event.target.value)
            setErrors((prev) => ({ ...prev, name: undefined }))
          }}
        />
        <div className={styles.row}>
          <Calendar
            label="Дата рождения"
            value={birthDate}
            error={errors.birthDate}
            onChange={(value) => {
              setBirthDate(value)
              setErrors((prev) => ({ ...prev, birthDate: undefined }))
            }}
          />
          <Select
            label="Пол"
            placeholder="Не указан"
            options={GENDER_OPTIONS}
            value={gender}
            error={errors.gender}
            onChange={(value) => {
              setGender(value)
              setErrors((prev) => ({ ...prev, gender: undefined }))
            }}
          />
        </div>
        <Select
          label="Город"
          placeholder="Не указан"
          options={cityOptions}
          value={city}
          error={errors.city}
          onChange={(value) => {
            setCity(value)
            setErrors((prev) => ({ ...prev, city: undefined }))
          }}
          isSearchable
        />
        <MultiSelect
          label="Категория навыка, которому хотите научиться"
          placeholder="Выберите категорию"
          options={categoryOptions}
          value={categories}
          error={errors.categories}
          onChange={handleCategoriesChange}
        />
        <MultiSelect
          label="Подкатегория навыка, которому хотите научиться"
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          value={subcategories}
          error={errors.subcategories}
          onChange={handleSubcategoriesChange}
        />
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" variant="primary">
          Продолжить
        </Button>
      </div>
    </form>
  )
}
