import { useMemo, useState } from 'react'
import { useCategories } from '@/entities/category/model/useCategories'
import { Button } from '@/shared/ui/Button'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import styles from './RegisterStepThree.module.css'

export interface RegisterStepThreeProps {
  onBack: () => void
  onNext: () => void
}

interface StepThreeErrors {
  title?: string
  category?: string
  subcategory?: string
  description?: string
}

export const RegisterStepThree = ({ onBack, onNext }: RegisterStepThreeProps) => {
  const { categories: categoryList } = useCategories()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<SelectOption | null>(null)
  const [subcategory, setSubcategory] = useState<SelectOption | null>(null)
  const [description, setDescription] = useState('')
  // TODO: ниже состояние для загрузки изображений навыка
  // const [images, setImages] = useState<string[]>([])
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
    if (!category) {
      return categoryList.flatMap((item) => item.subcategories.map((sub) => ({ value: sub.id, label: sub.name })))
    }
    const found = categoryList.find((item) => item.id === category.value)
    return found ? found.subcategories.map((sub) => ({ value: sub.id, label: sub.name })) : []
  }, [category, categoryList])

  const handleCategoryChange = (option: SelectOption | null) => {
    setCategory(option)
    setSubcategory(null)
    setErrors((prev) => ({ ...prev, category: undefined }))
  }

  const handleSubcategoryChange = (option: SelectOption | null) => {
    setSubcategory(option)
    setErrors((prev) => ({ ...prev, subcategory: undefined }))
    if (option) {
      const requiredCategoryValue = categoryBySubcategory[option.value]
      if (requiredCategoryValue && requiredCategoryValue !== category?.value) {
        const found = categoryOptions.find((item) => item.value === requiredCategoryValue)
        if (found) setCategory(found)
      }
    }
  }

  const validate = (): StepThreeErrors => {
    const nextErrors: StepThreeErrors = {}
    if (!title.trim()) nextErrors.title = 'Введите название навыка'
    if (!category) nextErrors.category = 'Выберите категорию'
    if (!subcategory) nextErrors.subcategory = 'Выберите подкатегорию'
    if (!description.trim()) nextErrors.description = 'Введите описание'
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
      <div className={styles.inputs}>
        <Input
          name="title"
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          value={title}
          error={errors.title}
          onChange={(event) => {
            setTitle(event.target.value)
            setErrors((prev) => ({ ...prev, title: undefined }))
          }}
        />
        <Select
          label="Категория навыка"
          placeholder="Выберите категорию"
          options={categoryOptions}
          value={category}
          error={errors.category}
          onChange={handleCategoryChange}
        />
        <Select
          label="Подкатегория навыка"
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          value={subcategory}
          error={errors.subcategory}
          onChange={handleSubcategoryChange}
        />
        <Textarea
          name="description"
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          rows={4}
          value={description}
          error={errors.description}
          onChange={(event) => {
            setDescription(event.target.value)
            setErrors((prev) => ({ ...prev, description: undefined }))
          }}
        />
        <ImageUpload />
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
