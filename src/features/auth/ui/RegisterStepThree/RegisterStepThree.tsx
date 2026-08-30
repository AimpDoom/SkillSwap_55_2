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

export const RegisterStepThree = ({ onBack, onNext }: RegisterStepThreeProps) => {
  const { categories: categoryList } = useCategories()

  const [category, setCategory] = useState<SelectOption | null>(null)
  const [subcategory, setSubcategory] = useState<SelectOption | null>(null)
  // TODO: ниже состояние для загрузки изображений навыка
  // const [images, setImages] = useState<string[]>([])

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
  }

  const handleSubcategoryChange = (option: SelectOption | null) => {
    setSubcategory(option)
    if (option) {
      const requiredCategoryValue = categoryBySubcategory[option.value]
      if (requiredCategoryValue && requiredCategoryValue !== category?.value) {
        const found = categoryOptions.find((item) => item.value === requiredCategoryValue)
        if (found) setCategory(found)
      }
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onNext()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.inputs}>
        <Input name="title" label="Название навыка" placeholder="Введите название вашего навыка" />
        <Select
          label="Категория навыка"
          placeholder="Выберите категорию"
          options={categoryOptions}
          value={category}
          onChange={handleCategoryChange}
        />
        <Select
          label="Подкатегория навыка"
          placeholder="Выберите подкатегорию"
          options={subcategoryOptions}
          value={subcategory}
          onChange={handleSubcategoryChange}
        />
        <Textarea
          name="description"
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          rows={4}
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
