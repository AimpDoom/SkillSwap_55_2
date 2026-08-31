import { useMemo, useState } from 'react'
import { useCategories } from '@/entities/category/model/useCategories'
import { useCities } from '@/entities/city/model/useCities'
import type { Gender } from '@/entities/user/model/types'
import type { RegistrationProfileDraft } from '@/features/auth/model'
import { AvatarUploadButton } from '@/shared/ui/AvatarUploadButton'
import { Button } from '@/shared/ui/Button'
import { Calendar } from '@/shared/ui/Calendar'
import { Input } from '@/shared/ui/Input'
import { MultiSelect, type MultiSelectOption } from '@/shared/ui/MultiSelect'
import { Select, type SelectOption } from '@/shared/ui/Select'
import styles from './RegisterStepTwo.module.css'

export interface RegisterStepTwoProps {
  initialValues: RegistrationProfileDraft | null
  onBack: (values: RegistrationProfileDraft) => void
  onNext: (values: RegistrationProfileDraft) => void
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

const isoToDate = (iso: string | null): Date | null => (iso ? new Date(`${iso}T00:00:00`) : null)

const dateToIso = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const RegisterStepTwo = ({ initialValues, onBack, onNext }: RegisterStepTwoProps) => {
  const { categories: categoryList } = useCategories()
  const { cities } = useCities()

  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialValues?.avatarUrl ?? null)
  const [name, setName] = useState(initialValues?.name ?? '')
  const [birthDate, setBirthDate] = useState<Date | null>(isoToDate(initialValues?.birthDate ?? null))
  const [gender, setGender] = useState<Gender | 'unspecified' | null>(
    initialValues?.gender ?? null,
  )
  const [cityId, setCityId] = useState<string | null>(initialValues?.cityId ?? null)
  const [learnCategoryIds, setLearnCategoryIds] = useState<string[]>(
    initialValues?.learnCategoryIds ?? [],
  )
  const [learnSubcategoryIds, setLearnSubcategoryIds] = useState<string[]>(
    initialValues?.learnSubcategoryIds ?? [],
  )
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
    learnCategoryIds.length > 0
      ? learnCategoryIds.flatMap((id) => subcategoriesByCategory[id] ?? [])
      : Object.values(subcategoriesByCategory).flat()

  const selectedCategoryOptions = categoryOptions.filter((option) =>
    learnCategoryIds.includes(option.value),
  )
  const selectedSubcategoryOptions = subcategoryOptions.filter((option) =>
    learnSubcategoryIds.includes(option.value),
  )

  const handleCategoriesChange = (next: MultiSelectOption[]) => {
    const nextIds = next.map((option) => option.value)
    setLearnCategoryIds(nextIds)
    const allowedSubcategories = new Set(
      nextIds.flatMap((id) => (subcategoriesByCategory[id] ?? []).map((option) => option.value)),
    )
    setLearnSubcategoryIds((prev) => prev.filter((id) => allowedSubcategories.has(id)))
    setErrors((prev) => ({ ...prev, categories: undefined }))
  }

  const handleSubcategoriesChange = (next: MultiSelectOption[]) => {
    const nextIds = next.map((option) => option.value)
    setLearnSubcategoryIds(nextIds)
    setLearnCategoryIds((prev) => {
      const missing = nextIds
        .map((id) => categoryBySubcategory[id])
        .filter((categoryId) => categoryId && !prev.includes(categoryId))
      if (missing.length === 0) return prev
      return [...prev, ...new Set(missing)]
    })
    setErrors((prev) => ({ ...prev, subcategories: undefined }))
  }

  const validate = (): StepTwoErrors => {
    const nextErrors: StepTwoErrors = {}
    if (!name.trim()) nextErrors.name = 'Введите имя'
    if (!birthDate) nextErrors.birthDate = 'Укажите дату рождения'
    if (!gender) nextErrors.gender = 'Выберите пол'
    if (!cityId) nextErrors.city = 'Выберите город'
    if (learnCategoryIds.length === 0) nextErrors.categories = 'Выберите хотя бы одну категорию'
    if (learnSubcategoryIds.length === 0)
      nextErrors.subcategories = 'Выберите хотя бы одну подкатегорию'
    return nextErrors
  }

  const collectValues = (): RegistrationProfileDraft => ({
    name,
    birthDate: birthDate ? dateToIso(birthDate) : null,
    gender,
    cityId,
    learnCategoryIds,
    learnSubcategoryIds,
    avatarUrl,
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onNext(collectValues())
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <AvatarUploadButton
        value={avatarUrl}
        onChange={setAvatarUrl}
        alt="Фото пользователя"
        className={styles.avatar}
      />
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
            value={GENDER_OPTIONS.find((option) => option.value === gender) ?? null}
            error={errors.gender}
            onChange={(value) => {
              setGender((value?.value as Gender | 'unspecified') ?? null)
              setErrors((prev) => ({ ...prev, gender: undefined }))
            }}
          />
        </div>
        <Select
          label="Город"
          placeholder="Не указан"
          options={cityOptions}
          value={cityOptions.find((option) => option.value === cityId) ?? null}
          error={errors.city}
          onChange={(value) => {
            setCityId(value?.value ?? null)
            setErrors((prev) => ({ ...prev, city: undefined }))
          }}
          isSearchable
        />
        <MultiSelect
          label="Категория навыка, которому хотите научиться"
          placeholder="Выберите категорию"
          options={categoryOptions}
          value={selectedCategoryOptions}
          error={errors.categories}
          onChange={handleCategoriesChange}
        />
        <MultiSelect
          label="Подкатегория навыка, которому хотите научиться"
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          value={selectedSubcategoryOptions}
          error={errors.subcategories}
          onChange={handleSubcategoriesChange}
        />
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => onBack(collectValues())}>
          Назад
        </Button>
        <Button type="submit" variant="primary">
          Продолжить
        </Button>
      </div>
    </form>
  )
}
