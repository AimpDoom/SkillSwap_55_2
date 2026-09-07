import { useMemo, useState } from 'react'
import { useCategories } from '@/entities/category'
import type { RegistrationSkillDraft } from '../../model'
import { Button } from '@/shared/ui/Button'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import styles from './RegisterStepThree.module.css'

const TITLE_MIN_LENGTH = 3
const TITLE_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 500

export interface RegisterStepThreeProps {
  initialValues: RegistrationSkillDraft | null
  onBack: (values: RegistrationSkillDraft) => void
  onNext: (values: RegistrationSkillDraft) => void
}

interface StepThreeErrors {
  title?: string
  category?: string
  subcategory?: string
  description?: string
}

export const RegisterStepThree = ({ initialValues, onBack, onNext }: RegisterStepThreeProps) => {
  const { categories: categoryList } = useCategories()

  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [categoryId, setCategoryId] = useState<string | null>(initialValues?.categoryId ?? null)
  const [subcategoryId, setSubcategoryId] = useState<string | null>(
    initialValues?.subcategoryId ?? null,
  )
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [imageUrls, setImageUrls] = useState<string[]>(initialValues?.imageUrls ?? [])
  const [errors, setErrors] = useState<StepThreeErrors>({})

  const categoryOptions: SelectOption[] = useMemo(
    () => categoryList.map((item) => ({ value: item.id, label: item.name })),
    [categoryList],
  )

  const categoryBySubcategory = useMemo(() => {
    const map: Record<string, string> = {}
    categoryList.forEach((item) => {
      item.subcategories.forEach((sub) => {
        map[sub.id] = item.id
      })
    })
    return map
  }, [categoryList])

  const subcategoryOptions: SelectOption[] = useMemo(() => {
    if (!categoryId) {
      return categoryList.flatMap((item) =>
        item.subcategories.map((sub) => ({ value: sub.id, label: sub.name })),
      )
    }
    const found = categoryList.find((item) => item.id === categoryId)
    return found ? found.subcategories.map((sub) => ({ value: sub.id, label: sub.name })) : []
  }, [categoryId, categoryList])

  const handleCategoryChange = (option: SelectOption | null) => {
    setCategoryId(option?.value ?? null)
    setSubcategoryId(null)
    setErrors((prev) => ({ ...prev, category: undefined }))
  }

  const handleSubcategoryChange = (option: SelectOption | null) => {
    setSubcategoryId(option?.value ?? null)
    setErrors((prev) => ({ ...prev, subcategory: undefined }))
    if (option) {
      const requiredCategoryId = categoryBySubcategory[option.value]
      if (requiredCategoryId && requiredCategoryId !== categoryId) {
        setCategoryId(requiredCategoryId)
      }
    }
  }

  const validate = (): StepThreeErrors => {
    const nextErrors: StepThreeErrors = {}

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      nextErrors.title = 'Введите название навыка'
    } else if (trimmedTitle.length < TITLE_MIN_LENGTH) {
      nextErrors.title = `Минимум ${TITLE_MIN_LENGTH} символа`
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      nextErrors.title = `Максимум ${TITLE_MAX_LENGTH} символов`
    }

    if (!categoryId) {
      nextErrors.category = 'Выберите категорию'
    }

    if (!subcategoryId) {
      nextErrors.subcategory = 'Выберите подкатегорию'
    }

    if (!trimmedDescription) {
      nextErrors.description = 'Введите описание'
    } else if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
      nextErrors.description = `Максимум ${DESCRIPTION_MAX_LENGTH} символов`
    }

    return nextErrors
  }

  const isFormValid =
    title.trim().length >= TITLE_MIN_LENGTH &&
    title.trim().length <= TITLE_MAX_LENGTH &&
    Boolean(categoryId) &&
    Boolean(subcategoryId) &&
    description.trim().length > 0 &&
    description.trim().length <= DESCRIPTION_MAX_LENGTH

  const collectValues = (): RegistrationSkillDraft => ({
    title,
    categoryId,
    subcategoryId,
    description,
    imageUrls,
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onNext(collectValues())
    }
  }

  const titleLengthError =
    title.length > 0 && title.trim().length < TITLE_MIN_LENGTH
      ? `Минимум ${TITLE_MIN_LENGTH} символа`
      : undefined

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.inputs}>
        <Input
          name="title"
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          error={errors.title ?? titleLengthError}
          onChange={(event) => {
            setTitle(event.target.value)
            setErrors((prev) => ({ ...prev, title: undefined }))
          }}
        />
        <Select
          label="Категория навыка"
          placeholder="Выберите категорию"
          options={categoryOptions}
          value={categoryOptions.find((option) => option.value === categoryId) ?? null}
          error={errors.category}
          onChange={handleCategoryChange}
        />
        <Select
          label="Подкатегория навыка"
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          value={subcategoryOptions.find((option) => option.value === subcategoryId) ?? null}
          error={errors.subcategory}
          onChange={handleSubcategoryChange}
        />
        <Textarea
          name="description"
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          rows={4}
          value={description}
          maxLength={DESCRIPTION_MAX_LENGTH}
          error={errors.description}
          onChange={(event) => {
            setDescription(event.target.value)
            setErrors((prev) => ({ ...prev, description: undefined }))
          }}
        />
        <ImageUpload value={imageUrls} onChange={setImageUrls} />
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => onBack(collectValues())}>
          Назад
        </Button>
        <Button type="submit" variant="primary" disabled={!isFormValid}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}
